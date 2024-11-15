import React from 'react';
import styles from "../assets/styles/css/Profile.module.css";
import useModals from '../useModals';
import { modals } from '../components/Modals';
import { ButtonProvider } from '../components/ButtonProvider';

const Profile = ({ loginUser }) => {

  const { openModal } = useModals();

  const handleClick = () => {
    openModal(modals.reauthenticateModal, {
      onSubmit: () => {
        console.log('비지니스 로직 처리...2');
      },
    });
  };

  return (
    <div className={styles.box}>
      <div className={`${styles.img__wrap} ${loginUser || styles.img__wrap__default}`}>
        {
          loginUser != null ?
            <img src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${loginUser.path}`} alt='내 프로필 사진' className={`${styles.img}`} /> :
            <span className={`${styles.img__default} line1`}>{loginUser ? loginUser.nickname : "Guest"}</span>
        }
      </div>
      <div className={styles.info}>
        <p className={`${styles.name} ${styles.info__text}`}>닉네임 : {loginUser.nickname}</p>
        <p className={`${styles.email} ${styles.info__text}`}>이메일 : {loginUser.email}</p>
      </div>

      <div className={`${styles.button__item}`}>
        <ButtonProvider width={'icon'}>
          <button type="button" onClick={handleClick} className={`button button__icon`}>
            <i data-button="icon" className={`icon icon__edit__black`}></i>
            <span className='blind'>내 프로필 수정</span>
          </button>
        </ButtonProvider>
      </div>
    </div>
  );
};

export default Profile;