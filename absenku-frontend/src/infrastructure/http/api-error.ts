import axios, { AxiosError } from "axios";

export interface NestErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public rawError?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<NestErrorResponse>;

    if (!axiosErr.response) {
      if (
        axiosErr.code === "ECONNABORTED" ||
        axiosErr.message.includes("timeout")
      ) {
        return "Koneksi ke server timeout. Silakan coba beberapa saat lagi.";
      }
      return "Tidak dapat terhubung ke server. Pastikan koneksi anda stabil.";
    }

    const { status, data } = axiosErr.response;

    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.join(", ");
      }
      return data.message;
    }

    switch (status) {
      case 400:
        return "Permintaan tidak valid. Silakan periksa kembali data yang dimasukkan.";
      case 401:
        return "NIK atau kata sandi yang Anda masukkan salah.";
      case 403:
        return "Anda tidak memiliki hak akses untuk melakukan aksi ini.";
      case 404:
        return "Akun atau data tidak ditemukan.";
      case 409:
        return "Data sudah terdaftar atau terjadi konflik.";
      case 422:
        return "Data yang dikirim tidak dapat diproses.";
      case 500:
      case 502:
      case 503:
        return "Terjadi kendala pada server. Silakan coba beberapa saat lagi.";
      default:
        return data?.error || `Terjadi kesalahan (Kode: ${status}).`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.";
}
