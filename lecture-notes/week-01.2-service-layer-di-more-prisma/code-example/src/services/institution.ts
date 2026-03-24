import { Institution, Prisma } from "@prisma/client";

import institutionRepository from "../repositories/institution.js";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  async create(data: Prisma.InstitutionCreateInput): Promise<Institution[]> {
    await institutionRepository.create(data);
    return institutionRepository.findAll();
  }

  async getAll(): Promise<Institution[]> {
    const institutions = await institutionRepository.findAll();

    if (institutions.length === 0) {
      throw new NotFoundError("No institutions found");
    }

    return institutions;
  }

  async getById(id: string): Promise<Institution> {
    const institution = await institutionRepository.findById(id);

    if (!institution) {
      throw new NotFoundError(`No institution with the id: ${id} found`);
    }

    return institution;
  }

  async update(
    id: string,
    data: Prisma.InstitutionUpdateInput,
  ): Promise<Institution> {
    await this.getById(id); // Throws NotFoundError if not found
    return institutionRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await institutionRepository.delete(id);
  }
}

export default new InstitutionService();