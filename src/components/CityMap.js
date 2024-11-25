import React, {useEffect} from "react";
import LocationActiveSvg from "./LocationActiveSvg";
import LocationMapSvg from "./LocationMapSvg";

const CityMap = ({storyPhotoList, eventClick, mapPaths}) => {

    useEffect(() => {
        console.log(mapPaths)
    }, []);

    return (
        <div className={`city__wrap`}>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="800" viewBox="0 0 800 667"
                 strokeLinecap="round" strokeLinejoin="round" id="서울특별시_시군구" className={`city__list`}>
                <g id="서울특별시_시군구_경계">
                    {
                        storyPhotoList && storyPhotoList.length > 0 ? (
                            storyPhotoList.map((item) => {
                                const key = item.id.toString().slice(-3); // 유일한 key 생성
                                console.log(key)
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