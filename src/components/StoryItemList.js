import styles from "../assets/styles/css/StoryItemList.module.css";
import StoryItem from '../components/StoryItem';
import { StoryAddContext } from '../components/StoryItem';

function StoryItemList({ storyPage, storyList, onAddStory, onLikeChange, onLockChange, handleModal, onDelete }) {

    const handleLikeChange = (storyId, action) => {
        // console.log(`Story ID: ${storyId}, Action: ${action}`);
        onLikeChange(storyId, action);
    };

    const handleLockChange = (storyId, action) => {
        // console.log(`Story ID: ${storyId}, Action: ${action}`);
        onLockChange(storyId, action);  // 즉시 변경 사항 전달
    };

    const handleModalWithStoryId = (storyId) => {
        handleModal(storyId);
    };

    const handleDelete = (storyId) => {
        if (onDelete) {
            onDelete(storyId); // 삭제 로직을 처리할 부모 컴포넌트의 함수를 호출
        }
    };

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
                            profileName={storyListDTO.userNickname || '익명'} // 프로필 이름
                            currentLock={!storyListDTO.share} // 공유 여부
                            storyThum={storyListDTO.mainPhoto?.path || 'default.png'} // 썸네일 이미지
                            currentLike={storyListDTO.likeStatus} // 좋아요 상태
                            currentLikeCount={storyListDTO.likeCount || 0} // 좋아요 개수
                            storyTitle={storyListDTO.title || '제목 없음'} // 스토리 제목
                            storyContent={storyListDTO.content || '내용 없음'} // 스토리 내용
                            storyLocation={`${storyListDTO.locationFirstName || ''} ${storyListDTO.locationSecondName || ''}`} // 위치 정보
                            storyDate={storyListDTO.travelDate || '날짜 정보 없음'} // 여행 날짜
                            onLikeChange={handleLikeChange}  // 좋아요 변경 시 호출할 함수 전달
                            onLockChange={handleLockChange}
                            onClick={() => handleModalWithStoryId(storyListDTO.storyId)}
                            onDelete={handleDelete} // 삭제 함수 전달
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StoryItemList;