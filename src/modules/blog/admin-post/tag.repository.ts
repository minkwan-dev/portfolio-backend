import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '@/modules/blog/entities/tag.entity';

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>,
  ) {}

  findByNames(names: string[]): Promise<Tag[]> {
    if (names.length === 0) return Promise.resolve([]);
    return this.repository.find({ where: { name: In(names) } });
  }

  async findOrCreateByNames(names: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
    
    if (uniqueNames.length === 0) return [];

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(uniqueNames.map((name) => ({ name })))
      .orIgnore()
      .execute();

    return this.findByNames(uniqueNames);
  }
}