import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'src/queryHelper';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';

import { Category } from './entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Product } from 'src/product/entities/product.entity';
import { Intermediate } from 'src/intermediate.entity';

import {
  CategoryDuplicatedException,
  CategoryNotFoundException,
} from 'src/exceptions/custom-exception';

@Injectable()
export class CategoryService {
  private query = new Query();

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
  ) {}

  async create(createCategory: CreateCategoryDto): Promise<Category> {
    // 카테고리 이름이 중복되지 않게
    const isDuplicated = await this.query.findRecordsByValues(
      [`${createCategory.category_name}`],
      ['category_name'],
      this.categoryRepository,
    );
    if (isDuplicated.length !== 0) throw new CategoryDuplicatedException();

    // 브랜드 추가
    const newCategory = await this.categoryRepository.save(createCategory);

    // 중간 테이블에 새로 생성된 category_id 추가
    let intermediateRecord: any;
    if (createCategory.brand_ids) {
      // 브랜드가 같이 입력 됐을 때
      intermediateRecord = createCategory.brand_ids.map((brandId) => ({
        category_id: newCategory.category_id,
        brand_id: brandId,
      }));
    } else {
      // 브랜드가 입력 안 됐을 때
      intermediateRecord = {
        category_id: newCategory.category_id,
        brand_id: null,
      };
    }
    await this.intermediateRepository.save(intermediateRecord);

    // 중간 테이블 정리
    if (createCategory.brand_ids) {
      const valueBrandIds = intermediateRecord.map((record) => record.brand_id);
      const brandColumnNames = Array(valueBrandIds.length).fill('brand_id');

      const sameBrands = await this.query.findRecordsByValues(
        valueBrandIds,
        brandColumnNames,
        this.intermediateRepository,
      );

      const nullCategoryIds = Object.values(sameBrands).filter(
        (record) => record.category_id === null,
      );

      await this.intermediateRepository.remove(nullCategoryIds);
    }

    return newCategory;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async lookUp(queries: SearchCategoryDto): Promise<any> {
    let results: any[];
    const isBrand = queries.brand;
    const isProduct = queries.product;
    const categoryNames = queries.category_name;

    const columnNames = Array(categoryNames.length).fill('category_name');

    const categories = await this.query.findRecordsByValues(
      categoryNames,
      columnNames,
      this.categoryRepository,
    );

    if (!categories.length) throw new CategoryNotFoundException();

    results = categories;

    // 카테고리 -> 중간테이블
    if (isProduct || isBrand) {
      const categoryIds = categories.map((category) => category.category_id);
      const categoryColumnNames = Array(categoryIds.length).fill('category_id');

      const intermediates = await this.query.findRecordsByValues(
        categoryIds,
        categoryColumnNames,
        this.intermediateRepository,
      );

      const brandIds = intermediates.map(
        (intermediate) => intermediate.brand_id,
      );

      const brandColumnNames = Array(brandIds.length).fill('brand_id');

      // 중간테이블 -> 브랜드
      if (isBrand) {
        const brands = await this.query.findRecordsByValues(
          brandIds,
          brandColumnNames,
          this.brandRepository,
        );

        results = brands;
      }

      // 카테고리 -> 중간테이블 -> 프로덕트
      if (isProduct) {
        const products = await this.productRepository
          .createQueryBuilder('product')
          .where('product.category_id IN (:...categoryIds)', { categoryIds })
          .andWhere('product.brand_id IN (:...brandIds)', { brandIds })
          .getMany();

        results = products;
      }
    }

    return results;
  }

  async findSome(ids: number[]) {
    return await this.categoryRepository.find({
      where: { category_id: In(ids) },
    });
  }

  async findOne(category_id: number) {
    return await this.categoryRepository.findOne({ where: { category_id } });
  }

  async update(category_id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(category_id);
    if (!category) throw new CategoryNotFoundException();

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(category_id: number) {
    const categories = await this.query.findRecordsByValues(
      [`${category_id}`],
      ['category_id'],
      this.categoryRepository,
    );
    if (categories.length == 0) throw new CategoryNotFoundException();

    // Intermediate 엔티티 수정
    await this.intermediateRepository
      .createQueryBuilder()
      .update(Intermediate)
      .set({ category_id: null })
      .where('category_id = :CategoryID', { CategoryID: category_id })
      .execute();

    // Product 엔티티 수정
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ category_id: null })
      .where('category_id = :CategoryID', { CategoryID: category_id })
      .execute();

    // 값이 하나도 없는 중간 테이블의 레코드들 삭제
    const areEmpties = await this.query.findRecordsByValues(
      [null, null],
      ['brand_id', 'category_id'],
      this.intermediateRepository,
    );

    if (areEmpties.length > 0)
      await this.intermediateRepository.remove(areEmpties);

    return await this.categoryRepository.remove(categories);
  }
}
