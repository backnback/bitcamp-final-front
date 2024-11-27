import axiosInstance from '../components/AxiosInstance';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import StoryAddForm from "./StoryAddForm";
import useModals from "../useModals";
import { modals } from "../components/Modals";
import MapStoryList from "../components/MapStoryList";
import { mapPathJson } from "../mapPath.js";
import CityMap from "../components/CityMap";
import Sidebar from "../components/Sidebar";
import SidebarSecond from "../components/SidebarSecond";
import styles from '../assets/styles/css/MapLocation.module.css';

function MapLocation() {
    useEffect(() => {
        document.body.className = 'body body__map body__location';
    })

    const { locationId } = useParams(); // URL에서 ID 파라미터를 가져옴
    // const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
    const [accessToken, setAccessToken] = useState(null);
    const [storyPhotoList, setStoryPhotoList] = useState(null);
    const [id, setId] = useState(null);
    const [storyList, setStoryList] = useState(null);
    const [hovered, setHovered] = useState(null);
    const { openModal } = useModals();

    const RenderComponent = <CityMap />;
    // console.log(RenderComponent)

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }
        if (accessToken) {
            const fetchStoryViewDTO = async () => {
                try {
                    const response = await axiosInstance.get(`/map/story/${locationId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setStoryPhotoList(response.data);
                } catch (error) {
                    console.error("스토리를 가져오는 중 오류가 발생했습니다!", error);
                }
            };
            fetchStoryViewDTO();
        }
    }, [accessToken]);

    useEffect(() => {
        if (id !== null && accessToken !== null) {
            const getList = async () => {
                try {
                    const response = await axiosInstance.get(`/map/story/${locationId}/${id}/list`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    setStoryList(response.data)
                } catch (error) {
                    console.error("LocationID 가져오는 중 오류", error);
                }
            };
            getList();
        }

    }, [id]);

    useEffect(() => {
        if (storyList !== null) {
            if (storyList.length > 0) {
                openListModal();
                setId(null);
            } else {
                openAddModal();
                setId(null);
            }
        }
    }, [storyList])

    const openAddModal = () => {
        const content = <StoryAddForm provinceId={locationId} cityId={id} />
        openModal(modals.storyEditModal, {
            content
        });
    };

    const openListModal = () => {
        const content = <MapStoryList
            storyList={storyList}
            onAddStory={openAddModal}
            locationId={locationId}
            cityId={id}
        />
        openModal(modals.storyEditModal, {
            content
        });
    }

    const handleClick = (event) => {
        setId(event.currentTarget.id);  // 클릭한 요소의 id를 가져옴
    };

    return (
        <div id='maplocation' className={`${styles.container}`}>
            <Sidebar provinceId={locationId} />
            <SidebarSecond provinceId={locationId} clickEvent={handleClick} onHovered={setHovered} />
            <div>
                {RenderComponent ? (
                    React.cloneElement(RenderComponent, {
                        storyPhotoList: storyPhotoList,
                        eventClick: handleClick,
                        mapPaths: mapPathJson[locationId],
                        hovered: hovered
                    })
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}

export default MapLocation;