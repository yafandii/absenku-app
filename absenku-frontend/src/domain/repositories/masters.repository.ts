import { BaseMasterEntity } from "../entities/masters.entity";

export interface MastersRepository {
  getDivisions(): Promise<BaseMasterEntity[]>;
}
