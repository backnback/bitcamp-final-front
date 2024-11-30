import useModals from '../useModals';
import { modals } from '../components/Modals';
import { ButtonProvider } from '../components/ButtonProvider';
import ReauthenticateModal from './ReauthenticateModal';
import { createContext, useContext } from "react";
import styles from "../assets/styles/css/Profile.module.css";

const smallProfile = createContext();

export const useSContext = () => useContext(smallProfile);

export const SmallProfileProvider = ({ value, profileImg, profileName }) => {
  return (
    <div className={styles.small__wrap} value={value}>
      <div className={styles.small__link}>
        <span className={`${styles.small__img__wrap}`}>
          <img src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${profileImg}`}
            alt={`${profileName}의 프로필 이미지`} className={`${styles.small__img} line1`} />

        </span>
        <span className={`${styles.small__name} line1`}>{profileName}</span>
      </div>
    </div>
  );
}

const Profile = ({ loginUser }) => {

  const { openModal } = useModals();

  // 내 프로필 수정 모달
  const handleClick = () => {
    const content = <ReauthenticateModal />;
    openModal(modals.modalSidebarRight, {
      modalId: 'reauth',
      onSubmit: () => {
        console.log('프로필 로직 처리..');
      },
      content
    });
  };

  return (
    <div className={styles.box}>
      <div className={`${styles.img__wrap}`}>
        <img src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${loginUser.path}`} alt='내 프로필 사진' className={`${styles.img}`} />
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