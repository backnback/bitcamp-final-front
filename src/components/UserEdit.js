import { useEffect, useState } from 'react';
import { InputProvider } from "./InputProvider";
import axiosInstance from './AxiosInstance';
import styles from '../assets/styles/css/MyPage.module.css';
import Swal from 'sweetalert2';
import { ButtonProvider } from './ButtonProvider';

const UserEdit = ({ password, setPassword, nickname, setNickname, profileImage, setProfileImage, accessToken, filename, setFilename }) => {

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await axiosInstance.post('/user/viewuser', {}, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.data) {
                    setNickname(response.data.nickname);

                    // 파일이 있을 경우에만 설정
                    if (response.data.file) {
                        setFilename(response.data.filename);
                        setProfileImage(null);
                    } else if (response.data.filename === 'default.png') {
                        setFilename(response.data.filename);
                        setProfileImage(null);
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "해당 정보를 가져오지 못했습니다.",
                    });
                }
            } catch (error) {
                console.error("회원 정보를 가져오던 중 오류 발생:", error);
            }
        };

        if (accessToken) {
            authenticateUser();
        }
    }, [accessToken, setNickname, setProfileImage]);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
            setFilename(null);
            e.target.value = ''; // 파일 입력 초기화
        }
    };

    const handleDeleteProfile = () => {
        setFilename('default.png');
        setProfileImage(null);
        document.getElementById('userEditFile').value = ''; // 파일 입력 초기화
    };

    useEffect(() => {
        if (profileImage) {
            const objectUrl = URL.createObjectURL(profileImage);

            return () => {
                URL.revokeObjectURL(objectUrl); // 기존 URL 해제
            };
        }
    }, [profileImage]);

    const handleImageClick = () => {
        document.getElementById('userEditFile').click(); // 파일 선택 input을 클릭
    };

    return (
        <div className={`${styles.userEdit__wrap}`}>
            <div className={`${styles.userEdit__profile__wrap}`}>
                <label htmlFor="userEditFile" className={`${styles.userEdit__profile__img__wrap}`}>
                    <img
                        src={profileImage ? URL.createObjectURL(profileImage) : `https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${filename}`}
                        alt="프로필 사진"
                        className={`${styles.userEdit__profile__img}`}
                    />
                    <i className={`icon icon__profile__file ${styles.userEdit__profile__icon}`}></i>
                    <input type="file" className="blind" id="userEditFile" onChange={handleImageChange} />
                </label>
                <ButtonProvider width={'icon'} className={`button__item__x ${styles.profile__delete__button}`}>
                    <button type="button" className="button button__icon button__icon__x" onClick={handleDeleteProfile}>
                        <span className="blind">삭제</span>
                        <i className="icon icon__x__black"></i>
                    </button>
                </ButtonProvider>
            </div>
            <div>
                <InputProvider label={`닉네임`} inputId={`nickname01`} required={true}>
                    <input
                        value={nickname}
                        id="nickname01"
                        className="form__input"
                        placeholder="닉네임을 입력"
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    {nickname.length >= 15 && <span className={`sub__notice sub__notice__danger`}>{`닉네임을 15자 이하로 입력해주세요.`}</span>}
                </InputProvider>

                <InputProvider label={`비밀번호`} inputId={`pwd01`}>
                    <input
                        type="password"
                        className="form__input"
                        id="pwd01"
                        name="비밀번호"
                        value={password}
                        placeholder="비밀번호를 입력"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputProvider>
            </div>
        </div>
    );
};

export default UserEdit;
