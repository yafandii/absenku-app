import { MastersRepository } from "@/domain/repositories/masters.repository";
import { MastersRemoteDataSource } from "../data-sources/masters.data-source";
import { BaseMasterEntity } from "@/domain/entities/masters.entity";

export class MastersRepositoryImpl implements MastersRepository {
  constructor(
    private remoteDataSource: MastersRemoteDataSource = new MastersRemoteDataSource(),
  ) {}

  async getDivisions(): Promise<BaseMasterEntity[]> {
    return this.remoteDataSource.getDivisions();
  }
}
