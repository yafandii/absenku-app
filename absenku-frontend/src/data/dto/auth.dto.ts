export interface LoginRequestDto {
  id: string;
  password: string;
}

export interface LoginResponseDto {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
}

export interface UserResponseDto {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  division?: BaseModelResponse;
  isActive?: boolean;
  createdAt?: string;
}

export interface BaseModelResponse {
  id: string;
  name: string;
}
