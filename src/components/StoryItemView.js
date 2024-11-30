import React from 'react';
import { ButtonProvider } from '../components/ButtonProvider';
import { PhotosProvider } from '../components/PhotosProvider';
import styles from "../assets/styles/css/StoryView.module.css"
import { SmallProfileProvider } from './Profile';

function StoryItemView({ storyViewDTO, handleEdit, handleDelete, share }) {

    if (!storyViewDTO) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.title__box}>
                <span className={`${styles.title__icon__left}`}>
                    {
                        storyViewDTO.share ?
                            (<i className={`icon icon__unlock`}></i>)
                            :
                            (<i className={`icon icon__lock__black`}></i>)
                    }
                </span>
                <h3 className={styles.title__text}>{storyViewDTO.title}</h3>
            </div>
            <div className={styles.location__date__box}>
                {/* <SmallProfileProvider profileName={profileName} profileImg={profileImg} /> */}
                <p className={`${styles.location__date__text}`}>
                    <span className={styles.date__text}>
                        {storyViewDTO.travelDate}
                    </span>
                    <span className={`${styles.location__text}`}>
                        {`${storyViewDTO.locationFirstName} ${storyViewDTO.locationSecondName} ${storyViewDTO.locationDetail != '' ? storyViewDTO.locationDetail : ''}`}
                    </span>
                </p>
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
