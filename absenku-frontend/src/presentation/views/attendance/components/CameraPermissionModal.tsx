import React from "react";
import { CameraIcon, CheckIcon } from "@/presentation/components/common/icons";

interface CameraPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  settingsUrl: string;
  isCopied: boolean;
  onCopy: () => void;
  onConfirm: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onClose,
  settingsUrl,
  isCopied,
  onCopy,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <CameraIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Atur Izin Kamera via URL
              </h3>
              <p className="text-xs text-slate-500">
                Buka pengaturan langsung di tab baru browser
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              URL Pengaturan Kamera
            </span>
            {isCopied && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckIcon className="w-3 h-3" />
                <span>Tersalin ke Clipboard!</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-200">
            <span className="text-xs font-mono font-semibold text-slate-700 truncate select-all">
              {settingsUrl}
            </span>
            <button
              type="button"
              onClick={onCopy}
              className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors flex-shrink-0 cursor-pointer shadow-sm"
            >
              {isCopied ? "Tersalin" : "Salin URL"}
            </button>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">
            Cara mengaktifkan di laptop atau HP:
          </p>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
              1
            </span>
            <p className="leading-relaxed">
              Salin URL pengaturan di atas (tombol <strong>Salin URL</strong>).
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
              2
            </span>
            <p className="leading-relaxed">
              Buka <strong>tab baru</strong> pada browser Anda, tempel (<em>paste</em>) URL tersebut di kolom alamat lalu tekan <strong>Enter</strong>.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
              3
            </span>
            <p className="leading-relaxed">
              Ubah izin Kamera menjadi <strong>Izinkan (Allow)</strong>, kemudian kembali ke tab ini. Kamera akan <strong>langsung aktif otomatis</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Saya Sudah Mengizinkan / Hubungkan Kamera
          </button>
        </div>
      </div>
    </div>
  );
};
