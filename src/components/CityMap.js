import React, { useEffect, useState } from "react";
import LocationActiveSvg from "./LocationActiveSvg";
import LocationMapSvg from "./LocationMapSvg";
import mapStyles from "../assets/styles/css/Map.module.css";

const CityMap = ({ storyPhotoList, eventClick, mapPaths, hovered }) => {

    const [oldHovered, setOldHovered] = useState();

    useEffect(() => {
        // 새로운 hovered 요소에 filter 추가
        const leaveElement = document.getElementById(`p${oldHovered}`);

        setOldHovered(null);
        if (leaveElement) {
            leaveElement.removeAttribute('stroke');
        }

        if (hovered !== null) {
            const gElement = document.getElementById(`p${hovered}`);
            setOldHovered(hovered);
            if (gElement) {
                gElement.setAttribute('stroke', 'red');
                // gElement.setAttribute('fill', 'red');
            }
        }
    }, [hovered]);

    return (
        <div className={`${mapStyles.city__wrap}`}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width={mapPaths.width} viewBox={mapPaths.viewBox}
                strokeLinecap="round" strokeLinejoin="round" id={mapPaths.id} className={`${mapStyles.city__list}`}>
                <g id={mapPaths.id + "경계"} stroke="white" strokeWidth="5">
                    {
                        storyPhotoList && storyPhotoList.length > 0 ? (
                            storyPhotoList.map((item) => {
                                const key = item.id.toString().slice(-3); // 유일한 key 생성
                                const path = mapPaths.location[key].d; // mapPaths에서 해당 key의 path 가져오기

                                if (item.mainPhotoPath !== null) {
                                    return (
                                        <LocationActiveSvg
                                            key={`active-${key}`}
                                            gId={key}
                                            gClassName={key}
                                            eventClick={eventClick}
                                            clipPathId={"clip" + key}
                                            pathId={key}
                                            pathD={path}
                                            imgHref={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${item.mainPhotoPath}`}
                                            imgId={key}
                                        />
                                    );
                                } else {
                                    return (
                                        <LocationMapSvg
                                            key={`map-${key}`}
                                            gId={key}
                                            gClassName={key}
                                            pathD={path}
                                            eventClick={eventClick}
                                        />
                                    );
                                }
                            })
                        ) : null
                    }
                </g>
            </svg>
        </div>
    );
}

export default CityMap;