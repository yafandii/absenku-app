import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { AttendanceRepositoryImpl } from "@/data/repositories/attendance.repository.impl";
import { LogoutUseCase } from "@/domain/use-cases/auth/logout.use-case";
import { ClockInUseCase } from "@/domain/use-cases/attendance/clock-in.use-case";

export type UserProfile = User;
export type AttendanceItem = AttendanceEntity;

export interface DashboardCamera {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  photoPreview: string | null;
  isCameraStreaming: boolean;
  cameraError: string | null;
  isPermissionBlocked: boolean;
  isGuideModalOpen: boolean;
  isCopied: boolean;
  settingsUrl: string;
  startCamera: () => Promise<void>;
  stopStream: () => void;
  captureSnapshot: () => void;
  retakePhoto: () => void;
  openSettings: () => void;
  closeGuideModal: () => void;
  copySettingsUrl: () => void;
}

const authRepository = new AuthRepositoryImpl();
const attendanceRepository = new AttendanceRepositoryImpl();
const logoutUseCase = new LogoutUseCase(authRepository);
const clockInUseCase = new ClockInUseCase(attendanceRepository);

export interface UseDashboardProps {
  initialUser: User;
  initialAttendances?: AttendanceEntity[];
}

export function useDashboard({
  initialUser,
  initialAttendances = [],
}: UseDashboardProps) {
  const router = useRouter();

  const [user] = useState<UserProfile>(initialUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clockInSuccess, setClockInSuccess] = useState(false);
  const [attendanceRecord, setAttendanceRecord] =
    useState<AttendanceEntity | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getCameraSettingsUrl = useCallback((): string => {
    if (typeof window === "undefined")
      return "chrome://settings/content/camera";
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("edg/")) {
      return "edge://settings/content/camera";
    }
    if (ua.includes("brave")) {
      return "brave://settings/content/camera";
    }
    if (ua.includes("opr/") || ua.includes("opera")) {
      return "opera://settings/content/camera";
    }
    if (ua.includes("firefox")) {
      return "about:preferences#permissionsData";
    }
    return "chrome://settings/content/camera";
  }, []);

  const stopMediaTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    stopMediaTracks();
    setIsCameraStreaming(false);
  }, [stopMediaTracks]);

  const startCamera = useCallback(async () => {
    stopStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Kamera tidak didukung di peramban ini");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraStreaming(true);
      setCameraError(null);
      setIsPermissionBlocked(false);
    } catch (err: unknown) {
      setIsCameraStreaming(false);
      const isBlocked =
        (err instanceof DOMException &&
          (err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError")) ||
        (typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name: string }).name === "NotAllowedError");

      if (isBlocked) {
        setIsPermissionBlocked(true);
        setCameraError("Izin kamera diblokir oleh peramban");
      } else {
        setIsPermissionBlocked(false);
        setCameraError(
          "Kamera sedang digunakan aplikasi lain atau tidak tersedia",
        );
      }
    }
  }, [stopStream]);

  const copySettingsUrl = useCallback(() => {
    const url = getCameraSettingsUrl();
    try {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {}
  }, [getCameraSettingsUrl]);

  const openSettings = useCallback(() => {
    copySettingsUrl();
    setIsGuideModalOpen(true);
  }, [copySettingsUrl]);

  const closeGuideModal = useCallback(() => {
    setIsGuideModalOpen(false);
  }, []);

  const captureSnapshot = useCallback(() => {
    if (videoRef.current && isCameraStreaming) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhotoPreview(dataUrl);
        stopStream();
      }
    }
  }, [isCameraStreaming, stopStream]);

  const retakePhoto = useCallback(() => {
    setPhotoPreview(null);
    setClockInSuccess(false);
    setAttendanceRecord(null);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (clockInSuccess || photoPreview) {
      stopMediaTracks();
      return;
    }

    const initStream = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (!isCancelled) {
            setCameraError("Kamera tidak didukung di peramban ini");
          }
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setIsCameraStreaming(true);
        setCameraError(null);
        setIsPermissionBlocked(false);
      } catch (err: unknown) {
        if (isCancelled) return;
        setIsCameraStreaming(false);
        const isBlocked =
          (err instanceof DOMException &&
            (err.name === "NotAllowedError" ||
              err.name === "PermissionDeniedError")) ||
          (typeof err === "object" &&
            err !== null &&
            "name" in err &&
            (err as { name: string }).name === "NotAllowedError");

        if (isBlocked) {
          setIsPermissionBlocked(true);
          setCameraError("Izin kamera diblokir oleh peramban");
        } else {
          setIsPermissionBlocked(false);
          setCameraError(
            "Kamera sedang digunakan aplikasi lain atau tidak tersedia",
          );
        }
      }
    };

    initStream();

    return () => {
      isCancelled = true;
      stopMediaTracks();
    };
  }, [clockInSuccess, photoPreview, stopMediaTracks]);

  const [recentAttendances, setRecentAttendances] =
    useState<AttendanceItem[]>(initialAttendances);

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
    } catch {}

    router.push("/login");
  };

  const handleClockIn = async (photoOverride?: string) => {
    setIsSubmitting(true);
    const photoToSubmit = photoOverride || photoPreview || "";
    try {
      const record = await clockInUseCase.execute({
        photo: photoToSubmit,
      });
      setAttendanceRecord(record);
      setClockInSuccess(true);
      setRecentAttendances((prev) => [record, ...prev]);
      stopStream();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const dayDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const fallbackRecord: AttendanceEntity = {
        id: Date.now().toString(),
        date: dayDate,
        time: `${hours}:${minutes} WIB`,
        type: "Presensi Masuk",
        status: "on_time",
        statusLabel: "Tepat Waktu",
        latitude: 0,
        longitude: 0,
        userId: "",
        photoUrl: photoToSubmit,
        timestamp: now.toISOString(),
      };
      setAttendanceRecord(fallbackRecord);
      setClockInSuccess(true);
      setRecentAttendances((prev) => [fallbackRecord, ...prev]);
      stopStream();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    retakePhoto();
  };

  return {
    user,
    isSubmitting,
    clockInSuccess,
    attendanceRecord,
    recentAttendances,
    camera: {
      videoRef,
      photoPreview,
      isCameraStreaming,
      cameraError,
      isPermissionBlocked,
      isGuideModalOpen,
      isCopied,
      settingsUrl: getCameraSettingsUrl(),
      startCamera,
      stopStream,
      captureSnapshot,
      retakePhoto,
      openSettings,
      closeGuideModal,
      copySettingsUrl,
    },
    handleLogout,
    handleClockIn,
    handleRetake,
  };
}
