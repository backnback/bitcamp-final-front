import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function OAuth2RedirectHandler() {
  useEffect(() => {
    try {
      // 현재 URL에서 쿼리 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken) {
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        console.log("AccessToken 저장 완료:", accessToken);
        console.log("RefreshToken 저장 완료:", refreshToken);

        // 브라우저 리디렉션
        window.location.href = '/map'; // 원하는 경로로 이동
      } else {
        console.error('OAuth2 로그인 오류: 토큰이 없습니다.');
        window.location.href = '/login'; // 토큰이 없으면 로그인 페이지로 이동
      }
    } catch (error) {
      console.error('OAuth2 로그인 처리 중 오류 발생:', error);
      window.location.href = '/login'; // 오류 시 로그인 페이지로 이동
    }
  }, []);

  return <div>OAuth2 로그인 처리 중...</div>;
}


export default OAuth2RedirectHandler;
