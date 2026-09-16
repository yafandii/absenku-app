import { useState, useEffect, useRef, useCallback } from "react";

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

interface UseDashboardCameraProps {
  isStreamingPaused?: boolean;
}

export function useDashboardCamera({
  isStreamingPaused = false,
}: UseDashboardCameraProps = {}): DashboardCamera {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPermissionBlocked, setIsPermissionBlocked] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getCameraSettingsUrl = useCallback((): string => {
    if (typeof window === "undefined") return "chrome://settings/content/camera";
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("edg/")) return "edge://settings/content/camera";
    if (ua.includes("brave")) return "brave://settings/content/camera";
    if (ua.includes("opr/") || ua.includes("opera")) return "opera://settings/content/camera";
    if (ua.includes("firefox")) return "about:preferences#permissionsData";
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
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Kamera tidak didukung di peramban ini");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
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
          (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) ||
        (typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name: string }).name === "NotAllowedError");

      if (isBlocked) {
        setIsPermissionBlocked(true);
        setCameraError("Izin kamera diblokir oleh peramban");
      } else {
        setIsPermissionBlocked(false);
        setCameraError("Kamera sedang digunakan aplikasi lain atau tidak tersedia");
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
      const vWidth = video.videoWidth || 640;
      const vHeight = video.videoHeight || 480;
      const size = Math.min(vWidth, vHeight);
      const startX = (vWidth - size) / 2;
      const startY = (vHeight - size) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhotoPreview(dataUrl);
        stopStream();
      }
    }
  }, [isCameraStreaming, stopStream]);

  const retakePhoto = useCallback(() => {
    setPhotoPreview(null);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (isStreamingPaused || photoPreview) {
      stopMediaTracks();
      return;
    }

    const initStream = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
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
            (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) ||
          (typeof err === "object" &&
            err !== null &&
            "name" in err &&
            (err as { name: string }).name === "NotAllowedError");

        if (isBlocked) {
          setIsPermissionBlocked(true);
          setCameraError("Izin kamera diblokir oleh peramban");
        } else {
          setIsPermissionBlocked(false);
          setCameraError("Kamera sedang digunakan aplikasi lain atau tidak tersedia");
        }
      }
    };

    initStream();

    return () => {
      isCancelled = true;
      stopMediaTracks();
    };
  }, [isStreamingPaused, photoPreview, stopMediaTracks]);

  return {
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
  };
}
