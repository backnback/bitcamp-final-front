import axiosInstance from './AxiosInstance';
import UserEdit from './UserEdit';
import { ButtonProvider } from './ButtonProvider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputProvider } from './InputProvider';


const ReauthenticateModal = () => {

    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
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
                alert("인증되었습니다");
                setCurrentUser(true);
                setPassword('');
            } else {
                alert("인증 실패: 비밀번호를 확인해주세요.");
            }
        } catch (error) {
            console.error("마이페이지 회원인증 요청 중 오류 발생:", error);
            alert("마이페이지 회원인증 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    const handleClickEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('nickname', nickname);
        formData.append('profileImage', profileImage);
        try {
            const response = await axiosInstance.post('/user/update', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            if (response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                setAccessToken(response.data.accessToken);
                alert("수정되었습니다.");
                window.location.reload(); // 헤더 정보 업데이트
            } else {
                alert("수정 실패...");
            }
        } catch (error) {
            console.error("회원정보 수정 중 오류 발생:", error);
            alert("회원정보 수정 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
        }
    };

    const deleteUser = async (e) => {
        e.preventDefault();
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            try {
                const response = await axiosInstance.delete('/user/delete', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (response.data) {
                    alert("계정을 삭제하였습니다");
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    if (localStorage.getItem('lastLoginEmail') != null && localStorage.getItem('lastLoginEmail') != undefined) {
                        localStorage.removeItem('lastLoginEmail');
                    }
                    navigate("/");
                    window.location.reload();
                } else {
                    alert("삭제 실패...");
                }
            } catch (error) {
                console.error("회원정보 삭제 중 오류 발생:", error);
                alert("회원정보 삭제 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            }
        } else {
            alert("삭제를 취소합니다");
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
                                setProfileImage={setProfileImage} accessToken={accessToken} />
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