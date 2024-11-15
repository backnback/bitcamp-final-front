import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import StoryUpdateForm from './StoryUpdateForm';
import StoryEditModal from '../components/StoryEditModal';
import {ModalsDispatchContext} from '../components/ModalContext';
import {ButtonProvider} from '../components/ButtonProvider';
import {PhotosProvider} from '../components/PhotosProvider';
import styles from "../assets/styles/css/StoryView.module.css"
import Swal from 'sweetalert2';

const StoryView = ({storyId}) => {
    const [accessToken, setAccessToken] = useState(null);
    const [storyViewDTO, setStoryViewDTO] = useState(null);
    const {open} = useContext(ModalsDispatchContext);

    // 로컬 스토리지에서 accessToken을 가져오는 함수
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }
    }, []);



    useEffect(() => {
        if (storyViewDTO) {
            console.log("Updated storyViewDTO:", storyViewDTO);
        }
    }, [storyViewDTO]);


    // accessToken이 설정된 경우에만 fetchList 호출
    useEffect(() => {
        if (accessToken) {
            const fetchStoryViewDTO = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/story/view/${storyId}`, {
                        params: {
                            share: false
                        },
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setStoryViewDTO(response.data);
                } catch (error) {
                    console.error("스토리를 가져오는 중 오류가 발생했습니다!", error);
                }
            };
            fetchStoryViewDTO();
        }
    }, [accessToken, storyId]);

    if (!storyViewDTO) {
        return <div>로딩 중...</div>;
    }


    // 삭제 버튼 처리
    const handleDelete = async () => {
        Swal.fire({
            title: "정말 삭제하시겠습니까?",
            text: "삭제한 스토리는 복원할 수 없습니다!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete !"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/my-story/delete/${storyId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    Swal.fire({
                        title: "삭제 완료 !",
                        text: "스토리가 삭제되었습니다",
                        icon: "success"
                    }).then(() => {
                        window.location.reload(); // 삭제 후 페이지 새로고침
                    });
                } catch (error) {
                    console.error("스토리 삭제 중 오류가 발생했습니다!", error);
                    Swal.fire({
                        title: "Error!",
                        text: "스토리 삭제에 실패했습니다.",
                        icon: "error"
                    });
                }
            }
        });
    };



    // 업데이트 버튼 처리
    const handleEdit = () => {
        const content = <StoryUpdateForm storyId={storyId}/>
        open(StoryEditModal, {
            onSubmit: () => {
                console.log('확인 클릭');
            },
            onClose: () => {
                console.log('취소 클릭이야 클릭');
            },
            content
        });
    };

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
        </div>
    );
};

export default StoryView;
