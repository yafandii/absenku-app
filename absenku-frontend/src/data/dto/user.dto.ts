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
  password?: string;
  role?: "EMPLOYEE" | "HRD";
  divisionId?: string;
  isActive?: boolean;
}
