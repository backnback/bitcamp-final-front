import Map from '../components/Map';
import { useEffect, useState } from "react";
import axiosInstance from '../components/AxiosInstance';
import Sidebar from "../components/Sidebar";
import sidebarStyles from "../assets/styles/css/MapSidebar.module.css";
import mapStyles from '../assets/styles/css/Map.module.css';

function StoryMap() {

    const [accessToken, setAccessToken] = useState(null);
    const [mapStoryList, setMapStoryList] = useState(null);
    const [sideHovered, setSideHovered] = useState(null);
    const [mapHovered, setMapHovered] = useState(null);

    useEffect(() => {
        document.body.className = 'body body__map';

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
        <div id='map' className={`${mapStyles.container}`}>
            <div className={`${sidebarStyles.container}`}>
                <Sidebar onHovered={setSideHovered} mapHovered={mapHovered}/>
            </div>
            <div className={`${mapStyles.map__container}`}>
                <Map storyList={mapStoryList} hovered={sideHovered} setMapHovered={setMapHovered}/>
            </div>
        </div>
    )
}

export default StoryMap;