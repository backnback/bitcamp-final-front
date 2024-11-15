import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import styles from "../assets/styles/css/StoryItemList.module.css";
import StoryItem from '../components/StoryItem';
import { StoryAddContext } from '../components/StoryItem';


function StoryItemList({ storyPage, storyList, onAddStory, onBatchedLikesChange, onBatchedLocksChange, handleModal }) {
    const [batchedLikes, setBatchedLikes] = useState([]);
    const [batchedLocks, setBatchedLocks] = useState([]);

    const handleLikeChange = (storyId, action) => {
        console.log(`Story ID: ${storyId}, Action: ${action}`);
        setBatchedLikes((prev) => [...prev, { storyId, action }]);
        onBatchedLikesChange(batchedLikes);  // 즉시 변경 사항 전달
        return batchedLikes;
    };

    // useEffect(() => {
    //     if (batchedLikes.length > 0) {
    //         onBatchedLikesChange(batchedLikes);
    //     }
    // }, [batchedLikes]);


    const handleLockChange = (storyId, action) => {
        console.log(`Story ID: ${storyId}, Action: ${action}`);
        setBatchedLocks((prev) => [...prev, { storyId, action }]);
        onBatchedLocksChange(batchedLocks);  // 즉시 변경 사항 전달
        return batchedLocks;
    };

    const handleModalWithStoryId = (storyId) => {
        handleModal(storyId);
    };

    useEffect(() => {
        if (batchedLikes.length > 0) {
            onBatchedLikesChange(batchedLikes);
        }

        if (batchedLocks.length > 0) {
            onBatchedLocksChange(batchedLocks);
        }
    }, [batchedLikes, batchedLocks]);

    return (
        <div className={styles.list}>
            <ul className={styles.list__ul}>
                {/* 스토리 추가 버튼 */}
                {onAddStory && (
                    <li className={styles.list__add}>
                        <StoryAddContext>
                            <button type="button" className={`button button__story__add`} onClick={onAddStory}>
                                <span className={`blind`}>스토리 등록</span>
                                <i className={`icon icon__plus__white`}></i>
                            </button>
                        </StoryAddContext>
                    </li>
                )}
                {/* 스토리 아이템 목록 */}
                {Array.isArray(storyList) && storyList.map((storyListDTO) => (
                    <li className={styles.list__item} key={storyListDTO.storyId}>
                        <StoryItem
                            storyPage={storyPage}
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
                            onLockChange={handleLockChange}
                            onClick={() => handleModalWithStoryId(storyListDTO.storyId)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StoryItemList;
