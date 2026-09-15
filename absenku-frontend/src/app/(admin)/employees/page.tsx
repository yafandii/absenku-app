import { getServerApiClient } from "@/infrastructure/http/api-client";
import { AuthRemoteDataSource } from "@/data/data-sources/auth.data-source";
import { AuthRepositoryImpl } from "@/data/repositories/auth.repository.impl";
import { UserRemoteDataSource } from "@/data/data-sources/user.data-source";
import { UserRepositoryImpl } from "@/data/repositories/user.repository.impl";
import { UserListPage } from "@/presentation/views/user-management/UserListPage";
import { redirect } from "next/navigation";
import { User } from "@/domain/entities/user.entity";
import { MastersRepositoryImpl } from "@/data/repositories/masters.repository.impl";
import { MastersRemoteDataSource } from "@/data/data-sources/masters.data-source";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";

export default async function Page() {
  const server = await getServerApiClient();

  const authDataSource = new AuthRemoteDataSource(server);
  const authRepository = new AuthRepositoryImpl(authDataSource);
  const masterDataSource = new MastersRemoteDataSource(server);
  const masterRepository = new MastersRepositoryImpl(masterDataSource);

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

  const userDataSource = new UserRemoteDataSource(server);
  const userRepository = new UserRepositoryImpl(userDataSource);

  let users: User[] = [];
  let divisions: BaseMasterEntity[] = [];
  try {
    [users, divisions] = await Promise.all([
      userRepository.getAll(),
      masterRepository.getDivisions(),
    ]);
  } catch {
    users = [];
    divisions = [];
  }

  return (
    <UserListPage
      currentUser={user}
      initialUsers={users}
      divisions={divisions}
    />
  );
}
