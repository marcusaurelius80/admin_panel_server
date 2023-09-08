import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'src/queryHelper';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { SearchProductDto } from './dto/search-product.dto';

import { Product } from './entities/product.entity';
import { Intermediate } from 'src/intermediate.entity';

import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';

import { NotFoundIDException } from 'src/exceptions/custom-exception';
import { ProductNotFoundException } from 'src/exceptions/custom-exception';

@Injectable()
export class ProductService {
  private query = new Query();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
    private brandService: BrandService,
    private categoryService: CategoryService,
  ) {}

  findCommonNumbers(arrA: number[], arrB: number[]): number[] {
    return arrA.filter((number) => arrB.includes(number));
  }

  private mergeRecords(records: Intermediate[]): Intermediate {
    return records.reduce((updatedRecord, record) => {
      if (record.category_id !== null) {
        updatedRecord.category_id = record.category_id;
      }

      if (record.brand_id !== null) {
        updatedRecord.brand_id = record.brand_id;
      }

      return updatedRecord;
    }, new Intermediate());
  }

  async updateIntermediate(
    brand_id: number,
    category_id: number,
  ): Promise<void> {
    const query = await this.intermediateRepository
      .createQueryBuilder('intermediate')
      .select('intermediate.intermediate_id');

    let intermediate = await query
      .where('intermediate.brand_id = :brand_id', { brand_id })
      .getMany();

    const intermediateIdsOfBrand = intermediate.map(
      (intermediate) => intermediate.intermediate_id,
    );

    intermediate = await query
      .where('intermediate.category_id = :category_id', { category_id })
      .getMany();

    const intermediateIdsOfCategory = intermediate.map(
      (intermediate) => intermediate.intermediate_id,
    );

    const commonIDs = this.findCommonNumbers(
      intermediateIdsOfBrand,
      intermediateIdsOfCategory,
    );

    // 기존에 있던 상품. Intermediate 테이블 건드릴 필요 없음
    if (commonIDs.length !== 0) return;

    // 새로 추가된 상품. Intermediate 테이블 업데이트 해야 됨
    const recordsToMerge = await this.intermediateRepository.find({
      where: [
        { intermediate_id: In(intermediateIdsOfBrand) },
        { intermediate_id: In(intermediateIdsOfCategory) },
      ],
    });

    const updatedRecord = this.mergeRecords(recordsToMerge);

    await this.intermediateRepository.save(updatedRecord);

    await this.intermediateRepository.delete({
      intermediate_id: In([
        ...intermediateIdsOfBrand,
        ...intermediateIdsOfCategory,
      ]),
    });

    return;
  }

  async create(
    imgs: Express.Multer.File[],
    data: CreateProductDto,
  ): Promise<Product> {
    // 중간 테이블 업데이트
    await this.updateIntermediate(data.brand_id, data.category_id);

    // 저장된 파일 경로 추가
    const filePaths: string[] = [];
    imgs.forEach((img) => filePaths.push(img.path));
    data['file_paths'] = filePaths;

    // Product 엔티티를 DB에 저장
    return await this.productRepository.save(data);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async lookUp(queries: SearchProductDto): Promise<any> {
    const columns: string[] = [];
    const values: any[] = [];

    // 프로덕트 검색
    // 검색 필드 뽑기
    Object.entries(queries).forEach(([key, value]) => {
      const valueCount = Array.isArray(value) ? value.length : 1;
      columns.push(...Array(valueCount).fill(key));
    });

    // 검색 값 뽑기
    Object.values(queries).forEach((value) => {
      if (Array.isArray(value)) {
        values.push(...value);
      } else {
        values.push(value);
      }
    });

    const products = await this.query.findRecordsByValues(
      values,
      columns,
      this.productRepository,
    );

    // 검색 결과가 빈 배열일 때 에러 반환
    if (!products.length) throw new ProductNotFoundException();

    //

    return products;
  }

  async findOne(product_id: number) {
    return await this.productRepository.findOne({ where: { product_id } });
  }

  async update(product_id: number, updateProductDto: UpdateProductDto) {
    const brand = await this.brandService.findOne(updateProductDto.brand_id);
    const product = await this.findOne(product_id);
    const category = await this.categoryService.findOne(
      updateProductDto.category_id,
    );

    if (!brand || !category || !product) throw new NotFoundIDException();

    // DB에 덮어쓰기
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(removeProductDto: RemoveProductDto) {
    // null 값이 아닌 키, 밸류 얻기
    const nonNullValues = Object.entries(removeProductDto)
      .filter(([key, value]) => value !== null)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    const keys = Object.keys(nonNullValues);
    const values = Object.values(nonNullValues);

    const products = await this.query.findRecordsByValues(
      values,
      keys,
      this.productRepository,
    );

    return await this.productRepository.remove(products);
  }
}
