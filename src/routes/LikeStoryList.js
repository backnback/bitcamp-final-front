import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
// import './ShareStoryList.css'; // 스타일 파일 임포트
import axiosInstance from '../components/AxiosInstance.js';
import useModals from '../useModals';
import { modals } from '../components/Modals';
import { ButtonProvider } from '../components/ButtonProvider.js';
import StoryItemList from '../components/StoryItemList.js';
import styles from '../assets/styles/css/StoryItemList.module.css';
import ShareStoryView from './ShareStoryView.js';
import { StoryTitleProvider } from '../components/TitleProvider.js';


const MyPage = () => {
    const [storyList, setStoryList] = useState([]); // 변수 이름을 stories로 수정
    const [user, setUser] = useState([]);
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
    const [batchedLikes, setBatchedLikes] = useState([]);
    const [batchedLocks, setBatchedLocks] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const { openModal } = useModals();

    // StoryItemList에서 모아둔 like 변경 사항을 저장하는 함수
    const handleBatchedLikesChange = (newBatchedLikes) => {
        setBatchedLikes(newBatchedLikes);
    };

    // 페이지 이동이나 새로고침 시, 서버에 좋아요 변경 사항 전송
    const handleSubmitLikes = async () => {
        if (batchedLikes.length === 0) return;

        try {
            console.log(batchedLikes);
            await axiosInstance.post('/like/batch-update', batchedLikes, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBatchedLikes([]); // 전송 후 초기화
        } catch (error) {
            console.error("좋아요 변경 사항 전송 중 에러 발생", error);
        }
    };

    // StoryItemList에서 모아둔 Lock 변경 사항을 저장하는 함수
    const handleBatchedLocksChange = (newBatchedLocks) => {
        setBatchedLocks(newBatchedLocks);
    };

    // 페이지 이동이나 새로고침 시, 서버에 공유 변경 사항 전송
    const handleSubmitLocks = async () => {
        if (batchedLocks.length === 0) return;

        try {
            console.log(batchedLocks);
            await axiosInstance.post('/story/batch-update', batchedLocks, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBatchedLocks([]); // 전송 후 초기화
        } catch (error) {
            console.error("공유 변경 사항 전송 중 에러 발생", error);
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
    }, [accessToken]);

    useEffect(() => {
        // 페이지 새로고침 시 전송
        window.addEventListener('beforeunload', handleSubmitLikes);

        // 페이지 이동 시 전송
        const unlisten = navigate((location) => {
            handleSubmitLikes();
        });
        return () => {
            window.removeEventListener('beforeunload', handleSubmitLikes);
            handleSubmitLikes(); // 컴포넌트 언마운트 시에도 전송
        };
    }, [batchedLikes]);

    useEffect(() => {
        // 페이지 새로고침 시 전송
        window.addEventListener('beforeunload', handleSubmitLocks);

        // 페이지 이동 시 전송
        const unlisten = navigate((location) => {
            handleSubmitLocks();
        });
        return () => {
            window.removeEventListener('beforeunload', handleSubmitLocks);
            handleSubmitLocks(); // 컴포넌트 언마운트 시에도 전송
        };
    }, [batchedLocks]);

    return (
        <div className={styles.list__content__wrap}>
            {/* <div className='search__wrap'>
                <form className="search__form" onSubmit={handleSearchSubmit}>
                    <div className='search__form__wrap'>
                        <div className={`search__form__item search__form__item__select`}>
                            <SelectProvider>
                                <select id="search-select" name="검색어" className={`form__select form__select__search`}
                                    title='검색' onChange={handleOptionChange}>
                                    <option value={'0'}>제목</option>
                                    <option value={'1'}>닉네임</option>
                                </select>
                            </SelectProvider>
                        </div>

                        <div className={`search__form__item search__form__item__input`}>
                            <InputProvider>
                                <input
                                    type='text'
                                    className={`form__input form__input__search`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    required
                                    id='text01'
                                    name='검색'
                                    placeholder="검색" />
                            </InputProvider>

                            <div className={`search__input__item__button`}>
                                {searchQuery && <ButtonProvider width={'icon'} className={`button__item__x`}>
                                    <button type="button" className={`button button__icon button__icon__x`} onClick={handleSearchDelete}>
                                        <span className={`blind`}>삭제</span>
                                        <i className={`icon icon__x__black`}></i>
                                    </button>
                                </ButtonProvider>}

                                <ButtonProvider width={'icon'} className={`button__item__search`}>
                                    <button type="button" className={`button button__icon button__icon__search`} onClick={handleSearchSubmit}>
                                        <span className={`blind`}>검색</span>
                                        <i className={`icon__search`}></i>
                                    </button>
                                </ButtonProvider>
                            </div>

                        </div>
                    </div>
                </form>
            </div> */}

            <StoryTitleProvider
                title={`좋아요한 스토리(${storyList.length})`}
            // selectChildren={
            //     <SelectProvider>
            //         <select id="select01" name="스토리 정렬" className={`form__select`}
            //             title='스토리 정렬 방식 선택' onChange={handleSortByChange}>
            //             <option value={'0'}>최신순</option>
            //             <option value={'1'}>과거순</option>
            //             <option value={'2'}>좋아요순</option>
            //         </select>
            //     </SelectProvider>}
            />
            <div className={styles.list__wrap}>
                <StoryItemList
                    storyPage={'like-story'}
                    storyList={storyList}
                    onBatchedLikesChange={handleBatchedLikesChange}
                    onBatchedLocksChange={handleBatchedLocksChange}
                    handleModal={openStoryModal}
                />
            </div>
        </div>
    );
};

export default MyPage;
