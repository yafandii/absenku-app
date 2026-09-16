import { useState, useMemo, FormEvent } from "react";
import { User } from "@/domain/entities/user.entity";
import { CreateUserDto, UpdateUserDto } from "@/data/dto/user.dto";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";

export interface UseUserFormProps {
  editingUser: User | null;
  divisions: BaseMasterEntity[];
  onCreate: (data: CreateUserDto) => Promise<void>;
  onUpdate: (data: UpdateUserDto) => Promise<void>;
}

export function useUserForm({
  editingUser,
  divisions,
  onCreate,
  onUpdate,
}: UseUserFormProps) {
  const isEditing = Boolean(editingUser);

  const [name, setName] = useState(editingUser?.name || "");
  const [email, setEmail] = useState(editingUser?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"EMPLOYEE" | "HRD">(
    (editingUser?.role?.toUpperCase() as "EMPLOYEE" | "HRD") || "EMPLOYEE",
  );
  const [selectedDivision, setSelectedDivision] = useState(
    editingUser?.division?.id || "",
  );
  const [isActive, setIsActive] = useState(editingUser?.isActive ?? true);

  const divisionOptions = useMemo(
    () =>
      divisions.map((division) => ({
        value: division.id,
        label: division.name,
      })),
    [divisions],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && editingUser) {
      const payload: UpdateUserDto = {
        id: editingUser.id,
        name,
        email,
        role,
        divisionId: selectedDivision || undefined,
        isActive,
      };
      await onUpdate(payload);
    } else {
      const payload: CreateUserDto = {
        name,
        email,
        role,
        divisionId: selectedDivision || undefined,
        password,
      };
      await onCreate(payload);
    }
  };

  return {
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
  };
}
