import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";
import { UserRepositoryImpl } from "@/data/repositories/user.repository.impl";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { CreateUserUseCase } from "@/domain/use-cases/user/create-user.use-case";
import { UpdateUserUseCase } from "@/domain/use-cases/user/update-user.use-case";
import { DeleteUserUseCase } from "@/domain/use-cases/user/delete-user.use-case";
import { GetAllUsersUseCase } from "@/domain/use-cases/user/get-all-users.use-case";
import { ResetPasswordUseCase } from "@/domain/use-cases/user/reset-password.use-case";
import { LogoutUseCase } from "@/domain/use-cases/auth/logout.use-case";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";
import { getApiErrorMessage } from "@/infrastructure/http/api-error";

interface UseUserManagementProps {
  initialUsers: User[];
  divisions: BaseMasterEntity[];
  defaultItemsPerPage?: number;
}

export const useUserManagement = ({
  initialUsers,
  divisions,
  defaultItemsPerPage = 10,
}: UseUserManagementProps) => {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (val: number) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null,
  );

  const userRepository = useMemo(() => new UserRepositoryImpl(), []);
  const authRepository = useMemo(() => new AuthRepositoryImpl(), []);

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
  const resetPasswordUseCase = useMemo(
    () => new ResetPasswordUseCase(userRepository),
    [userRepository],
  );
  const logoutUseCase = useMemo(
    () => new LogoutUseCase(authRepository),
    [authRepository],
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

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, activePage, itemsPerPage]);

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(target);
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      goToPage(activePage + 1);
    }
  };

  const prevPage = () => {
    if (activePage > 1) {
      goToPage(activePage - 1);
    }
  };

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
    setDeleteError(null);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingUser(null);
    setDeleteError(null);
  };

  const refreshUsers = async () => {
    try {
      const freshUsers = await getAllUsersUseCase.execute();
      setUsers(freshUsers);
    } catch (err) {
      console.error("Gagal refresh data karyawan:", err);
    }
  };

  const handleCreateUser = async (payload: CreateUserDto) => {
    try {
      setIsSubmitting(true);
      setFormError(null);
      await createUserUseCase.execute(payload);

      await refreshUsers();
      closeFormModal();
    } catch (err: unknown) {
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
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
      setFormError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await deleteUserUseCase.execute(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      closeDeleteConfirm();
    } catch (err: unknown) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
    } catch {}

    router.push("/login");
  };

  const openResetPasswordModal = (user: User) => {
    setResettingUser(user);
    setResetPasswordError(null);
    setIsResetPasswordOpen(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordOpen(false);
    setResettingUser(null);
    setResetPasswordError(null);
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!resettingUser) return;
    try {
      setIsResettingPassword(true);
      setResetPasswordError(null);
      await resetPasswordUseCase.execute({
        id: resettingUser.id,
        newPassword,
      });
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err);
      setResetPasswordError(msg);
      throw err;
    } finally {
      setIsResettingPassword(false);
    }
  };

  return {
    users,
    filteredUsers,
    paginatedUsers,
    currentPage: activePage,
    setCurrentPage: goToPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    goToPage,
    nextPage,
    prevPage,
    stats,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    roleFilter,
    setRoleFilter: handleRoleFilterChange,
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
    deleteError,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleConfirmDelete,
    isResetPasswordOpen,
    resettingUser,
    isResettingPassword,
    resetPasswordError,
    openResetPasswordModal,
    closeResetPasswordModal,
    handleResetPassword,
    handleLogout,
    divisions,
  };
};
