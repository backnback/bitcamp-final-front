# 1. Node.js 기반의 Alpine 이미지를 사용
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json을 먼저 복사
COPY package*.json ./

# 4. 의존성 설치 (npm 사용)
RUN npm install

# 5. 애플리케이션 소스 코드 복사
COPY . .

# 6. 포트 설정
EXPOSE 3000

# 7. 앱 실행 (npm start)
CMD ["npm", "start"]
