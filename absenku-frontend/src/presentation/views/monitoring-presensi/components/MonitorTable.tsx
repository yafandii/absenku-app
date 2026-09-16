import React from "react";
import {
  ClockIcon,
  CheckIcon,
  EyeIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/presentation/components/common/icons";
import { MonitorAttendanceItem } from "../types";

interface MonitorTableProps {
  items: MonitorAttendanceItem[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onItemsPerPageChange?: (perPage: number) => void;
  onOpenDetail: (item: MonitorAttendanceItem) => void;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export const MonitorTable: React.FC<MonitorTableProps> = ({
  items,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onNextPage,
  onPrevPage,
  onItemsPerPageChange,
  onOpenDetail,
}) => {
  const getFullPhotoUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <SearchIcon className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Tidak Ada Data Presensi
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Tidak ditemukan riwayat kehadiran untuk tanggal dan filter yang Anda pilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const isOnTime = item.status === "on_time";
          const photoUrl = getFullPhotoUrl(item.photoUrl);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                    {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {item.userName || "-"}
                    </p>
                    <p className="text-xs text-slate-400 font-mono font-medium truncate">
                      NIK: {item.userNik || item.userId}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${
                    isOnTime
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border border-amber-200/60"
                  }`}
                >
                  {isOnTime ? (
                    <CheckIcon className="w-3 h-3" />
                  ) : (
                    <ClockIcon className="w-3 h-3" />
                  )}
                  <span>{isOnTime ? "Tepat Waktu" : "Terlambat"}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/80 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Masuk
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                    {item.timeIn || "-"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Pulang
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                    {item.timeOut || "Belum"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Durasi
                  </span>
                  <span className="text-xs font-bold text-indigo-600 block mt-0.5 truncate">
                    {item.workDurationLabel || "-"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold truncate">
                    {item.divisionName || "Tanpa Divisi"}
                  </span>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-semibold hover:underline"
                    >
                      <span className="w-5 h-5 rounded-md overflow-hidden border border-slate-200 inline-block align-middle flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoUrl}
                          alt={item.userName}
                          className="w-full h-full object-cover"
                        />
                      </span>
                      <span>Foto</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <EyeIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Karyawan</th>
                <th className="py-3.5 px-4">Divisi</th>
                <th className="py-3.5 px-4">Waktu Masuk</th>
                <th className="py-3.5 px-4">Waktu Pulang</th>
                <th className="py-3.5 px-4">Durasi Kerja</th>
                <th className="py-3.5 px-4">Foto Bukti</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => {
                const isOnTime = item.status === "on_time";
                const photoUrl = getFullPhotoUrl(item.photoUrl);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                          {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {item.userName || "-"}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium truncate">
                            NIK: {item.userNik || item.userId}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {item.divisionName || "-"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-slate-800 text-xs block">
                          {item.timeIn || "-"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOnTime
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                              : "bg-amber-50 text-amber-700 border border-amber-200/50"
                          }`}
                        >
                          {isOnTime ? (
                            <CheckIcon className="w-3 h-3" />
                          ) : (
                            <ClockIcon className="w-3 h-3" />
                          )}
                          <span>{isOnTime ? "Tepat Waktu" : "Terlambat"}</span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.timeOut ? (
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {item.timeOut}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold">
                          Belum Checkout
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 text-xs">
                        {item.workDurationLabel || "-"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {photoUrl ? (
                        <button
                          type="button"
                          onClick={() => onOpenDetail(item)}
                          className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-indigo-500/30 transition-all cursor-pointer block"
                          title="Klik untuk perbesar"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={item.userName}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalItems !== undefined && totalItems > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>
              Menampilkan{" "}
              <strong className="text-slate-900 font-bold">
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-slate-900 font-bold">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-900 font-bold">{totalItems}</strong>{" "}
              data
            </span>

            {onItemsPerPageChange && (
              <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                <span className="text-slate-400 text-[11px]">Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                if (p === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="px-2 text-slate-400 font-mono text-xs"
                    >
                      ...
                    </span>
                  );
                }
                const isCurrent = p === currentPage;
                return (
                  <button
                    key={`page-${p}`}
                    type="button"
                    onClick={() => onPageChange?.(Number(p))}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/30"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
