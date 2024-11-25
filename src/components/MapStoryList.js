import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import StoryItem, {StoryAddContext} from "./StoryItem";
import StoryView from "../routes/StoryView";
import {modals} from "./Modals";
import StoryAddForm from "../routes/StoryAddForm";
import useModals from "../useModals";
import {ButtonProvider} from "./ButtonProvider";
import styles from '../assets/styles/css/MapStoryList.module.css';

const MapStoryList = ({storyList, onAddStory, locationId, cityId}) => {

    const {openModal} = useModals();

    console.log(storyList)

    const openAddModal = () => {
        const content = <StoryAddForm provinceId={locationId} cityId={cityId}/>
        openModal(modals.storyEditModal, {
            content
        });
        //navigate("/my-story/form/add");
    };

    return (
        <div>
            <ul>
                {/* 스토리 추가 버튼 */}
                <li className={styles.add__button__box}>
                    <ButtonProvider>
                        <button type="button" className={`button button__primary`} onClick={openAddModal}>
                            <span className={`button__text`}>새 스토리 등록</span>
                        </button>
                    </ButtonProvider>
                </li>
                <div className={styles.line}></div>
                {Array.isArray(storyList) && storyList.map((storyListDTO) => (
                    <li>
                        <div className={styles.list__box}>
                            <StoryView
                                storyId={storyListDTO.storyId}
                                mapId={locationId}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MapStoryList;