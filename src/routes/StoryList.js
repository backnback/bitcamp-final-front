import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
import axiosInstance from '../components/AxiosInstance.js';
import { StoryAddContext } from '../components/StoryItem';
import StoryItemList from '../components/StoryItemList';
import StoryAddForm from './StoryAddForm';
import StoryEditModal from '../components/StoryEditModal';
import StoryView from './StoryView.js';
import useModals from '../useModals';
import { modals } from '../components/Modals';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { StoryTitleProvider } from '../components/TitleProvider.js';
import { SelectProvider } from '../components/SelectProvider.js';
import styles from '../assets/styles/css/StoryItemList.module.css';
import UseScrollAlert from './UseScrollAlert.js';

const fetchStoryList = async (accessToken, sortByOption, searchQuery, setStoryList, limit, setHasMore) => {
    try {
        const response = await axiosInstance.get('/story/list', {
            params: {
                title: searchQuery,
                share: false,
                sortBy: sortByOption,
                limit
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setStoryList(response.data.stories);
        setHasMore(response.data.hasMore);
    } catch (error) {
        console.error("There was an error", error);
    }
};

const MyStoryList = () => {
    const [storyList, setStoryList] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
    const [isThrottled, setIsThrottled] = useState(false);
    const [batchedLocks, setBatchedLocks] = useState([]);
    const { openModal } = useModals();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [limit, setLimit] = useState(5);
    const [hasMore, setHasMore] = useState(true);


    const handleScrollEnd = () => {
        if (hasMore) {
            setLimit((prevLimit) => prevLimit + 5);
        } else {
            alert("현재 가지고 올 수 있는 데이터를 모두 가지고 왔습니다.");
        }
    };

    UseScrollAlert(handleScrollEnd);

    // 정렬 옵션 변경
    const handleSortByChange = (event) => {
        if (hasMore == false) {
            setHasMore(true);
        }
        const sortByOption = event.target.value === "1" ? "과거순" : "";
        setSortBy(sortByOption);
        if (accessToken) {
            fetchStoryList(accessToken, sortByOption, searchQuery, setStoryList);
        }
    }


    // 검색 값 변경
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value == '') {
            setBatchedLocks([]);
        }
    };

    // 검색 제출 버튼
    const handleSearchSubmit = (event) => {
        if (hasMore == false) {
            setHasMore(true);
        }
        event.preventDefault();
        if (accessToken) {
            fetchStoryList(accessToken, sortBy, searchQuery, setStoryList);
        }
    };

    const handleSearchDelete = (event) => {
        setSearchQuery((value) => value = '');
        setBatchedLocks([]);
    }


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
        const content = <StoryView storyId={storyId} />
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('비지니스 로직 처리...2');
            },
            content
        });
    };

    // 스토리 추가 모달
    const openAddModal = () => {
        const content = <StoryAddForm />
        openModal(modals.storyEditModal, {
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

        // accessToken이 설정된 경우에만 fetchList 호출
        if (accessToken) {
            const fetchStoryList = async () => {
                try {
                    const response = await axiosInstance.get('/story/list', {
                        params: {
                            share: false,
                            sortBy: sortBy
                        },
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setStoryList(response.data);
                } catch (error) {
                    console.error("There was an error", error);
                }
            };
            fetchStoryList();
        }

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
    }, [accessToken, batchedLocks]);

    useEffect(() => {
        if (accessToken) {
            fetchStoryList(accessToken, sortBy, searchQuery, setStoryList, limit, setHasMore);
        }
    }, [accessToken, limit]); // limit 변경 시 fetch 호출


    return (
        <div className={styles.list__content__wrap}>
            <div className='search__wrap'>
                <form className="search__form" onSubmit={handleSearchSubmit}>
                    <div className='search__form__wrap'>
                        <div className={`search__form__item search__form__item__select`}>
                            <SelectProvider>
                                <select id="search-select" name="검색어" className={`form__select form__select__search`} title='검색'>
                                    <option value={'0'}>제목</option>
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
            </div>

            <StoryTitleProvider
                title={'내 스토리'}
                selectChildren={
                    <SelectProvider>
                        <select id="select01" name="스토리 정렬" className={`form__select`}
                            title='스토리 정렬 방식 선택' onChange={handleSortByChange}>
                            <option value={'0'}>최신순</option>
                            <option value={'1'}>과거순</option>
                            <option value={'2'}>좋아요순</option>
                        </select>
                    </SelectProvider>}
            />
            <div className={styles.list__wrap}>
                <StoryItemList
                    storyList={storyList}
                    onAddStory={openAddModal}
                    onLikeChange={handleLikeChange}
                    onBatchedLocksChange={handleBatchedLocksChange}
                    handleModal={openStoryModal}
                />
            </div>
        </div>

    );
};
export default MyStoryList;
