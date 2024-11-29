import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function OAuth2RedirectHandler() {
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // 백엔드에서 토큰을 가져오기
        const response = await fetch('http://go.remapber.p-e.kr/oauth2/redirect', {
          method: 'GET',
          credentials: 'include', // 필요한 경우 쿠키 포함
        });

        if (response.ok) {
          // HTTP 헤더에서 토큰 추출
          const accessToken = response.headers.get('Access-Token');
          const refreshToken = response.headers.get('Refresh-Token');

          if (accessToken && refreshToken) {
            // 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            console.log('AccessToken 저장 완료:', accessToken);
            console.log('RefreshToken 저장 완료:', refreshToken);

            // 브라우저 리디렉션
            window.location.href = '/map';
          } else {
            console.error('OAuth2 로그인 오류: 헤더에 토큰이 없습니다.');
            window.location.href = '/login';
          }
        } else {
          console.error('OAuth2 로그인 실패:', response.status);
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('OAuth2 로그인 처리 중 오류 발생:', error);
        window.location.href = '/login';
      }
    };

    fetchTokens();
  }, []);

  return <div>OAuth2 로그인 처리 중...</div>;
}

export default OAuth2RedirectHandler;


export default OAuth2RedirectHandler;
