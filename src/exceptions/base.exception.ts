import { HttpException } from '@nestjs/common';
import { IBaseException } from 'src/exceptions/base.exception.interface';

export class BaseException extends HttpException implements IBaseException {
  constructor(errorCode: string, statusCode: number, message: string) {
    super(message, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = '';
    this.message = message;
  }

  errorCode: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
