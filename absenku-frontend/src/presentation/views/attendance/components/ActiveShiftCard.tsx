import React, { useState } from "react";
import { ShieldCheckIcon } from "@/presentation/components/common/icons";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";
import { useActiveShift } from "@/presentation/hooks/useActiveShift";
import { useClockOutCamera } from "@/presentation/hooks/useClockOutCamera";
import { ShiftDurationTracker } from "./active-shift/ShiftDurationTracker";
import { ClockInPhotoPreview } from "./active-shift/ClockInPhotoPreview";
import { ActiveShiftClockOut } from "./active-shift/ActiveShiftClockOut";

interface ActiveShiftCardProps {
  attendanceRecord: AttendanceEntity;
  onClockOut?: (photo: string) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const ActiveShiftCard: React.FC<ActiveShiftCardProps> = ({
  attendanceRecord,
  onClockOut,
  isSubmitting = false,
  error = null,
}) => {
  const [isClockOutSectionOpen, setIsClockOutSectionOpen] = useState(false);

  const {
    elapsedHours,
    remainingMinutes,
    progressPercent,
    isTargetCompleted,
    isPhotoExpanded,
    togglePhotoExpanded,
    photoSrc,
  } = useActiveShift({
    timestamp: attendanceRecord.timestamp,
    photoUrl: attendanceRecord.photoUrl,
  });

  const {
    videoRef,
    photoPreview,
    isCameraStreaming,
    cameraError,
    isPermissionBlocked,
    startCamera,
    captureSnapshot,
    retakePhoto,
  } = useClockOutCamera();

  const handleOpenClockOut = () => {
    setIsClockOutSectionOpen(true);
    startCamera();
  };

  const handleCloseClockOut = () => {
    setIsClockOutSectionOpen(false);
    retakePhoto();
  };

  const handleSaveClockOut = () => {
    if (photoPreview && onClockOut) {
      onClockOut(photoPreview);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Presensi Mandiri
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Status Kehadiran Hari Ini
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sedang Bekerja</span>
        </span>
      </div>

      <ShiftDurationTracker
        attendanceRecord={attendanceRecord}
        elapsedHours={elapsedHours}
        remainingMinutes={remainingMinutes}
        progressPercent={progressPercent}
        isTargetCompleted={isTargetCompleted}
      />

      <ClockInPhotoPreview
        attendanceRecord={attendanceRecord}
        photoSrc={photoSrc}
        isPhotoExpanded={isPhotoExpanded}
        onToggleExpand={togglePhotoExpanded}
      />

      <ActiveShiftClockOut
        isOpen={isClockOutSectionOpen}
        onOpen={handleOpenClockOut}
        onClose={handleCloseClockOut}
        videoRef={videoRef}
        photoPreview={photoPreview}
        isCameraStreaming={isCameraStreaming}
        isPermissionBlocked={isPermissionBlocked}
        cameraError={cameraError}
        onRetake={retakePhoto}
        onStartCamera={startCamera}
        onCapture={captureSnapshot}
        onConfirmSave={handleSaveClockOut}
        isSubmitting={isSubmitting}
        error={error}
      />

      <p className="text-center text-[10px] sm:text-[11px] text-slate-400 font-medium leading-relaxed">
        <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400 inline-block mr-1.5 align-[-2px] flex-shrink-0" />
        <span className="sm:whitespace-nowrap">
          Waktu presensi otomatis sinkron dengan server Absenku.
        </span>
      </p>
    </div>
  );
};
