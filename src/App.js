import {BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Header from "./components/Header";
import SignUp from "./routes/SignUp";
import ViewUser from "./routes/ViewUser"; // ViewUser 컴포넌트 import
import Login from "./routes/Login"; // Login 컴포넌트 import
import StoryMap from "./routes/StoryMap";
import StoryList from "./routes/StoryList"; // StoryList 컴포넌트 import
import ShareStoryList from "./routes/ShareStoryList"; // ShareStoryList 컴포넌트 import
import MyPage from "./routes/MyPage";
import FaqBoard from "./routes/FaqBoard";
import StoryAddForm from "./routes/StoryAddForm";
import StoryUpdateForm from "./routes/StoryUpdateForm";
import FormStyles from "./routes/FormStyles";
import FindEmail from "./routes/FindEmail";
import FindPassword from "./routes/FindPassword";
import NewPassword from "./routes/NewPassword";
import AdminPage from "./routes/AdminPage.js";

import MapSeoul from "./components/map/MapSeoul";
import MapBusan from "./components/map/MapBusan";
import MapDaegu from "./components/map/MapDaegu";
import MapDaejeon from "./components/map/MapDaejeon";
import MapGwangju from "./components/map/MapGwangju";
import MapGwangwon from "./components/map/MapGwangwon";
import MapGyeonggi from "./components/map/MapGyeonggi";
import MapIncheon from "./components/map/MapIncheon";
import MapJeju from "./components/map/MapJeju";
import MapNorthChungcheoung from "./components/map/MapNorthChungcheoung";
import MapNorthGyeongsang from "./components/map/MapNorthGyeongsang";
import MapNorthJeolla from "./components/map/MapNorthJeolla";
import MapSejong from "./components/map/MapSejong";
import MapSouthChungcheong from "./components/map/MapSouthChungcheong";
import MapSouthGyeongsan from "./components/map/MapSouthGyeongsan";
import MapSouthJeolla from "./components/map/MapSouthJeolla";
import MapUlsan from "./components/map/MapUlsan";
import Map from "./components/Map";
import {jwtDecode} from "jwt-decode";
import MapLocation from "./routes/MapLocation";
import SlideTest from "./routes/SlideTest";

function App() {
    // UserProvider 내부에서 useUser 훅을 호출하여 사용자 정보 가져오기
    const [users, setUsers] = useState([]); // 사용자 목록 상태
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const currentLocation = useLocation();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const navigate = useNavigate();


    useEffect(() => {
        let token = localStorage.getItem('accessToken');

        const checkTokenExpiration = async () => {
            if (token === null || token === undefined) {
                console.log("토큰이 없음");
            } else {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000; // 초 단위의 만료 시간을 밀리초로 변환

                const remainTime = expirationTime - Date.now();

                if (remainTime <= 1000 * 60 * 5) {
                    // 토큰이 만료되었으면, 재인증 작업 시작
                    const refreshToken = localStorage.getItem('refreshToken');
                    try {
                        const response = await axios.post('http://localhost:8080/user/refreshtoken', {
                            refreshToken: refreshToken
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                        });
                        const newAccessToken = response.data.accessToken;
                        localStorage.setItem('accessToken', newAccessToken);

                        setAccessToken(newAccessToken);
                    } catch (error) {
                        console.error("회원 정보를 가져오던 중 오류 발생:", error);
                    }
                } else {
                    // 토큰이 유효하다면, 사용자 정보를 상태로 설정
                    setAccessToken(token);
                    setUser(decodedToken);
                }
            }
        };

        checkTokenExpiration();

        if (token != null) {
            // 1초마다 currentTime 업데이트
            const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
            return () => clearInterval(interval);
        }

    }, [currentTime]);


    useEffect(() => {
        // console.log('page changed to:', currentLocation.pathname)

        // body class
        const locationNames = document.body.classList;
        for (const locationName of locationNames) {
            document.body.classList.remove(locationName)
        }
        const [firstName, secondName] = currentLocation.pathname.split('/').filter((item) => item != '');

        document.body.classList.add('body');
        if (firstName != undefined) {
            document.body.classList.add(`body__${firstName}`);
        }
        if (secondName != undefined) {
            document.body.classList.add(`body__${firstName}`, `body__${firstName}__${secondName}`)
        } else {
            const pageLogin = document.getElementById('login');

            if (pageLogin) {
                pageLogin.ownerDocument.body.classList.add(`body__${pageLogin.id}`);
            }
        }

        //fetchUsers(); // 컴포넌트가 처음 로드될 때 사용자 목록을 가져옴
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
                                    <Route path="/" element={<Login/>}/>
                                    <Route path="/login" element={<Login/>}/> {/* 로그인 페이지 */}

                                    <Route path="/signup" element={<SignUp/>}/> {/* 회원가입 페이지 */}
                                    <Route path="/find-email" element={<FindEmail/>}/> {/* 이메일 찾기 페이지 */}
                                    <Route path="/find-password" element={<FindPassword/>}/> {/* 비번 찾기 페이지 */}
                                    <Route path="/newPassword" element={<NewPassword/>}/> {/* 비번 재생성 페이지 */}

                                    {/* <Route path="/form/test" element={<FormStyles />} /> */}
                                </Routes>
                            </div>
                        </div>
                    </div>
                </>
                :
                <>
                    {/* 로그인 했을 때 */}
                    <div className={`layout__wrapper layout__wrapper__header`}>
                        <Header/>

                        <div className={`layout__content__wrapper`}>
                            <div className={`layout__contents`}>
                                <Routes>
                                    <Route path="/" element={<StoryMap/>}/>
                                    <Route path="/map" element={<StoryMap/>}/>

                                    <Route path="/admin" element={<AdminPage/>}/>

                                    <Route path="/form/test" element={<FormStyles/>}/>
                                    <Route path="/slide/test" element={<SlideTest/>}/>
                                    {/* 라우터 경로 설정 */}
                                    <Route path="map/story/:locationId" element={<MapLocation/>}/>
                                    <Route path="/map/story/seoul" element={<MapSeoul/>}/>
                                    <Route path="/map/story/busan" element={<MapBusan/>}/>
                                    <Route path="/map/story/daegu" element={<MapDaegu/>}/>
                                    <Route path="/map/story/daejeon" element={<MapDaejeon/>}/>
                                    <Route path="/map/story/gwangju" element={<MapGwangju/>}/>
                                    <Route path="/map/story/gwangwon" element={<MapGwangwon/>}/>
                                    <Route path="/map/story/gyeonggi" element={<MapGyeonggi/>}/>
                                    <Route path="/map/story/incheon" element={<MapIncheon/>}/>
                                    <Route path="/map/story/jeju" element={<MapJeju/>}/>
                                    <Route path="/map/story/northChungcheoung" element={<MapNorthChungcheoung/>}/>
                                    <Route path="/map/story/northGyeongsang" element={<MapNorthGyeongsang/>}/>
                                    <Route path="/map/story/northJeolla" element={<MapNorthJeolla/>}/>
                                    <Route path="/map/story/sejong" element={<MapSejong/>}/>
                                    <Route path="/map/story/southChungcheong" element={<MapSouthChungcheong/>}/>
                                    <Route path="/map/story/southGyeongsan" element={<MapSouthGyeongsan/>}/>
                                    <Route path="/map/story/southJeolla" element={<MapSouthJeolla/>}/>
                                    <Route path="/map/story/ulsan" element={<MapUlsan/>}/>

                                    <Route path="/viewuser/:id" element={<ViewUser/>}/> {/* 특정 사용자 보기 */}
                                    <Route path="/share-story/list" element={<ShareStoryList/>}/> {/* 스토리 목록 페이지 */}
                                    <Route path="/my-story/list" element={<StoryList/>}/> {/* 스토리 목록 페이지 */}
                                    <Route path="/my-page" element={<MyPage/>}/> {/* 마이 페이지 */}
                                    <Route path="/my-story/form/add" element={<StoryAddForm/>}/> {/* 스토리 추가 */}
                                    <Route path="/my-story/form/update/:storyId"
                                           element={<StoryUpdateForm/>}/> {/* 스토리 수정 */}
                                    <Route path="/faqs" element={<FaqBoard/>}/> {/* FAQ 목록 페이지 */}
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
