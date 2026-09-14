export interface User {
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
