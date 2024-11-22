import React, {useEffect, useState} from "react";

import axiosInstance from "./AxiosInstance";

import styles from "../assets/styles/css/SecondSidebar.module.css"

const Sidebar = ({onHovered, provinceId}) => {
    const [cities, setCities] = useState(null);

    useEffect(() => {
        const mapProvince = async () => {
            try {
                const response = await axiosInstance.get(`/location/province/${provinceId}`); // API 요청
                setCities(response.data)
                console.log(response.data)
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
                    cities && cities.map(city => (
                        <a key={city.id}>
                            <li>{city.secondName}</li>
                        </a>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar;