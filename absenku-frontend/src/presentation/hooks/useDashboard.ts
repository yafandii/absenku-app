import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { AttendanceRepositoryImpl } from "@/data/repositories/attendance.repository.impl";
import { LogoutUseCase } from "@/domain/use-cases/auth/logout.use-case";
import { ClockInUseCase } from "@/domain/use-cases/attendance/clock-in.use-case";
import { ClockOutUseCase } from "@/domain/use-cases/attendance/clock-out.use-case";
import { getCurrentLocation } from "@/infrastructure/geolocation/geolocation.service";
import { getApiErrorMessage } from "@/infrastructure/http/api-error";
import { useDashboardCamera, DashboardCamera } from "./useDashboardCamera";

export type UserProfile = User;
export type AttendanceItem = AttendanceEntity;
export type { DashboardCamera };

const authRepository = new AuthRepositoryImpl();
const attendanceRepository = new AttendanceRepositoryImpl();
const logoutUseCase = new LogoutUseCase(authRepository);
const clockInUseCase = new ClockInUseCase(attendanceRepository);
const clockOutUseCase = new ClockOutUseCase(attendanceRepository);

export interface UseDashboardProps {
  initialUser: User;
  initialAttendances?: AttendanceEntity[];
  initialTodayAttendance?: AttendanceEntity | null;
}

export function useDashboard({
  initialUser,
  initialAttendances = [],
  initialTodayAttendance = null,
}: UseDashboardProps) {
  const router = useRouter();

  const [user] = useState<UserProfile>(initialUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceRecord, setAttendanceRecord] =
    useState<AttendanceEntity | null>(initialTodayAttendance);
  const [clockInSuccess, setClockInSuccess] = useState<boolean>(
    Boolean(initialTodayAttendance),
  );
  const [clockInError, setClockInError] = useState<string | null>(null);
  const [isClockOutSubmitting, setIsClockOutSubmitting] = useState(false);
  const [clockOutError, setClockOutError] = useState<string | null>(null);
  const [recentAttendances, setRecentAttendances] =
    useState<AttendanceItem[]>(initialAttendances);

  const camera = useDashboardCamera({
    isStreamingPaused: clockInSuccess,
  });

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
    } catch {}

    router.push("/login");
  };

  const handleClockIn = async (photoOverride?: string) => {
    setIsSubmitting(true);
    setClockInError(null);
    const photoToSubmit = photoOverride || camera.photoPreview || "";

    try {
      const { latitude, longitude } = await getCurrentLocation();

      const record = await clockInUseCase.execute({
        photo: photoToSubmit,
        lat: latitude,
        lng: longitude,
      });

      setAttendanceRecord(record);
      setClockInSuccess(true);
      setRecentAttendances((prev) => [record, ...prev]);
      camera.stopStream();
    } catch (err: unknown) {
      let message = "Terjadi kesalahan saat mencatat presensi.";

      if (
        typeof window !== "undefined" &&
        err instanceof GeolocationPositionError
      ) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message =
              "Izin lokasi ditolak. Harap izinkan akses lokasi di browser untuk absensi.";
            break;
          case err.POSITION_UNAVAILABLE:
            message =
              "Lokasi tidak terdeteksi. Pastikan GPS perangkat Anda aktif.";
            break;
          case err.TIMEOUT:
            message =
              "Waktu pencarian sinyal GPS habis. Silakan coba beberapa saat lagi.";
            break;
        }
      } else {
        message = getApiErrorMessage(err);
      }

      setClockInError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async (photo: string) => {
    if (!attendanceRecord) {
      setClockOutError(
        "Data presensi masuk hari ini tidak ditemukan. Silakan muat ulang halaman.",
      );
      return;
    }
    setIsClockOutSubmitting(true);
    setClockOutError(null);

    try {
      const { latitude, longitude } = await getCurrentLocation();

      const record = await clockOutUseCase.execute({
        attendanceId: attendanceRecord.id,
        photo,
        lat: latitude,
        lng: longitude,
      });

      setAttendanceRecord(record);
      setRecentAttendances((prev) =>
        prev.map((att) => (att.id === record.id ? record : att)),
      );
    } catch (err: unknown) {
      let message = "Terjadi kesalahan saat mencatat presensi pulang.";

      if (
        typeof window !== "undefined" &&
        err instanceof GeolocationPositionError
      ) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message =
              "Izin lokasi ditolak. Harap izinkan akses lokasi di browser untuk presensi pulang.";
            break;
          case err.POSITION_UNAVAILABLE:
            message =
              "Lokasi tidak terdeteksi. Pastikan GPS perangkat Anda aktif.";
            break;
          case err.TIMEOUT:
            message =
              "Waktu pencarian sinyal GPS habis. Silakan coba beberapa saat lagi.";
            break;
        }
      } else {
        message = getApiErrorMessage(err);
      }

      setClockOutError(message);
    } finally {
      setIsClockOutSubmitting(false);
    }
  };

  const handleRetake = () => {
    camera.retakePhoto();
  };

  return {
    user,
    isSubmitting,
    clockInSuccess,
    clockInError,
    attendanceRecord,
    recentAttendances,
    isClockOutSubmitting,
    clockOutError,
    camera,
    handleLogout,
    handleClockIn,
    handleClockOut,
    handleRetake,
  };
}
