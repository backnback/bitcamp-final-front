# 1. Node.js 기반 이미지 사용
FROM node:18-alpine AS build

# 2. 앱 디렉토리 생성
WORKDIR /app

# 3. 패키지 설치
COPY package*.json ./
RUN npm install

# 4. 앱 빌드
COPY . ./
RUN npm run build

# 5. Nginx 기반 이미지 사용
FROM nginx:alpine

# 6. 앱 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# 7. 기존 Nginx 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 8. Nginx 설정 파일 복사
COPY ./nginx.conf /etc/nginx/conf.d/

# 9. Nginx 포트 오픈
EXPOSE 80

# 10. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]