import React, { useEffect } from 'react';
import { ButtonProvider } from '../components/ButtonProvider';
import { PhotosProvider } from '../components/PhotosProvider';
import { SmallProfileProvider } from './Profile';
import styles from "../assets/styles/css/StoryView.module.css"

function StoryItemView({ storyViewDTO, handleEdit, handleDelete, share }) {

    if (!storyViewDTO) {
        return <div>로딩 중...</div>;
    }

    console.log('viewview', storyViewDTO)

    return (
        <div className={styles.container}>
            <div className={styles.title__box}>
                {/* icon lock */}
                <span className={`${styles.title__icon__left}`}>
                    {
                        storyViewDTO.share ?
                            (<i className={`icon icon__unlock`}></i>)
                            :
                            (<i className={`icon icon__lock__black`}></i>)
                    }
                </span>
                {/* title */}
                <h3 className={styles.title__text}>{storyViewDTO.title}</h3>
            </div>
            <div className={`${styles.title__sub__box}`}>
                {/* profile */}
                <SmallProfileProvider profileName={storyViewDTO.userNickname} profileImg={storyViewDTO.userPath} className={`${styles.title__sub__profile} ${styles.title__sub__item}`} />

                {/* date/location */}
                <div className={`${styles.location__date__box} ${styles.title__sub__item}`}>
                    <p className={`${styles.location__date__text}`}>
                        <span className={styles.date__text}>
                            {storyViewDTO.travelDate}
                        </span>
                        <span className={`${styles.location__text}`}>
                            {`${storyViewDTO.locationFirstName} ${storyViewDTO.locationSecondName} ${storyViewDTO.locationDetail != '' ? storyViewDTO.locationDetail : ''}`}
                        </span>
                    </p>
                </div>
            </div>

            <PhotosProvider
                photos={storyViewDTO.photos}
                viewMode={true}
                className="custom-photo-container"
                mainPhotoIndex={storyViewDTO.mainPhotoIndex}
            />
            <div className={styles.content__box}>
                <p className={`${styles.content__text} text__content`}>{storyViewDTO.content}</p>
            </div>

            {!share &&
                <div className={styles.button__group}>
                    <ButtonProvider className={styles.modify__button}>
                        <button type="button" className={`button button__whitePrimary`} onClick={handleEdit}>
                            <span className={`button__text`}>수정</span>
                        </button>
                    </ButtonProvider>
                    <ButtonProvider className={styles.delete__button}>
                        <button type="button" className={`button button__whiteRed`} onClick={handleDelete}>
                            <span className={`button__text`}>삭제</span>
                        </button>
                    </ButtonProvider>
                </div>
            }
        </div>
    );
};


export default StoryItemView;
