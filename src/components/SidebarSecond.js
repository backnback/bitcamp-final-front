import React, {useEffect, useState} from "react";

import styles from '../assets/styles/css/MapSidebar.module.css'; // 스타일 파일 임포트

import axiosInstance from "./AxiosInstance";

const Sidebar = ({onHovered}) => {

    const [provinces, setProvinces] = useState(null);

    useEffect(() => {
        const mapProvince = async () => {
            try {
                const response = await axiosInstance.get('/location/province'); // API 요청
                setProvinces(response.data)
            } catch (error) {
                console.error("There was an error", error);
            }
        };
        mapProvince()
    }, []);

    return (
        <div className={styles.container}>
            <ul className={styles.side__box}>
                {
                    provinces && provinces.map(province => (
                        province.id && provinceId === province.id ?
                            (
                                <a id="select">
                                    <li className={styles.side__text}>{province.firstName}</li>
                                </a>
                            )
                            :
                            (
                                <a
                                    key={province.id} href={`/map/story/${province.id}`}
                                    onMouseOver={() => onHovered(province.firstName)}
                                    onMouseLeave={() => onHovered(null)}
                                >
                                    <li className={styles.side__text}>{province.firstName}</li>
                                </a>
                            )
                    ))}
            </ul>
        </div>
    )
}

export default Sidebar;