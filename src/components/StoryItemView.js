import React from 'react';
import { ButtonProvider } from '../components/ButtonProvider';
import { PhotosProvider } from '../components/PhotosProvider';
import styles from "../assets/styles/css/StoryView.module.css"

function StoryItemView({ storyViewDTO, handleEdit, handleDelete, share }) {

    if (!storyViewDTO) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.title__box}>
                {
                    storyViewDTO.share ?
                        (<i className={`icon icon__unlock`}></i>)
                        :
                        (<i className={`icon icon__lock__black`}></i>)
                }
                <h1 className={styles.title__text}>{storyViewDTO.title}</h1>
            </div>
            <div className={styles.location__date__box}>
                <span
                    className={styles.location__date__text}>{storyViewDTO.travelDate} | {storyViewDTO.locationDetail}</span>
            </div>

            <PhotosProvider
                photos={storyViewDTO.photos}
                viewMode={true}
                className="custom-photo-container"
                mainPhotoIndex={storyViewDTO.mainPhotoIndex}
            />
            <p className={styles.content__box}>{storyViewDTO.content}</p>

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
