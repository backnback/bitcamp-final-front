import React, { useEffect, useState } from "react";

import styles from '../assets/styles/css/MapSidebar.module.css'; // 스타일 파일 임포트

import axiosInstance from "./AxiosInstance";
import { Link } from "react-router-dom";

const Sidebar = ({ onHovered, provinceId }) => {

    const [provinces, setProvinces] = useState(null);

    useEffect(() => {
        const mapProvince = async () => {
            try {
                const response = await axiosInstance.get('/location/province'); // API 요청

                const update = response.data.map(
                    province => {
                        if (province.firstName.length === 3) {
                            return { ...province, firstName: province.firstName.substring(0, 2) }
                        } else if (province.firstName.length === 4) {
                            return { ...province, firstName: `${province.firstName.charAt(0)}${province.firstName.charAt(2)}` }
                        } else {
                            return { ...province }
                        }
                    })
                // console.log(update)
                setProvinces(update)
            } catch (error) {
                console.error("There was an error", error);
            }
        };
        mapProvince()
    }, []);

    useEffect(() => {

    }, [provinces]);

    return (
        <div className={styles.side__wrap}>
            <ul className={styles.side__list}>
                {
                    provinces && provinces.map(province => (
                        provinceId ?
                            (
                                <li key={province.id} className={styles.side__item}>
                                    <Link
                                        className={province.id.toString() === provinceId ? styles.select : styles.side__link}
                                        to={`/map/story/${province.id}`}>
                                        {province.firstName}
                                    </Link>
                                </li>
                            )
                            :
                            (
                                <li key={province.id} className={styles.side__item}>
                                    <Link
                                        to={`/map/story/${province.id}`}
                                        className={styles.side__link}
                                        onMouseOver={() => onHovered(province.firstName)}
                                        onMouseLeave={() => onHovered(null)}
                                    >
                                        {province.firstName}
                                    </Link>
                                </li>
                            )
                    ))}
            </ul>
        </div>
    )
}

export default Sidebar;