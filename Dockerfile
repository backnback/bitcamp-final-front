# 1. Node.js 기반의 이미지를 사용
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json을 먼저 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 애플리케이션 빌드
COPY . .
RUN npm run build

# 6. Nginx 이미지로 애플리케이션을 서빙
FROM nginx:alpine

# 7. 빌드된 파일을 Nginx의 기본 웹 서버 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 8. Nginx 서버를 실행할 포트 지정
EXPOSE 80

# 9. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]