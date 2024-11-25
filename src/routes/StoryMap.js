import Map from '../components/Map';
import styles from '../assets/styles/css/Map.css';
import {useEffect, useState} from "react";
import axiosInstance from '../components/AxiosInstance';
import Sidebar from "../components/Sidebar";

function StoryMap() {
    useEffect(() => {
        document.body.className = 'body body__story body__map'
    })

    const [accessToken, setAccessToken] = useState(null);
    const [mapStoryList, setMapStoryList] = useState(null);
    const [hovered, sethHovered] = useState(null);

    useEffect(() => {
        if (accessToken) {
            const mapProvince = async () => {
                try {
                    const response = await axiosInstance.get('/map', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }); // API 요청
                    setMapStoryList(response.data);
                } catch (error) {
                    console.error("There was an error", error);
                }
            };
            mapProvince();
        }
    }, [accessToken]);

    // 로컬 스토리지에서 accessToken을 가져오는 함수
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }
    }, []);


    return (
        <div className={`container`}>
            <Sidebar onHovered={sethHovered}/>
            <div className={`map__container`}>
                <Map storyList={mapStoryList} hovered={hovered}/>
            </div>
        </div>
    )
}

export default StoryMap;