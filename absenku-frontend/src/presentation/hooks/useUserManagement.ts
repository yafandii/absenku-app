import { useState, useMemo } from "react";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";
import { UserRepositoryImpl } from "@/data/repositories/user.repository.impl";
import { CreateUserUseCase } from "@/domain/use-cases/user/create-user.use-case";
import { UpdateUserUseCase } from "@/domain/use-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "@/domain/use-cases/user/delete-user.use-case";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";
import { GetAllUsersUseCase } from "@/domain/use-cases/user/get-all-users.use-case";

interface UseUserManagementProps {
  initialUsers: User[];
  divisions: BaseMasterEntity[];
}

export const useUserManagement = ({
  initialUsers,
  divisions,
}: UseUserManagementProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userRepository = useMemo(() => new UserRepositoryImpl(), []);
  const createUserUseCase = useMemo(
    () => new CreateUserUseCase(userRepository),
    [userRepository],
  );
  const updateUserUseCase = useMemo(
    () => new UpdateUserUseCase(userRepository),
    [userRepository],
  );
  const deleteUserUseCase = useMemo(
    () => new DeleteUserUseCase(userRepository),
    [userRepository],
  );

  const getAllUsersUseCase = useMemo(
    () => new GetAllUsersUseCase(userRepository),
    [userRepository],
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter.toUpperCase() === "ALL" ||
        user.role?.toUpperCase() === roleFilter.toUpperCase();

      return matchesQuery && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive ?? true).length;
    const hrdCount = users.filter(
      (u) => u.role?.toUpperCase() === "HRD",
    ).length;

    const divisionSet = new Set<string>();
    users.forEach((u) => {
      if (u.division?.name) divisionSet.add(u.division.name);
    });

    return {
      totalUsers,
      activeUsers,
      hrdCount,
      totalDivisions: divisionSet.size,
    };
  }, [users]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingUser(null);
    setFormError(null);
  };

  const openDeleteConfirm = (user: User) => {
    setDeletingUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingUser(null);
  };

  const handleCreateUser = async (payload: CreateUserDto) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await createUserUseCase.execute(payload);

      await refreshUsers();
      closeFormModal();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menambahkan karyawan.";
      setFormError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshUsers = async () => {
    try {
      const freshUsers = await getAllUsersUseCase.execute();
      setUsers(freshUsers);
    } catch (err) {
      console.error("Gagal refresh data karyawan:", err);
    }
  };

  const handleUpdateUser = async (payload: UpdateUserDto) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await updateUserUseCase.execute(payload);

      await refreshUsers();
      closeFormModal();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui data karyawan.";
      setFormError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      await deleteUserUseCase.execute(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      closeDeleteConfirm();
    } catch {
      alert("Gagal menghapus data karyawan. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    users,
    filteredUsers,
    stats,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    isFormModalOpen,
    editingUser,
    formError,
    isSubmitting,
    openCreateModal,
    openEditModal,
    closeFormModal,
    handleCreateUser,
    handleUpdateUser,
    isDeleteConfirmOpen,
    deletingUser,
    isDeleting,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    divisions,
  };
};
