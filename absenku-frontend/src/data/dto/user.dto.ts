export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role: "EMPLOYEE" | "HRD";
  divisionId?: string;
}

export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  role?: "EMPLOYEE" | "HRD";
  divisionId?: string;
  isActive?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  id: string;
  newPassword: string;
}

