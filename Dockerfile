# 1. Nginx 기반 이미지 사용
FROM nginx:alpine

# 2. 앱 빌드 결과물 디렉토리 생성
WORKDIR /usr/share/nginx/html

# 3. 빌드 결과물 복사
# `build` 폴더의 파일을 Nginx가 서빙할 `/usr/share/nginx/html`에 복사
COPY ./build/ .

# 4. 기존 Nginx의 기본 설정 파일을 제거
RUN rm /etc/nginx/conf.d/default.conf

# 5. Nginx 설정 파일을 복사 (이 후 설명할 nginx.conf 사용)
COPY ./nginx.conf /etc/nginx/conf.d/

# 6. Nginx가 기본적으로 사용하는 80번 포트를 오픈
EXPOSE 80

# 7. Nginx 실행 명령
CMD ["nginx", "-g", "daemon off;"]