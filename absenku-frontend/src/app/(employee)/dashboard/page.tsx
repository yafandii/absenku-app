import { getServerApiClient } from "@/infrastructure/http/api-client";
import { AttendanceRemoteDataSource } from "@/data/data-sources/attendance.data-source";
import { AttendanceRepositoryImpl } from "@/data/repositories/attendance.repository.impl";
import { AuthRemoteDataSource } from "@/data/data-sources/auth.data-source";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { DashboardPage } from "@/presentation/views/employee/DashboardPage";
import { redirect } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { AttendanceEntity } from "@/domain/entities/attendance.entity";

export default async function Page() {
  const server = await getServerApiClient();
  const attendanceDataSource = new AttendanceRemoteDataSource(server);
  const attendanceRepository = new AttendanceRepositoryImpl(
    attendanceDataSource,
  );

  const authDataSource = new AuthRemoteDataSource(server);
  const authRepository = new AuthRepositoryImpl(authDataSource);

  let user: User | null = null;
  let attendances: AttendanceEntity[] = [];

  try {
    const [fetchedUser, fetchedAttendances] = await Promise.all([
      authRepository.getUser(),
      attendanceRepository.getMyHistory().catch(() => []),
    ]);
    user = fetchedUser;
    attendances = fetchedAttendances;
  } catch (error) {
    // console.error("[Dashboard SSR] Gagal memuat user/absensi:", error);
    user = null;
  }

  if (!user) {
    redirect("/login");
  }

  return <DashboardPage initialUser={user} myHistoryAttendance={attendances} />;
}
