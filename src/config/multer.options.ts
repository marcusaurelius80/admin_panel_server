import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: 'storage',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let filename = file.originalname;

      if (!/^[a-zA-Z0-9_.()-]+$/.test(filename)) {
        // 파일 이름이 영어가 아닌 경우
        const ext = extname(filename);
        filename = `f${uniqueSuffix}${ext}`;
      } else {
        const ext = extname(filename);
        filename = `${filename}-${uniqueSuffix}${ext}`;
      }

      callback(null, filename);
    },
  }),
  limits: {
    // 파일 사이즈 300KB(0.3MB)
    fileSize: 300000,
  },
};
