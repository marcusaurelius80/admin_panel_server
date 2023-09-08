/* 
- Request 가 들어온 이후, Middleware, Guard, Interceptor, Pipe 를 거쳐 Controller, Service 를 통과한다
- 이후, 다시 Interceptor 를 거쳐 Exception Filter 와 Response 로 전달되고 있다
- 즉, NestJS 에 내장된 Exception Filter 를 커스텀하면 원하는 예외 처리 로직이나 응답 메시지 Body 를 작성할 수 있다
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { BaseException } from './base.exception';
import { UnCatchedException } from './custom-exception';

// @Catch 데코레이터는 필요한 메타 데이터를 ExceptionFilter에 바인딩하여,
// 필터가 HttpException 타입의 예외만 찾고 있다는 것을 Nset.js에 알리기 위해 선언한다.
@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const res =
      exception instanceof BaseException ? exception : new UnCatchedException();

    res.timestamp = new Date().toISOString();
    res.path = request.url;

    response.status(res.statusCode).json({
      errorCode: res.errorCode,
      statusCode: res.statusCode,
      timestamp: res.timestamp,
      path: res.path,
      message: res.message,
    });
  }
}
