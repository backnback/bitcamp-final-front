import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/AxiosInstance';
import StoryUpdateForm from './StoryUpdateForm';
import Swal from 'sweetalert2';
import StoryItemView from '../components/StoryItemView';
import useModals from '../useModals';
import { modals } from '../components/Modals';


const StoryView = ({ storyId, mapId }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [storyViewDTO, setStoryViewDTO] = useState(null);
    const { openModal } = useModals();


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
                    const response = await axiosInstance.get(`/story/view/${storyId}`, {
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
                    await axiosInstance.delete(`/my-story/delete/${storyId}`, {
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
        const content = <StoryUpdateForm storyId={storyId} mapId={mapId}/>
        openModal(modals.modalSidebarRight, {
            onSubmit: () => {
                console.log('확인 클릭');
            },
            content
        });

    };



    return (
        <StoryItemView
            storyViewDTO={storyViewDTO}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            share={false}
        />
    );
}

export default StoryView;
