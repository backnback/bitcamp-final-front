import axiosInstance from '../components/AxiosInstance';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapSeoul from "../components/map/MapSeoul";
import MapBusan from "../components/map/MapBusan";
import MapDaegu from "../components/map/MapDaegu";
import MapDaejeon from "../components/map/MapDaejeon";
import MapGwangwon from "../components/map/MapGwangwon";
import MapGwangju from "../components/map/MapGwangju";
import MapGyeonggi from "../components/map/MapGyeonggi";
import MapIncheon from "../components/map/MapIncheon";
import MapJeju from "../components/map/MapJeju";
import MapNorthGyeongsang from "../components/map/MapNorthGyeongsang";
import MapNorthJeolla from "../components/map/MapNorthJeolla";
import MapSejong from "../components/map/MapSejong";
import MapSouthChungcheong from "../components/map/MapSouthChungcheong";
import MapSouthGyeongsan from "../components/map/MapSouthGyeongsan";
import MapSouthJeolla from "../components/map/MapSouthJeolla";
import MapUlsan from "../components/map/MapUlsan";
import MapNorthChungcheoung from "../components/map/MapNorthChungcheoung";
import StoryAddForm from "./StoryAddForm";
import useModals from "../useModals";
import { modals } from "../components/Modals";
import MapStoryList from "../components/MapStoryList";
import {mapPathJson} from "../mapPath.json";

function MapLocation() {
    const { locationId } = useParams(); // URL에서 ID 파라미터를 가져옴
    // const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
    const [accessToken, setAccessToken] = useState(null);
    const [storyPhotoList, setStoryPhotoList] = useState(null);
    const [id, setId] = useState(null);
    const [storyList, setStoryList] = useState(null);
    const { openModal } = useModals();

    const mapComponents = {
        11: <MapSeoul />,
        26: <MapBusan />,
        27: <MapDaegu />,
        28: <MapIncheon />,
        29: <MapGwangju />,
        30: <MapDaejeon />,
        31: <MapUlsan />,
        36: <MapSejong />,
        41: <MapGyeonggi />,
        51: <MapGwangwon />,
        43: <MapNorthChungcheoung />,
        44: <MapSouthChungcheong />,
        52: <MapNorthJeolla />,
        46: <MapSouthJeolla />,
        47: <MapNorthGyeongsang />,
        48: <MapSouthGyeongsan />,
        50: <MapJeju />
    };

    const RenderComponent = mapComponents[locationId] || null;
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
        <div>
            {RenderComponent ? (
                React.cloneElement(RenderComponent, { storyPhotoList: storyPhotoList, eventClick: handleClick, mapPaths: mapPathJson[locationId]})
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default MapLocation;