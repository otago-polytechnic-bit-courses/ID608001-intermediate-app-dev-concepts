import { Institution } from "@prisma/client";

import institutionRepository from "../repositories/institution.js";
import {
  CreateInstitutionBody,
  UpdateInstitutionBody,
} from "../types/institution.js";
import { PaginationResult } from "../types/pagination.js";
import { NotFoundError } from "../errors/index.js";

class InstitutionService {
  async create(data: CreateInstitutionBody): Promise<Institution> {
    return await institutionRepository.create(data);
  }

  async getAll(
    filters: Record<string, string> = {},
    sortBy: string = "id",
    sortOrder: string = "asc",
    page: string = "1",
    pageSize: string = "10",
  ): Promise<PaginationResult<Institution>> {
    const institutions = await institutionRepository.findAll(
      filters,
      sortBy,
      sortOrder,
      page,
      pageSize,
    );

    if (institutions.data.length === 0) {
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

  async update(id: string, data: UpdateInstitutionBody): Promise<Institution> {
    await this.getById(id); // Throws NotFoundError if not found
    return institutionRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Throws NotFoundError if not found
    await institutionRepository.delete(id);
  }
}

export default new InstitutionService();
