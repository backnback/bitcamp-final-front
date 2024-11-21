import React, {useEffect, useState} from "react";

import styles from '../assets/styles/css/MapSidebar.module.css'; // 스타일 파일 임포트

import axiosInstance from "./AxiosInstance";

const Sidebar = ({selectedRegion, onRegionClick, onHovered}) => {

    const [provinces, setProvinces] = useState(null);

    useEffect(() => {
        const mapProvince = async () => {
            try {
                const response = await axiosInstance.get('/location/province'); // API 요청
                setProvinces(response.data)
                // console.log(response.data)
            } catch (error) {
                console.error("There was an error", error);
            }
        };
        mapProvince()
    }, []);

    return (
        <div className={styles.container}>
            <ul className={styles.side__box}>
                {provinces && provinces.map(province => (
                    <a
                        key={province.id} href={""}
                        onMouseOver={() => onHovered(province.firstName)}
                        onMouseLeave={() => onHovered(null)}
                    >
                        <li className={styles.side__text}>{province.firstName}</li>
                    </a>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;