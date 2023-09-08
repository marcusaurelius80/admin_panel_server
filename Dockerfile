# 사용할 Node.js 이미지를 선택합니다.
# LTS 버전을 사용하는 것이 좋습니다.
# FROM node:14
FROM node:18-alpine

# 컨테이너 내부에 앱 디렉토리를 생성합니다.
WORKDIR /app

# 프로젝트의 package.json 및 package-lock.json(또는 yarn.lock)을 복사합니다.
# 이렇게 하면 종속성을 먼저 설치하고 소스 코드를 복사할 때 Docker 레이어 캐시가 더 잘 활용됩니다.
COPY package*.json ./

# 종속성을 설치합니다.
RUN npm install

# 소스 코드를 컨테이너 내부의 /app 디렉토리로 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 컨테이너가 실행될 때 실행할 명령을 지정합니다.
CMD [ "npm", "run", "start:prod" ]