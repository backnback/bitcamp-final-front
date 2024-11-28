import React, { useEffect, useState, useContext } from 'react';
import Flicking, { ViewportSlot, DisabledState } from "@egjs/react-flicking";
import { Arrow } from "@egjs/flicking-plugins";
import likeStoryStyles from "../assets/styles/css/StoryItemList.module.css";
import styles from '../assets/styles/css/MyPage.module.css';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
// import './ShareStoryList.css'; // 스타일 파일 임포트
import axiosInstance from '../components/AxiosInstance.js';
import AlarmCardList from "../components/AlarmCardList";
import Profile from "../components/Profile";
import ShareStoryView from './ShareStoryView.js';
import useModals from '../useModals';
import { modals } from '../components/Modals';
import StoryItem from '../components/StoryItem.js';
import { useRef } from 'react';


const MyPage = () => {
    const flickingRef = useRef(null); // Flicking에 대한 ref를 생성
    const _plugins = [new Arrow()];
    const [storyList, setStoryList] = useState([]); // 변수 이름을 stories로 수정
    const [alarmListDTOs, setAlarmListDTOs] = useState([]);
    const [user, setUser] = useState([]);
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
    const [isThrottled, setIsThrottled] = useState(false);
    const [batchedLocks, setBatchedLocks] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const { openModal } = useModals();


    // 좋아요 처리
    const handleLikeChange = async (storyId, action) => {
        if (isThrottled) {
            console.log("너무 빠른 요청입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        setIsThrottled(true); // 클릭 비활성화

        try {
            await axiosInstance.post('/like/update', { storyId, action }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('좋아요 상태 변경 성공');
        } catch (error) {
            console.error("좋아요 변경 사항 전송 중 에러 발생", error);
        } finally {
            // 500ms 이후 클릭 활성화
            setTimeout(() => setIsThrottled(false), 500);
        }
    };


    const confirmView = async (storyId, otherUserId) => {
        try {
            // storyId와 otherUserId를 URL 파라미터로 포함하여 GET 요청
            await axiosInstance.get(`/like/confirm/${storyId}/${otherUserId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            // 알림 목록을 다시 불러옵니다.
            const response = await axiosInstance.get('/like/list/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setAlarmListDTOs(response.data);  // 알림 목록 상태 업데이트
        } catch (error) {
            console.error("알림 확인 중 에러 발생", error);
        }
    };


    // 스토리 조회 모달
    const openStoryModal = (storyId) => {
        const content = <div className='modal__body'><ShareStoryView storyId={storyId} /></div>
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('비지니스 로직 처리...2');
            },
            content
        });
    };

    useEffect(() => {
        // 로컬 스토리지에서 accessToken을 가져오는 함수
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }

        // accessToken이 설정된 경우에만 호출
        if (accessToken) {
            const fetchStoryList = async () => {
                try {
                    const response = await axiosInstance.get('/like/list/my-stories', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setStoryList(response.data);
                } catch (error) {
                    console.error("좋아요한 스토리 불러오기 실패!", error);
                }
            };
            fetchStoryList();
        }

        // 로그인한 사용자 정보를 불러올수도 있고 아닐수도 있고 그럴수도 있고
        if (accessToken) {
            const fetchUser = async () => {
                try {
                    const response = await axiosInstance.get('/user/finduser', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setUser(response.data);
                } catch (error) {
                    console.error("사용자 정보 불러오기 실패", error);
                }
            };
            fetchUser();
        }

        // 로그인한 사용자의 스토리에 좋아요를 누른 유저의 리스트 불러오기
        if (accessToken) {
            const fetchAlarmListDTOs = async () => {
                try {
                    const response2 = await axiosInstance.get('/like/list/users', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setAlarmListDTOs(response2.data);
                } catch (error) {
                    console.error("오류가 발생했습니다!", error);
                }
            };
            fetchAlarmListDTOs();
        }
    }, [accessToken]);



    return (
        <div className={`${styles.container}`}>
            <div className={`${styles.profile__wrap} ${styles.box__wrap}`}>
                <Profile loginUser={user} />
            </div>
            <div className={`${styles.box__wrap}`}>
                <div className={`${styles.title__wrap}`}>
                    <h3 className={`${styles.title}`}>좋아요한 스토리({storyList.length})</h3>
                </div>
                <div className={`${styles.content__wrap} ${styles.likeStory__wrap}`}>
                    <div className={`${styles.likeStory__list__ul}`}>
                        <Flicking
                            // renderOnlyVisible={true}
                            // ref={flickingRef} // Flicking에 ref 연결
                            circular={false}  // 순환 슬라이드 여부
                            align={'prev'}
                            cameraTag={'ul'}
                            plugins={_plugins}
                        >
                            {Array.isArray(storyList) && storyList.map(storyListDTO => (
                                <li className={`${likeStoryStyles.list__item} ${styles.likeStory__list__item} flicking-panel`} key={storyListDTO.storyId}>
                                    <StoryItem
                                        storyPage={'like-story'}
                                        storyId={storyListDTO.storyId}
                                        profileImg={storyListDTO.userPath || 'default.png'} // 프로필 이미지
                                        profileName={storyListDTO.userNickname} // 프로필 이름
                                        currentLock={!storyListDTO.share} // 공유 여부
                                        storyThum={storyListDTO.mainPhoto.path || 'default.png'} // 썸네일 이미지
                                        currentLike={storyListDTO.likeStatus} // 좋아요 상태
                                        currentLikeCount={storyListDTO.likeCount} // 좋아요 개수
                                        storyTitle={storyListDTO.title} // 스토리 제목
                                        storyContent={storyListDTO.content} // 스토리 내용
                                        storyLocation={`${storyListDTO.locationFirstName} ${storyListDTO.locationSecondName}`} // 위치 정보
                                        storyDate={storyListDTO.travelDate} // 여행 날짜
                                        onLikeChange={handleLikeChange}  // 좋아요 변경 시 호출할 함수 전달
                                        onClick={() => openStoryModal(storyListDTO.storyId)}
                                    />
                                </li>
                                // <div className="flicking-panel" key={index}>{index + 1}</div>
                            ))}

                            <ViewportSlot>
                                <button type='button' className="flicking-arrow-prev flicking-arrow-custom">
                                    <span className='blind'>이전</span>
                                </button>
                                <button type='button' className="flicking-arrow-next flicking-arrow-custom">
                                    <span className='blind'>다음</span>
                                </button>
                            </ViewportSlot>
                        </Flicking>
                    </div>

                    {/* <StoryItemList
                        storyPage={'like-story'}
                        storyList={storyList}
                        onBatchedLikesChange={handleBatchedLikesChange}
                        onBatchedLocksChange={handleBatchedLocksChange}
                        handleModal={openStoryModal}
                    /> */}
                </div>

                <div className={`${styles.likeStory__more}`}>
                    <Link to={`/like-story/list`} className={`button button__darkgray`}>
                        <span className={`button__text`}>더보기</span>
                    </Link>
                </div>
            </div>

            <div className={`${styles.box__wrap}`}>
                <div className={`${styles.title__wrap}`}>
                    <h3 className={`${styles.title}`}>알림({alarmListDTOs.length})</h3>
                </div>
                <div className={`${styles.content__wrap} ${styles.alarm__wrap}`}>
                    <AlarmCardList
                        alarmListDTOs={alarmListDTOs}
                        confirmView={confirmView}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyPage;
