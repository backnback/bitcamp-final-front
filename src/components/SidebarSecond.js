import React, {useEffect, useState} from "react";

import axiosInstance from "./AxiosInstance";

import styles from "../assets/styles/css/SecondSidebar.module.css"

const Sidebar = ({onHovered, provinceId, clickEvent}) => {
    const [cities, setCities] = useState(null);

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

    return (
        <div className={styles.container}>
            <ul className={styles.side__box}>
                {
                    cities && cities.map(city => (
                        <a key={city.id}
                           id={city.id.toString().slice(2)}
                           className={styles.side__a}
                           onClick={clickEvent}
                           onMouseOver={() => onHovered(city.id.toString().slice(2))}
                           onMouseLeave={() => onHovered(null)}
                        >
                            <li className={styles.side__text}>{city.secondName}</li>
                        </a>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar;