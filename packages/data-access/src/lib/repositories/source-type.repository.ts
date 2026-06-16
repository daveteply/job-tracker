import { map, Observable } from 'rxjs';

import { escapeRegex } from '@job-tracker/app-logic';
import { SourceTypeEntity } from '@job-tracker/domain';
import { SourceTypeCreate, SourceTypeDTO, SourceTypeUpdate } from '@job-tracker/validation';

import { TrackerDatabase } from '../database/rx-database';
import { SourceTypeMapper } from '../mappers/source-type.mapper';

export class SourceTypeRepository {
  constructor(private readonly db: TrackerDatabase) {}

  findAll(): Observable<SourceTypeEntity[]> {
    return this.db.sourceTypes
      .find({
        sort: [{ name: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => SourceTypeMapper.toEntity(doc.toJSON()))));
  }

  list$(): Observable<SourceTypeDTO[]> {
    return this.db.sourceTypes
      .find({
        sort: [{ name: 'asc' }],
      })
      .$.pipe(map((docs) => docs.map((doc) => SourceTypeMapper.toDto(doc.toJSON()))));
  }

  async findById(id: string): Promise<SourceTypeEntity | null> {
    const doc = await this.db.sourceTypes.findOne(id).exec();
    return doc ? SourceTypeMapper.toEntity(doc.toJSON()) : null;
  }

  getById$(id: string): Observable<SourceTypeDTO | null> {
    return this.db.sourceTypes
      .findOne(id)
      .$.pipe(map((doc) => (doc ? SourceTypeMapper.toDto(doc.toJSON()) : null)));
  }

  async findByName(name: string): Promise<SourceTypeEntity | null> {
    const doc = await this.db.sourceTypes
      .findOne({
        selector: {
          name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' },
        },
      })
      .exec();
    return doc ? SourceTypeMapper.toEntity(doc.toJSON()) : null;
  }

  async create(data: SourceTypeCreate): Promise<SourceTypeEntity> {
    const id = crypto.randomUUID();
    const doc = await this.db.sourceTypes.insert(
      SourceTypeMapper.toDocument({
        ...data,
        id,
      }),
    );
    return SourceTypeMapper.toEntity(doc.toJSON());
  }

  async update(id: string, data: SourceTypeUpdate): Promise<SourceTypeEntity | null> {
    const doc = await this.db.sourceTypes.findOne(id).exec();
    if (!doc) return null;

    const updatedDoc = await doc.patch(data);
    return SourceTypeMapper.toEntity(updatedDoc.toJSON());
  }

  async delete(id: string): Promise<boolean> {
    const doc = await this.db.sourceTypes.findOne(id).exec();
    if (!doc) return false;

    await doc.remove();
    return true;
  }

  async toDTO(entity: SourceTypeEntity): Promise<SourceTypeDTO> {
    return SourceTypeMapper.toDto(SourceTypeMapper.toDocument(entity));
  }
}
