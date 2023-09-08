import { HttpStatus } from '@nestjs/common';
import { ExceptionCode } from './exception.enum';
import { BaseException } from './base.exception';

export class BrandNotFoundException extends BaseException {
  constructor() {
    super(
      ExceptionCode.BrandNotFound,
      HttpStatus.NOT_FOUND,
      'Not found the brand(Brand를 찾을 수 없습니다)',
    );
  }
}

export class BrandDuplicatedException extends BaseException {
  constructor() {
    super(
      ExceptionCode.BrandDuplicated,
      HttpStatus.CONFLICT,
      'Duplicated brand name(이미 존재하는 Brand 입니다)',
    );
  }
}

export class CategoryNotFoundException extends BaseException {
  constructor() {
    super(
      ExceptionCode.CategoryNotFound,
      HttpStatus.NOT_FOUND,
      'Not found the category(Category를 찾을 수 없습니다)',
    );
  }
}

export class CategoryDuplicatedException extends BaseException {
  constructor() {
    super(
      ExceptionCode.CategoryDuplicated,
      HttpStatus.CONFLICT,
      'Duplicated Category Name(이미 존재하는 Category 입니다)',
    );
  }
}

export class ProductNotFoundException extends BaseException {
  constructor() {
    super(
      ExceptionCode.ProductNotFound,
      HttpStatus.NOT_FOUND,
      'Not found the product(Product를 찾을 수 없습니다)',
    );
  }
}

export class NoQueryDeliveredException extends BaseException {
  constructor() {
    super(
      ExceptionCode.NoQueryDelivered,
      HttpStatus.BAD_REQUEST,
      'No query delivered(검색어를 입력해 주세요)',
    );
  }
}

export class NotFoundIDException extends BaseException {
  constructor() {
    super(
      ExceptionCode.NotFoundID,
      HttpStatus.NOT_FOUND,
      'Not found ID(ID를 찾을 수 없습니다)',
    );
  }
}

export class UnCatchedException extends BaseException {
  constructor() {
    super(
      ExceptionCode.UnCatched,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'An internal server error occurred(에러가 발생 하였습니다)',
    );
  }
}
