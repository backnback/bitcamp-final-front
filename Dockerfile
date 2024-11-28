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

# 6. 환경 변수 설정 (API URL 및 SERVER_NAME)
ARG API_URL
ARG SERVER_NAME
ENV API_URL=${API_URL}
ENV SERVER_NAME=${SERVER_NAME}

# 7. 앱 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# 8. 기존 Nginx 설정 파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# 9. Nginx 설정 파일 템플릿 복사
COPY ./nginx.conf.template /etc/nginx/conf.d/default.conf.template

# 10. Nginx 설정 파일을 envsubst로 치환하여 기본 설정 파일로 복사
CMD envsubst '${API_URL} ${SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

# 11. Nginx 포트 오픈
EXPOSE 80