import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import 추가
import axios from 'axios'; // axios를 import하여 API 요청 사용
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

const fetchStoryList = async (accessToken, sortByOption, searchQuery, setStoryList) => {
    try {
        const response = await axios.get('http://localhost:8080/story/list', {
            params: {
                title: searchQuery,
                share: false,
                sortBy: sortByOption
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        setStoryList(response.data);
    } catch (error) {
        console.error("There was an error", error);
    }
};

const MyStoryList = () => {
    const [storyList, setStoryList] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate(); // navigate 함수를 사용하여 페이지 이동
    const [batchedLikes, setBatchedLikes] = useState([]);
    const [batchedLocks, setBatchedLocks] = useState([]);
    const { openModal } = useModals();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");


    // 정렬 옵션 변경
    const handleSortByChange = (event) => {
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
        event.preventDefault();
        if (accessToken) {
            fetchStoryList(accessToken, sortBy, searchQuery, setStoryList);
        }
    };

    const handleSearchDelete = (event) => {
        setSearchQuery((value) => value = '');
        setBatchedLocks([]);
    }

    // StoryItemList에서 모아둔 like 변경 사항을 저장하는 함수
    const handleBatchedLikesChange = (newBatchedLikes) => {
        setBatchedLikes(newBatchedLikes);
    };

    // 페이지 이동이나 새로고침 시, 서버에 좋아요 변경 사항 전송
    const handleSubmitLikes = async () => {
        if (batchedLikes.length === 0) return;

        try {
            console.log(batchedLikes);
            await axios.post('http://localhost:8080/like/batch-update', batchedLikes, {
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
            await axios.post('http://localhost:8080/story/batch-update', batchedLocks, {
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
                    const response = await axios.get('http://localhost:8080/story/list', {
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
        window.addEventListener('beforeunload', handleSubmitLocks, handleSubmitLikes);

        // 페이지 이동 시 전송
        const unlisten = navigate((location) => {
            handleSubmitLikes();
            handleSubmitLocks();
        });
        return () => {
            window.removeEventListener('beforeunload', handleSubmitLocks, handleSubmitLikes);
            handleSubmitLikes(); // 컴포넌트 언마운트 시에도 전송
            handleSubmitLocks(); // 컴포넌트 언마운트 시에도 전송
        };
    }, [accessToken, batchedLikes, batchedLocks]);

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
                    onBatchedLikesChange={handleBatchedLikesChange}
                    onBatchedLocksChange={handleBatchedLocksChange}
                    handleModal={openStoryModal}
                />
            </div>
        </div>

    );
};
export default MyStoryList;
