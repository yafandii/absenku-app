import React from "react";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";
import { CloseIcon, SpinnerIcon } from "@/presentation/components/common/icons";
import { SearchableSelect } from "@/presentation/components/common/SearchableSelect";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";
import { useUserForm } from "@/presentation/hooks/useUserForm";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  onCreate: (data: CreateUserDto) => Promise<void>;
  onUpdate: (data: UpdateUserDto) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  divisions: BaseMasterEntity[];
}

interface FormInnerProps {
  editingUser: User | null;
  onClose: () => void;
  onCreate: (data: CreateUserDto) => Promise<void>;
  onUpdate: (data: UpdateUserDto) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  divisions: BaseMasterEntity[];
}

const UserFormInner: React.FC<FormInnerProps> = ({
  editingUser,
  onClose,
  onCreate,
  onUpdate,
  isLoading,
  error,
  divisions,
}) => {
  const {
    isEditing,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    selectedDivision,
    setSelectedDivision,
    isActive,
    setIsActive,
    divisionOptions,
    handleSubmit,
  } = useUserForm({
    editingUser,
    divisions,
    onCreate,
    onUpdate,
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              {isEditing ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}
            </h3>
            {isEditing && editingUser && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200/60">
                NIK: {editingUser.id}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEditing
              ? "Perbarui profil dan status akun karyawan."
              : "Lengkapi data karyawan. NIK akan dibuat otomatis oleh sistem."}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nama lengkap"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@perusahaan.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Role Akun
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "EMPLOYEE" | "HRD")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
            >
              <option value="EMPLOYEE">Karyawan Biasa</option>
              <option value="HRD">HRD / Administrator</option>
            </select>
          </div>

          <SearchableSelect
            label="Divisi"
            placeholder="Pilih divisi..."
            searchPlaceholder="Cari divisi..."
            options={divisionOptions}
            value={selectedDivision}
            onChange={(val) => setSelectedDivision(val)}
            isClearable
          />
        </div>

        {!isEditing && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Password Awal
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        )}

        {isEditing && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveCheckbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="isActiveCheckbox"
              className="text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Akun Karyawan Aktif
            </label>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <SpinnerIcon className="w-4 h-4 animate-spin text-white" />
            )}
            <span>{isEditing ? "Simpan Perubahan" : "Tambah Karyawan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  editingUser,
  onCreate,
  onUpdate,
  isLoading,
  error,
  divisions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <UserFormInner
        key={editingUser ? editingUser.id : "create"}
        divisions={divisions}
        editingUser={editingUser}
        onClose={onClose}
        onCreate={onCreate}
        onUpdate={onUpdate}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};
