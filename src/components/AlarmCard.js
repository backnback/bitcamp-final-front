import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../assets/styles/css/AlarmCard.module.css";
import Bin from "../components/Bin";
import { ButtonProvider } from "./ButtonProvider";

const AlarmCard = ({ userImg, userName, content, toggleBin }) => {
    const [liked, setLiked] = useState(false);

    return (
        <div className={styles.card}>
            <div className={`${styles.img__wrap} ${userImg || styles.img__wrap__default}`}>
                {
                    userImg != null ?
                        <img src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${userImg}`} alt='내 프로필 사진' className={`${styles.img}`} /> :
                        <span className={`${styles.img__default} line1`}>{userImg ? userName : "Guest"}</span>
                }
            </div>
            <div className={styles.info__wrap}>
                <span className={styles.name}>{userName}</span>
                <p className={`${styles.text}`}>{content}</p>
            </div>
            <ButtonProvider width={'icon'}>
                <button type="button" className={`button button__icon ${styles.button__icon__bin}`} onClick={toggleBin}>
                    <i data-button="icon" className={`icon icon__trash__gray`}></i>
                    <span className={`blind`}>닫기</span>
                </button>
            </ButtonProvider>
            {/* <Bin onClick={toggleBin} /> */}
        </div>
    );
};

export default AlarmCard;
