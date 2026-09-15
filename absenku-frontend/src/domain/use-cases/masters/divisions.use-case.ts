import { MastersRepository } from "../../repositories/masters.repository";
import { BaseMasterEntity } from "../../entities/masters.entity";

export class DivisionsUseCase {
  constructor(private mastersRepository: MastersRepository) {}

  async execute(): Promise<BaseMasterEntity[]> {
    return this.mastersRepository.getDivisions();
  }
}
