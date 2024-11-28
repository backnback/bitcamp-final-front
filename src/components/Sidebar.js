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
                console.log(update)
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
                        <li key={province.id} className={styles.side__item}>
                            <a
                                href={`/map/story/${province.id}`}
                                className={`${styles.side__link} ${province.id.toString() === provinceId ? styles.select : ``}`}
                                onMouseOver={
                                    () => {
                                        if (!provinceId) {
                                            onHovered(province.firstName)
                                        }
                                    }}
                                onMouseLeave={() => {
                                    if (!provinceId) {
                                        onHovered(null)
                                    }
                                }}
                            >
                                <span className={`${styles.side__link__text}`}>{province.firstName}</span>
                            </a>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default Sidebar;