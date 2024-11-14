import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import StoryItem, {StoryAddContext} from "./StoryItem";
import StoryView from "../routes/StoryView";
import styles from "../assets/styles/css/StoryItemList.module.css";
import {modals} from "./Modals";
import StoryAddForm from "../routes/StoryAddForm";
import useModals from "../useModals";

const MapStoryList = ({ storyPage, storyList, onAddStory, onBatchedLikesChange, onBatchedLocksChange, handleModal, locationId, cityId }) => {
    const [batchedLikes, setBatchedLikes] = useState([]);
    const [batchedLocks, setBatchedLocks] = useState([]);

    const { openModal } = useModals();

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
                {onAddStory && (
                    <li>
                        등록
                    </li>
                )}
                 스토리 아이템 목록
                {Array.isArray(storyList) && storyList.map((storyListDTO) => (
                    <li>
                        <StoryView
                            // storyPage={storyPage}
                            storyId={storyListDTO.storyId}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MapStoryList;