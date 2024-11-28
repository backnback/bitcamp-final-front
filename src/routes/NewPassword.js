import React, { useEffect, useState } from 'react';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/AxiosInstance';
import Swal from 'sweetalert2';
import { AuthTitleProvider } from '../components/TitleProvider';
import styles from '../assets/styles/css/Auth.module.css';


const NewPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const email = sessionStorage.getItem("email");

    const updatePassword = async (e) => {
        e.preventDefault();

        if (password !== checkPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "비밀번호가 같지 않습니다.",
            });
            return;
        }

        try {
            const response = await axiosInstance.post('/sign/newpassword', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response.data) {
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "성공적으로 변경되었습니다.",
                    showConfirmButton: false,
                    timer: 1500
                });
                sessionStorage.removeItem("email");
                navigate('/');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "비밀번호 변경에 실패했습니다.",
                });
            }
        } catch (error) {
            console.error("비밀번호 변경 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        document.body.className = 'body body__auth body__newpassword';
    })

    return (
        <div id='newPassword' className={styles.auth__container}>
            <section className={styles.auth__wrap}>
                <AuthTitleProvider title={`새 비밀번호 입력`} />
                <InputProvider label={`새 비밀번호`} inputId={`newPassword`} required={true}>
                    <input
                        type="password"
                        className="form__input"
                        id="newPassword"
                        name="newPassword"
                        value={password}
                        placeholder="새 비밀번호 입력"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </InputProvider>
                <InputProvider label={`비밀번호`} inputId={`confirmPassword`} required={true}>
                    <input
                        type="password"
                        className="form__input"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={checkPassword}
                        placeholder="비밀번호 입력"
                        onChange={(e) => setCheckPassword(e.target.value)}
                        required
                    />
                </InputProvider>

                <div className={`${styles.auth__item__center}`}>
                    <ButtonProvider>
                        <button type="submit" className="button button__primary" onClick={updatePassword}>
                            <span className="button__text">완료</span>
                        </button>
                    </ButtonProvider>
                </div>
            </section>
        </div>
    );
};

export default NewPassword;
