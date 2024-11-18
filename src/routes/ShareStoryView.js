import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/AxiosInstance';
import StoryItemView from '../components/StoryItemView';


const ShareStoryView = ({ storyId }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [storyViewDTO, setStoryViewDTO] = useState(null);


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
        if (accessToken) {
            const fetchStoryViewDTO = async () => {
                try {
                    const response = await axiosInstance.get(`/story/view/${storyId}`, {
                        params: {
                            share: true
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



    return (
        <StoryItemView
            storyViewDTO={storyViewDTO}
            share={true}
        />

    );
};

export default ShareStoryView;
