import React, { useEffect, useState } from "react";

import axiosInstance from "./AxiosInstance";

import styles from "../assets/styles/css/MapSidebar.module.css"

const SidebarSecond = ({ onHovered, provinceId, clickEvent, mapHovered }) => {
    const [cities, setCities] = useState(null);
    const [oldHover, setOldHover] = useState(null);

    useEffect(() => {
        const mapProvince = async () => {
            try {
                const response = await axiosInstance.get(`/location/province/${provinceId}`); // API 요청
                setCities(response.data)
                // console.log(response.data)
            } catch (error) {
                console.error("There was an error", error);
            }
        };
        mapProvince()
    }, []);

    useEffect(() => {
        // 새로운 hovered 요소에 filter 추가
        const leaveElement = document.getElementById(`${oldHover}`);

        setOldHover(null);
        if (leaveElement) {
            leaveElement.removeAttribute('style');
        }

        if (mapHovered !== null) {
            const gElement = document.getElementById(`${mapHovered}`);
            setOldHover(mapHovered);
            if (gElement) {
                // gElement.setAttribute('border-opacity', '0%');
                gElement.setAttribute("style", "background-color: rgba(176, 236, 248, 0.5);");
            }
        }
    }, [mapHovered]);

    return (
        <div className={styles.secondside__wrap}>
            <ul className={styles.secondside__list}>
                {
                    cities && cities.map(city => (
                        <li key={city.id} className={styles.secondside__item}>
                            <a
                                href=""
                                id={city.id.toString().slice(2)}
                                className={styles.secondside__link}
                                onClick={(e) => {
                                    e.preventDefault();
                                    clickEvent(e)
                                }}
                                onMouseOver={() => onHovered(city.id.toString().slice(2))}
                                onMouseLeave={() => onHovered(null)}
                            >
                                <span className={`${styles.secondside__link__text}`}>{city.secondName}</span>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default SidebarSecond;