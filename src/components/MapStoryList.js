import React, { createContext, useContext } from "react";
import StoryView from "../routes/StoryView";
import { ButtonProvider } from "./ButtonProvider";
import styles from '../assets/styles/css/StoryView.module.css';

const headerContent = createContext();

export const useHeaderContent = () => useContext(headerContent);

export const HeaderContent = ({ value, onSubmit }) => {
    return (
        <>
            <div className='modal__header__center' value>
                <ButtonProvider className={`modal__header__button`}>
                    <button type="button" className={`button button__primary`} onClick={onSubmit}>
                        <span className={`button__text`}>새 스토리 등록</span>
                    </button>
                </ButtonProvider>
            </div >
            <div className="modal__header__right">
                <i className="icon icon__35"></i>
            </div>
        </>
    )
}

const MapStoryList = ({ storyList, locationId }) => {

    return (
        <ul className={`${styles.story__view__list}`}>
            {Array.isArray(storyList) && storyList.map((storyListDTO) => (
                <li key={`${storyListDTO.storyId}`} className={`${styles.story__view__item}`}>
                    <StoryView
                        storyId={storyListDTO.storyId}
                        mapId={locationId}
                    />
                </li>
            ))}
        </ul>
    );
}

export default MapStoryList;