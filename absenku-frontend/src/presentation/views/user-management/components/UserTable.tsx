import React from "react";
import { User } from "@/domain/entities/user.entity";
import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  KeyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/presentation/components/common/icons";

interface UserTableProps {
  users: User[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onItemsPerPageChange?: (perPage: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
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

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onNextPage,
  onPrevPage,
  onItemsPerPageChange,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <UsersIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">
            Tidak ada data karyawan ditemukan
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Coba sesuaikan kata kunci pencarian atau filter role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4 sm:px-6">Karyawan</th>
              <th className="py-3.5 px-4">NIK</th>
              <th className="py-3.5 px-4">Divisi</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((item) => {
              const isHrd = item.role?.toUpperCase() === "HRD";
              const isActive = item.isActive ?? true;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
                        {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {item.name || "-"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {item.email || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {item.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {item.division?.name || "Belum Ada Divisi"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isHrd
                          ? "bg-violet-50 text-violet-700 border border-violet-200/70"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {isHrd ? "HRD / Admin" : "Karyawan"}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-rose-50 text-rose-700 border border-rose-200/60"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      <span>{isActive ? "Aktif" : "Nonaktif"}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        title="Edit Karyawan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onResetPassword(item)}
                        title="Reset Password Karyawan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <KeyIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        title="Hapus Karyawan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              karyawan
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
