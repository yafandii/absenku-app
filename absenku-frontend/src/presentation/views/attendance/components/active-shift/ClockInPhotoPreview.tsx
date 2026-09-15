import React from "react";
import { CheckIcon } from "@/presentation/components/common/icons";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

interface ClockInPhotoPreviewProps {
  attendanceRecord: AttendanceEntity;
  photoSrc: string;
  isPhotoExpanded: boolean;
  onToggleExpand: () => void;
}

export const ClockInPhotoPreview: React.FC<ClockInPhotoPreviewProps> = ({
  attendanceRecord,
  photoSrc,
  isPhotoExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc}
              alt="Foto Presensi Masuk"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs truncate">
              <CheckIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Foto Presensi Masuk Terverifikasi</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Tercatat pada {attendanceRecord.date} • {attendanceRecord.timeIn}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleExpand}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50/80 transition-colors flex-shrink-0 cursor-pointer"
        >
          {isPhotoExpanded ? "Tutup Foto" : "Lihat Foto"}
        </button>
      </div>

      {isPhotoExpanded && (
        <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-slate-950 border border-slate-200/80 animate-in fade-in duration-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt="Foto Presensi Masuk"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-semibold border border-slate-700 flex items-center gap-2">
            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Presensi Masuk: {attendanceRecord.timeIn} WIB</span>
          </div>
        </div>
      )}
    </div>
  );
};
