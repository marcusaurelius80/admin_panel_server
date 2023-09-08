import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { type } from 'os';

@Injectable()
export class Query {
  async findRecordsByValues(
    values: any[],
    columnNames: string[],
    repository: Repository<any>,
  ): Promise<any[]> {
    const queryBuilder = repository.createQueryBuilder();
    const tableName = repository.metadata.name;

    const conditions = [];

    columnNames.forEach((columnName, index) => {
      const value = values[index];

      if (value === null) {
        conditions.push(`${tableName}.${columnName} IS NULL`);
      } else if (typeof value === 'string') {
        // 단어를 하나 이상 포함하는지 검사하는 조건을 추가
        const keywords = value.split(/\s+/).filter(Boolean);
        if (keywords.length > 0) {
          const keywordConditions = keywords.map(
            (keyword) => `${tableName}.${columnName} LIKE :keyword${index}`,
          );
          conditions.push(`(${keywordConditions.join(' OR ')})`);
          keywords.forEach((keyword) => {
            queryBuilder.setParameter(`keyword${index}`, `%${keyword}%`);
          });
        }
      } else if (typeof value === 'number') {
        // 숫자 검색
        conditions.push(`${tableName}.${columnName} = :value${index}`);
        queryBuilder.setParameter(`value${index}`, value);
      } else if (typeof value === 'boolean') {
        // boolean 검색
        conditions.push(`${tableName}.${columnName} = :value${index}`);
        queryBuilder.setParameter(`value${index}`, value);
      }
    });

    queryBuilder.where(conditions.join(' OR '));

    return await queryBuilder.getMany();
  }

  async updateRecords(
    records: any[],
    updateProps: Record<string, any>,
    repository: Repository<any>,
  ) {
    for (const record of records) {
      for (const key in updateProps) {
        if (updateProps.hasOwnProperty(key)) {
          record[key] = updateProps[key];
        }
      }
      await repository.save(record);
    }
  }
}
