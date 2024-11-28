import { useEffect, useState } from 'react';
import { InputProvider } from "./InputProvider";
import axiosInstance from './AxiosInstance';
import styles from '../assets/styles/css/MyPage.module.css';
import Swal from 'sweetalert2';

const UserEdit = ({ password, setPassword, nickname, setNickname, profileImage, setProfileImage, accessToken }) => {
    const [filename, setFilename] = useState('');

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
        setProfileImage(e.target.files[0]);
    };

    const handleImageClick = () => {
        document.getElementById('file01').click(); // 파일 선택 input을 클릭
    };

    return (
        <div className={`${styles.userEdit__wrap}`}>
            <div className={`${styles.userEdit__profile__wrap}`}>
                <label htmlFor="userEditFile" className={`${styles.userEdit__profile__img__wrap} ${filename == '' ? styles.userEdit__profile__img__name__wrap : ``}`}>
                    {
                        filename != '' ?
                            <img
                                src={profileImage ? URL.createObjectURL(profileImage) : `https://kr.object.ncloudstorage.com/bitcamp-bucket-final/user/${filename}`}
                                // onClick={handleImageClick} // 이미지 클릭 시 파일 선택창 열리도록 처리
                                alt="프로필 사진"
                                className={`${styles.userEdit__profile__img}`}
                            />
                            :
                            <span className={`${styles.userEdit__profile__img__name} line1`}>{nickname != null ? nickname : "Guest"}</span>

                    }
                    <i className={`icon icon__profile__file ${styles.userEdit__profile__icon}`}></i>
                    <input type='file' className={`blind`} id="userEditFile" onChange={handleImageChange} />
                </label>
            </div>
            <div>
                <InputProvider label={`닉네임`} inputId={`nickname01`} required={true}>
                    <input
                        value={nickname}
                        id='nickname01'
                        className={`form__input`}
                        placeholder='닉네임을 입력해주세요.'
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </InputProvider>

                <InputProvider label={`비밀번호`} inputId={`pwd01`}>
                    <input
                        type="password"
                        className="form__input"
                        id="pwd01"
                        name="비밀번호"
                        value={password}
                        placeholder="비밀번호를 입력해주세요."
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputProvider>
            </div>
        </div>
    );
}

export default UserEdit;
