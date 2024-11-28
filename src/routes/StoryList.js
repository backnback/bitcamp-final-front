import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
import axiosInstance from '../components/AxiosInstance.js';
import { StoryAddContext } from '../components/StoryItem';
import StoryItemList from '../components/StoryItemList';
import StoryEditModal from '../components/StoryEditModal';
import SearchProvider from "../components/SearchProvider";
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
    const { openModal } = useModals();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [limit, setLimit] = useState(6);
    const [hasMore, setHasMore] = useState(true);


    const handleScrollEnd = () => {
        if (hasMore) {
            window.scrollBy({
                top: -50,
                behavior: 'smooth',
            });
            setLimit((prevLimit) => prevLimit + 6);
        } else {
            window.scrollBy({
                top: -50,
                behavior: 'smooth',
            });
        };
    }

    UseScrollAlert(handleScrollEnd);

    // 정렬 옵션 변경
    const handleSortByChange = (event) => {
        if (hasMore == false) {
            setHasMore(true);
        }

        let sortByOption = "";

        if (event.target.value === "1") {
            sortByOption = "과거순";
        } else if (event.target.value === "2") {
            sortByOption = "좋아요순";
        }

        setSortBy(sortByOption);

        if (accessToken) {
            fetchStoryList(accessToken, sortByOption, searchQuery, setStoryList);
        }
    }


    // 검색 값 변경
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value == '') {
            fetchStoryList(accessToken, sortBy, '', setStoryList, limit, setHasMore);
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
        fetchStoryList(accessToken, sortBy, '', setStoryList, limit, setHasMore);
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


    // 공유 처리
    const handleLockChange = async (storyId, action) => {
        if (isThrottled) {
            console.log("너무 빠른 요청입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        setIsThrottled(true); // 클릭 비활성화

        try {
            await axiosInstance.post('/story/share-update', { storyId, action }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('공유 상태 변경 성공');
        } catch (error) {
            console.error("공유 변경 사항 전송 중 에러 발생", error);
        } finally {
            // 500ms 이후 클릭 활성화
            setTimeout(() => setIsThrottled(false), 500);
        }
    };

    // 스토리 조회 모달
    const openStoryModal = (storyId) => {
        const content = <div className='modal__body'><StoryView storyId={storyId} /></div>
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('비지니스 로직 처리...2');
            },
            content
        });
    };

    // 스토리 추가 모달
    const openAddModal = () => {
        const content = <StoryEditModal />
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('비지니스 로직 처리...2');
            },
            content
        });
    };

    useEffect(() => {
        const loadAccessTokenAndFetchStories = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setAccessToken(token);
                try {
                    await fetchStoryList(token, sortBy, searchQuery, setStoryList, limit, setHasMore);
                } catch (error) {
                    console.error("Error fetching story list:", error);
                }
            } else {
                console.warn("Access token이 없습니다.");
                navigate('/login'); // 로그인 페이지로 이동 (필요 시 추가)
            }
        };

        loadAccessTokenAndFetchStories();
    }, [sortBy, limit, navigate]);

    useEffect(() => {
        if (accessToken) {
            fetchStoryList(accessToken, sortBy, searchQuery, setStoryList, limit, setHasMore);
        }
    }, [accessToken, limit]); // limit 변경 시 fetch 호출


    return (
        <div className={styles.list__content__wrap}>
            <SearchProvider
                handleSearchSubmit={handleSearchSubmit}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                handleSearchDelete={handleSearchDelete}
            />

            <StoryTitleProvider
                title={`내 스토리(${storyList.length})`}
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
                    onLockChange={handleLockChange}
                    handleModal={openStoryModal}
                />
            </div>
        </div>

    );
};
export default MyStoryList;
