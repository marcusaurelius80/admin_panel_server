import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionFilter } from './exceptions/exception.filter';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 전역으로 예외처리
  app.useGlobalFilters(new AllExceptionFilter());

  // static 파일 제공 설정
  app.useStaticAssets(join(__dirname, '..', 'storage'), {
    prefix: '/storage', // URL에서 /storage 경로로 접근하면 storage 디렉토리의 파일을 제공함
  });

  // 전역 검증 파이프 적용
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 클라이언트에서 보낸 쿼리'스트링'을 컨트롤러에서 알맞는 자료형으로 바꿀 수 있게
    }),
  );

  // CORS 허용 설정
  app.enableCors();

  // 5425 포트에서 애플리케이션 실행
  await app.listen(5425);
}
bootstrap();
