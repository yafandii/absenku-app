import React from "react";
import {
  SearchIcon,
  DownloadIcon,
  CalendarIcon,
  CloseIcon,
} from "@/presentation/components/common/icons";
import { AttendanceStatusFilter } from "../types";

interface DivisionOption {
  id: string;
  name: string;
}

interface MonitorFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  divisionFilter: string;
  onDivisionFilterChange: (divId: string) => void;
  divisions: DivisionOption[];
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  statusFilter: AttendanceStatusFilter;
  onStatusFilterChange: (status: AttendanceStatusFilter) => void;
  totalResults: number;
  onDownload: (format: "excel" | "csv" | "pdf") => void;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export const MonitorFilterBar: React.FC<MonitorFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  divisionFilter,
  onDivisionFilterChange,
  divisions,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  totalResults,
  onDownload,
}) => {
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsExportOpen(false);
      }
    };
    if (isExportOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExportOpen]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 flex-1">
          <div className="relative flex-1 min-w-0">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, NIK, atau email..."
              className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                title="Hapus pencarian"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
            <div className="relative min-w-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="w-full pl-8.5 pr-7 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer truncate"
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => onDateFilterChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
                  title="Tampilkan semua tanggal"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="min-w-0">
              <select
                value={divisionFilter}
                onChange={(e) => onDivisionFilterChange(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer truncate"
              >
                <option value="ALL">Semua Divisi</option>
                {divisions.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsExportOpen((prev) => !prev)}
            disabled={totalResults === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Unduh Laporan</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-700/70 text-[10px] font-mono">
              {totalResults}
            </span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 transition-transform ${isExportOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isExportOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-30 animate-in zoom-in-95 duration-100">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Pilih Format Laporan
              </div>
              <div className="space-y-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportOpen(false);
                    onDownload("excel");
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50 text-left transition-colors cursor-pointer group"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    XLSX
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                      Microsoft Excel (.xlsx)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Format tabel asli, siap olah rumus
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportOpen(false);
                    onDownload("pdf");
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-rose-50 text-left transition-colors cursor-pointer group"
                >
                  <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    PDF
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                      Dokumen PDF (.pdf)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Siap cetak & arsip resmi
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportOpen(false);
                    onDownload("csv");
                  }}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-indigo-50 text-left transition-colors cursor-pointer group"
                >
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    CSV
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                      Data CSV (.csv)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Format teks mentah standar
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 flex-shrink-0">
          Status:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 -mr-1 pr-1">
          {(
            [
              { id: "ALL", label: "Semua" },
              { id: "ON_TIME", label: "Tepat Waktu" },
              { id: "LATE", label: "Terlambat" },
              { id: "NOT_CHECKED_OUT", label: "Belum Checkout" },
            ] as const
          ).map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 active:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
