import { useState, useMemo } from "react";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export function useTodayCompleted(
  attendanceRecord: AttendanceEntity,
  targetHours: number = 8,
) {
  const [activePhotoModal, setActivePhotoModal] = useState<"in" | "out" | null>(null);

  const clockInPhotoSrc = useMemo(() => {
    return attendanceRecord.photoUrl?.startsWith("data:")
      ? attendanceRecord.photoUrl
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${attendanceRecord.photoUrl}`;
  }, [attendanceRecord.photoUrl]);

  const clockOutPhotoSrc = useMemo(() => {
    return attendanceRecord.clockOutPhotoUrl?.startsWith("data:")
      ? attendanceRecord.clockOutPhotoUrl
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}${attendanceRecord.clockOutPhotoUrl || ""}`;
  }, [attendanceRecord.clockOutPhotoUrl]);

  const clockOutTime = useMemo(() => {
    return attendanceRecord.clockOutAt
      ? new Date(attendanceRecord.clockOutAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  }, [attendanceRecord.clockOutAt]);

  const elapsedMinutes = useMemo(() => {
    if (attendanceRecord.timestamp && attendanceRecord.clockOutAt) {
      const start = new Date(attendanceRecord.timestamp).getTime();
      const end = new Date(attendanceRecord.clockOutAt).getTime();
      return Math.max(0, Math.floor((end - start) / (1000 * 60)));
    }
    if (attendanceRecord.workDurationHours) {
      return Math.round(attendanceRecord.workDurationHours * 60);
    }
    return 0;
  }, [
    attendanceRecord.timestamp,
    attendanceRecord.clockOutAt,
    attendanceRecord.workDurationHours,
  ]);

  const targetMinutes = targetHours * 60;

  const progressPercent = useMemo(() => {
    if (targetMinutes <= 0) return 0;
    return Math.min(100, Math.round((elapsedMinutes / targetMinutes) * 100));
  }, [elapsedMinutes, targetMinutes]);

  const isTargetMet = useMemo(() => {
    if (typeof attendanceRecord.isTargetMet === "boolean") {
      return attendanceRecord.isTargetMet;
    }
    return elapsedMinutes >= targetMinutes;
  }, [attendanceRecord.isTargetMet, elapsedMinutes, targetMinutes]);

  const durationText = useMemo(() => {
    if (attendanceRecord.workDurationLabel) {
      return attendanceRecord.workDurationLabel;
    }
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;
    if (hours === 0 && minutes === 0) return "-";
    return `${hours} Jam ${minutes} Menit`;
  }, [attendanceRecord.workDurationLabel, elapsedMinutes]);

  return {
    activePhotoModal,
    setActivePhotoModal,
    clockInPhotoSrc,
    clockOutPhotoSrc,
    clockOutTime,
    durationText,
    progressPercent,
    isTargetMet,
  };
}
