import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axiosInstance from './components/AxiosInstance.js';

import Header from "./components/Header";
import AdminHeader from "./components/AdminHeader";
import SignUp from "./routes/SignUp";
import ViewUser from "./routes/ViewUser"; // ViewUser 컴포넌트 import
import Login from "./routes/Login"; // Login 컴포넌트 import
import StoryMap from "./routes/StoryMap";
import StoryList from "./routes/StoryList"; // StoryList 컴포넌트 import
import ShareStoryList from "./routes/ShareStoryList"; // ShareStoryList 컴포넌트 import
import AllStoryList from "./routes/AllStoryList";
import MyPage from "./routes/MyPage";
import FaqBoard from "./routes/FaqBoard";
import StoryAddForm from "./routes/StoryAddForm";
import StoryUpdateForm from "./routes/StoryUpdateForm";
import FormStyles from "./routes/FormStyles";
import FindEmail from "./routes/FindEmail";
import FindPassword from "./routes/FindPassword";
import NewPassword from "./routes/NewPassword";
import AdminPage from "./routes/AdminPage.js";

import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

import { jwtDecode } from 'jwt-decode';
import MapLocation from "./routes/MapLocation";
import SlideTest from "./routes/SlideTest";
import LikeStoryList from "./routes/LikeStoryList.js";

function App() {
    const [users, setUsers] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const currentLocation = useLocation();
    const [bodyClassNames, setBodyClassNames] = useState(['body']);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token) {
            console.log("토큰 없음");
            const allowedPaths = ['/signup', '/find-email', '/find-password', '/newPassword'];
            if (allowedPaths.includes(currentLocation.pathname)) {
                console.log("토큰 없이 접근 허용");
                return;
            }
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        setRole(decodedToken.auth);

        const checkTokenExpiration = async () => {
            const decodedToken = jwtDecode(token);
            const decodedEfreshToken = jwtDecode(refreshToken);
            const expirationTime = decodedToken.exp * 1000;
            const refreshExpirationTime = decodedEfreshToken.exp * 1000;
            const remainTime = expirationTime - Date.now();

            if (remainTime < 0 || refreshExpirationTime < 0) {
                localStorage.clear();
                navigate("/");
                window.location.reload();
            }

            if (remainTime <= 1000 * 60 * 5) {
                try {
                    const response = await axiosInstance.post('/user/refreshtoken', {
                        refreshToken
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });

                    // 새로 갱신된 토큰 처리
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);
                    setAccessToken(newAccessToken);
                    setUser(jwtDecode(newAccessToken));
                    console.log("토큰 갱신 성공");

                } catch (error) {
                    // 서버에서 받은 오류 메시지를 확인
                    if (error.response && error.response.data.error) {
                        const errorMessage = error.response.data.error;

                        // "Refresh Token이 만료되었습니다." 오류가 발생했을 경우
                        if (errorMessage === "Refresh Token이 만료되었습니다.") {
                            console.log("토큰 만료: 다시 로그인 해주세요.");
                            localStorage.clear(); // 로컬스토리지 초기화
                            navigate('/login'); // 로그인 페이지로 리다이렉트
                        } else {
                            console.log("토큰 갱신 실패:", errorMessage);
                            localStorage.clear();
                            navigate('/login');
                        }
                    } else {
                        console.error("토큰 갱신 실패:", error);
                        localStorage.clear();
                        navigate('/login');
                    }
                }

            } else {
                setAccessToken(token);
                setUser(decodedToken);
                console.log("토큰 유효");
            }

            setTimeout(checkTokenExpiration, remainTime - 1000 * 60 * 5);
        };

        checkTokenExpiration();

        document.body.className = 'body';
    }, [currentLocation.pathname, navigate]);

    useEffect(() => {
    }, [currentLocation]);

    return (
        <>
            {user == null ?
                <>
                    {/* 로그인 안했을 때 */}
                    <div className={`layout__wrapper`}>
                        <div className={`layout__content__wrapper`}>
                            <div className={`layout__contents`}>
                                <Routes>
                                    <Route path="/" element={<Login />} />
                                    <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
                                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                                    <Route path="/signup" element={<SignUp />} /> {/* 회원가입 페이지 */}
                                    <Route path="/find-email" element={<FindEmail />} /> {/* 이메일 찾기 페이지 */}
                                    <Route path="/find-password" element={<FindPassword />} /> {/* 비번 찾기 페이지 */}
                                    <Route path="/newPassword" element={<NewPassword />} /> {/* 비번 재생성 페이지 */}
                                </Routes>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    {/* 로그인 했을 때 */}
                    <div className={`layout__wrapper layout__wrapper__header`}>

                        {/* accessToken을 디코딩하여 역할 확인 */}
                        {role === 'ROLE_ADMIN' ? (
                            <AdminHeader />
                        ) : (
                            <Header />
                        )}

                        <div className={`layout__content__wrapper`}>
                            <div className={`layout__contents`}>
                                <Routes>
                                    <Route path="/" element={<StoryMap />} />
                                    <Route path="/map" element={<StoryMap />} />

                                    <Route path="/admin" element={<AdminPage />} />

                                    <Route path="/form/test" element={<FormStyles />} />
                                    <Route path="/slide/test" element={<SlideTest />} />
                                    {/* 라우터 경로 설정 */}
                                    <Route path="map/story/:locationId" element={<MapLocation />} />

                                    <Route path="/viewuser/:id" element={<ViewUser />} /> {/* 특정 사용자 보기 */}
                                    <Route path="/share-story/list" element={<ShareStoryList />} /> {/* 스토리 목록 페이지 */}
                                    <Route path="/all-story/list" element={<AllStoryList />} /> {/* 어드민이 관리하는 스토리 목록 페이지 */}
                                    <Route path="/like-story/list" element={<LikeStoryList />} /> {/* 좋아요한 스토리 목록 페이지 */}
                                    <Route path="/my-story/list" element={<StoryList />} /> {/* 스토리 목록 페이지 */}
                                    <Route path="/my-page" element={<MyPage />} /> {/* 마이 페이지 */}
                                    <Route path="/my-story/form/add" element={<StoryAddForm />} /> {/* 스토리 추가 */}
                                    <Route path="/my-story/form/update/:storyId"
                                        element={<StoryUpdateForm />} /> {/* 스토리 수정 */}
                                    <Route path="/faqs" element={<FaqBoard />} /> {/* FAQ 목록 페이지 */}
                                </Routes>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>

    );
}

export default App;
