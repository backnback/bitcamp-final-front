# 1. Node.js 기반의 Alpine 이미지를 사용
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드 시점에 사용할 환경 변수 설정
# ARG는 빌드 시점에만 사용할 수 있는 변수입니다.
ARG REACT_APP_API_URL

# 4. 환경 변수 설정 (컨테이너 내에서 사용)
# ENV는 애플리케이션이 실행되는 동안 사용할 수 있는 변수입니다.
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# 5. package.json과 package-lock.json을 먼저 복사
COPY package*.json ./

# 6. 의존성 설치 (npm 사용)
RUN npm install

# 7. 애플리케이션 소스 코드 복사
COPY . .

# 8. 포트 설정
EXPOSE 3000

# 9. 앱 실행 (npm start)
CMD ["npm", "start"]
