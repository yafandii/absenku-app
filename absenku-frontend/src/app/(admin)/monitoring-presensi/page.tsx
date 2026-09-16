import { getServerApiClient } from "@/infrastructure/http/api-client";
import { AuthRemoteDataSource } from "@/data/data-sources/auth.data-source";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { MastersRemoteDataSource } from "@/data/data-sources/masters.data-source";
import { MastersRepositoryImpl } from "@/data/repositories/masters.repository.impl";
import { AttendanceRemoteDataSource } from "@/data/data-sources/attendance.data-source";
import { AttendanceRepositoryImpl } from "@/data/repositories/attendance.repository.impl";
import { GetAllAttendancesUseCase } from "@/domain/use-cases/attendance/get-all-attendances.use-case";
import { LiveMonitorPage } from "@/presentation/views/monitoring-presensi/LiveMonitorPage";
import { redirect } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";
import { MonitorAttendanceItem } from "@/presentation/views/monitoring-presensi/types";

export default async function Page() {
  const server = await getServerApiClient();

  const authDataSource = new AuthRemoteDataSource(server);
  const authRepository = new AuthRepositoryImpl(authDataSource);
  const masterDataSource = new MastersRemoteDataSource(server);
  const masterRepository = new MastersRepositoryImpl(masterDataSource);
  const attendanceDataSource = new AttendanceRemoteDataSource(server);
  const attendanceRepository = new AttendanceRepositoryImpl(
    attendanceDataSource,
  );
  const getAllAttendancesUseCase = new GetAllAttendancesUseCase(
    attendanceRepository,
  );

  let user: User | null = null;
  try {
    user = await authRepository.getUser();
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  if (user.role?.toUpperCase() !== "HRD") {
    redirect("/dashboard");
  }

  let divisions: BaseMasterEntity[] = [];
  let attendances: MonitorAttendanceItem[] = [];

  try {
    const [fetchedDivisions, attendanceEntities] = await Promise.all([
      masterRepository.getDivisions(),
      getAllAttendancesUseCase.execute({ limit: 100 }),
    ]);
    console.log(attendanceEntities);

    divisions = fetchedDivisions;
    attendances = attendanceEntities.map((item) => ({
      id: item.id,
      userId: item.userId,
      userName: item.userName || "Karyawan",
      userNik: item.userNik,
      userEmail: item.userEmail,
      divisionId: item.divisionId || undefined,
      divisionName: item.divisionName || undefined,
      date: item.date,
      timeIn: item.timeIn,
      timeOut: item.timeOut,
      status: item.status,
      statusLabel: item.statusLabel,
      photoUrl: item.photoUrl,
      clockOutPhotoUrl: item.clockOutPhotoUrl,
      latitude: item.latitude,
      longitude: item.longitude,
      clockOutLatitude: item.clockOutLatitude,
      clockOutLongitude: item.clockOutLongitude,
      workDurationHours: item.workDurationHours,
      workDurationLabel: item.workDurationLabel,
      isTargetMet: item.isTargetMet,
    }));
  } catch {
    divisions = [];
    attendances = [];
  }

  return (
    <LiveMonitorPage
      currentUser={user}
      initialData={attendances}
      divisions={divisions}
    />
  );
}
