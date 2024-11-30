import axiosInstance from './AxiosInstance';
import UserEdit from './UserEdit';
import { ButtonProvider } from './ButtonProvider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputProvider } from './InputProvider';
import Swal from 'sweetalert2';


const ReauthenticateModal = () => {

    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [filename, setFilename] = useState('');
    const navigate = useNavigate();


    const handleClickSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/user/userauthentication', {
                password: password
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.data) {            // 성공 응답일 때만 처리
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "인증되었습니다!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setCurrentUser(true);
                setPassword('');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "비밀번호를 확인해주세요",
                });
            }
        } catch (error) {
            console.error("마이페이지 회원인증 요청 중 오류 발생:", error);
            // console.log("마이페이지 회원인증 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    const handleClickEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('nickname', nickname);
        formData.append('profileImage', profileImage);
        formData.append('filename', filename)
        try {
            const response = await axiosInstance.post('/user/update', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                setAccessToken(response.data.accessToken);
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "수정되었습니다!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.reload(); // 헤더 정보 업데이트
                }, 1500);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "오류가 발생하였습니다...수정 실패..",
                });
            }
        } catch (error) {
            console.error("회원정보 수정 중 오류 발생:", error);
        }
    };

    const deleteUser = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            text: "탈퇴하시겠습니까?",
            icon: "warning", // 경고 아이콘
            showCancelButton: true, // 취소 버튼 표시
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosInstance.delete('/user/delete', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (response.data) {
                    Swal.fire({
                        position: "top",
                        icon: "success",
                        title: "계정을 성공적으로 삭제하였습니다. 안녕히가세요",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    if (localStorage.getItem('lastLoginEmail') != null && localStorage.getItem('lastLoginEmail') != undefined) {
                        localStorage.removeItem('lastLoginEmail');
                    }
                    navigate("/");
                    window.location.reload();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "오류가 발생하였습니다...탈퇴 실패..",
                    });
                }
            } catch (error) {
                console.error("회원정보 삭제 중 오류 발생:", error);
            }
        } else {
            Swal.fire({
                text: "삭제를 취소합니다",
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 2000, // 3초 후 자동 닫힘
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }
    }, []);

    return (
        <>
            {currentUser ?
                <>
                    <div className='modal__body'>
                        <form id='form-userEdit'>
                            <UserEdit password={password} setPassword={setPassword}
                                nickname={nickname} setNickname={setNickname}
                                profileImage={profileImage}
                                setProfileImage={setProfileImage} accessToken={accessToken}
                                filename={filename} setFilename={setFilename}
                            />
                        </form>
                    </div>

                    <div className='modal__footer'>
                        <ButtonProvider width={'130'}>
                            <button type="button" className={`button button__primary`} form='#form-userEdit' onClick={handleClickEditSubmit}>
                                <span className={`button__text`}>수정하기</span>
                            </button>
                        </ButtonProvider>
                        <ButtonProvider width={'130'}>
                            <button type="button" className={`button button__whiteRed`} form='#form-userEdit' onClick={deleteUser}>
                                <span className={`button__text`}>탈퇴하기</span>
                            </button>
                        </ButtonProvider>
                    </div>
                </>
                :
                <>
                    <div className='modal__body'>
                        <form id='form-userPassword' onSubmit={handleClickSubmit}>
                            <InputProvider label={'비밀번호'} inputId={'pwd01'}>
                                <input
                                    type="password"
                                    className="form__input"
                                    id="pwd01"
                                    name="비밀번호"
                                    value={password}
                                    placeholder="비밀번호를 입력해주세요."
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </InputProvider>
                            {/* <Reauthenticate password={password} setPassword={setPassword} /> */}
                        </form>
                    </div>

                    <div className='modal__footer'>
                        <ButtonProvider>
                            <button type="button" className={`button button__primary`} form='#form-userPassword' onClick={handleClickSubmit}>
                                <span className={`button__text`}>확인</span>
                            </button>
                        </ButtonProvider>
                    </div>
                </>
            }
        </>
    );
};

export default ReauthenticateModal;