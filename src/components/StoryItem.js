import { useEffect, useState } from "react";
import { ButtonProvider } from "./ButtonProvider";
import styles from "../assets/styles/css/StoryItem.module.css";

import { createContext, useContext } from 'react';
import { SmallProfileProvider } from "./Profile";

const StoryAdd = createContext();

export const useStoryAddContext = () => useContext(StoryAdd);

export const StoryAddContext = ({ children }) => {
    return (
        <div className={`${styles.item} ${styles.add}`}>
            {children}
        </div>
    );
}

function StoryItem({ storyId, storyPage = 'my-story', profileImg, profileName, currentLock, storyThum, currentLike, currentLikeCount, storyTitle, storyContent, storyLocation, storyDate, onLikeChange, onLockChange, onClick, onDelete }) {
    const [like, setLike] = useState(currentLike);
    const [lock, setLock] = useState(currentLock);

    const lockClick = () => {
        const newLock = !lock;
        if (newLock !== lock) {
            onLockChange(storyId, newLock ? 'delete' : 'add');
            setLock(newLock);
        }
    }

    const likeClick = () => {
        const newLike = !like;
        if (newLike !== like) {
            onLikeChange(storyId, newLike ? 'add' : 'delete');
            setLike(newLike);
        }
    }

    const deleteClick = () => {
        if (onDelete) {
            onDelete(storyId); // 삭제 함수가 부모로부터 전달되었을 경우 호출
        }
    }

    useEffect(() => {
    }, []);
    return (
        <div className={styles.item}>
            <div className={styles.top}>
                <SmallProfileProvider profileName={profileName} profileImg={profileImg} />
                {
                    storyPage == 'my-story' ?
                        <ButtonProvider width={'icon'} className={`${styles.button__item}`}>
                            <button type="button" className={`button button__icon`} onClick={lockClick}>
                                <span className={`blind`}>공개</span>
                                <i className={`icon ${lock ? `icon__lock__black` : `icon__unlock`}`}></i>   {/* 테스트 후 변경해야함 이걸로 `icon__unlock` */}
                            </button>
                        </ButtonProvider> :
                        null
                }
                {
                    storyPage == 'all-story' ?
                        <ButtonProvider width={'icon'}>
                            <button type="button" className={`button button__icon`} onClick={deleteClick}>
                                <i data-button="icon" className={`icon icon__trash__red`}></i>
                            </button>
                        </ButtonProvider> :
                        null
                }

            </div>
            <div role="button" tabIndex={0} className={styles.middle} onClick={onClick}>
                <img src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${storyThum}`}
                    alt={'story image'} className={`${styles.thumbnail}`} />
            </div>
            <div className={styles.bottom}>
                <div className={styles.bottom__header}>
                    <ButtonProvider width={'icon'} className={`${styles.button__item}`}>
                        <button type="button" className={`button button__icon`} onClick={likeClick}>
                            <span className={`blind`}>좋아요</span>
                            <i className={`icon ${like ? `icon__heart__full` : `icon__heart`}`}></i>
                        </button>
                    </ButtonProvider>
                    <span className={`${styles.like__count}`}>{like ? currentLikeCount + 1 : currentLikeCount}</span>
                </div>
                <button type="button" className={`${styles.view__button}`} onClick={onClick}>
                    <div className={`${styles.bottom__body}`}>
                        <strong className={`${styles.title} line1`}>{storyTitle}</strong>
                        <p className={`${styles.content}`}>{storyContent} </p>
                    </div>
                    <div className={`${styles.bottom__footer}`}>
                        <span className={`${styles.location}`}>{storyLocation}</span>
                        <span className={`${styles.date}`}>{storyDate}</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default StoryItem;
