import ReactModal from 'react-modal';
import axios from 'axios';
import UserEdit from './UserEdit';
import Reauthenticate from './Reauthenticate';
import { ButtonProvider } from './ButtonProvider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ReauthenticateModal = ({ onSubmit, onClose, shouldCloseOnOverlayClick = true }) => {

    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate();


    const handleClickSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/user/userauthentication', {
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
            const response = await axios.post('http://localhost:8080/user/update', formData, {
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
                const response = await axios.delete('http://localhost:8080/user/delete', {
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


    const handleClickCancel = () => {
        onClose();
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
        <ReactModal
            isOpen
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
            className="modal modal-right"
            overlayClassName="modal-overlay">

            <div className='modal__hedader'>

                <ButtonProvider width={'icon'}>
                    <button type="button" className={`button button__icon`} onClick={handleClickCancel}>
                        <i data-button="icon" className={`icon icon__arrow__right__black`}></i>
                        <span className={`blind`}>닫기</span>
                    </button>
                </ButtonProvider>
            </div>
            {currentUser ?
                <>
                    <div className='modal__body'>
                        <UserEdit password={password} setPassword={setPassword}
                            nickname={nickname} setNickname={setNickname}
                            profileImage={profileImage}
                            setProfileImage={setProfileImage} accessToken={accessToken} />
                    </div>

                    <div className='modal__footer'>
                        <ButtonProvider>
                            <button type="button" className={`button button__primary`} onClick={handleClickEditSubmit}>
                                <span className={`button__text`}>수정하기</span>
                            </button>
                        </ButtonProvider>
                        <ButtonProvider>
                            <button type="button" className={`button button__whiteRed`} onClick={deleteUser}>
                                <span className={`button__text`}>탈퇴하기</span>
                            </button>
                        </ButtonProvider>
                    </div>
                </>
                :
                <>
                    <div className='modal__body'>
                        <Reauthenticate password={password} setPassword={setPassword} />
                    </div>

                    <div className='modal__footer'>
                        <ButtonProvider>
                            <button type="button" className={`button button__primary`} onClick={handleClickSubmit}>
                                <span className={`button__text`}>확인</span>
                            </button>
                        </ButtonProvider>
                    </div>
                </>
            }

        </ReactModal>
    );
};

export default ReauthenticateModal;