import { useState, useEffect } from 'react';
import axiosInstance from '../components/AxiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { InputProvider } from "../components/InputProvider";
import { ButtonProvider } from "../components/ButtonProvider";
import styles from "../assets/styles/css/Login.module.css";
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberEmail, setRememberEmail] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/sign/in', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.data) {
                const { accessToken, refreshToken } = response.data;

                // 토큰을 로컬 스토리지에 저장
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                // 토큰 디코딩하여 유저 정보 추출
                const userInfo = jwtDecode(accessToken);
                if (rememberEmail) {
                    localStorage.setItem('lastLoginEmail', email);
                } else {
                    localStorage.removeItem('lastLoginEmail'); // 체크 해제 시 이메일 삭제
                }

                if (userInfo.auth === "ROLE_USER") {
                    navigate('/map');
                } else {
                    navigate('/admin');
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.",
            });
        }
    };

    const handleGoogleLogin = () => {
        // Google OAuth 로그인 엔드포인트로 리디렉트
        window.location.href = 'http://go.remapber.p-e.kr/oauth2/authorization/google';
    };

    useEffect(() => {
        document.body.className = 'body body__login body__auth';

        // 로컬 스토리지에서 이메일 가져오기 (저장된 경우에만)
        const savedEmail = localStorage.getItem('lastLoginEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberEmail(true); // 저장된 이메일이 있으면 체크박스도 활성화
        }
    }, []);

    return (
        <div id='login' className={styles.container}>
            <div className={styles.form__wrap}>
                <div className={styles.title__wrap}>
                    <div className={styles.title}>
                        <div className={styles.title__left}><span className={`${styles.title__left__text}`}>기억하</span></div>
                        <div className={`${styles.title__right}`}><span>길</span></div>
                    </div>
                    <div className={styles.title__sub}>
                        <p className={styles.title__sub__text}>♥♡♥♡♥지금 이 순간을 기록해보세요♥♡♥♡♥</p>
                    </div>
                </div>

                <div className={styles.login__form__wrap}>
                    <form onSubmit={handleLogin} className={styles.login__form}>
                        <div className={styles.login__input__box}>
                            <InputProvider>
                                <label htmlFor='email' className='blind'>이메일</label>
                                <input
                                    type='email'
                                    className={`form__input`}
                                    id='email'
                                    name='이메일'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    defaultValue={email}
                                    placeholder='이메일 입력' />
                            </InputProvider>
                            <InputProvider>
                                <label htmlFor='password' className='blind'>비밀번호</label>
                                <input
                                    type='password'
                                    className={`form__input`}
                                    id='password'
                                    name='패스워드'
                                    placeholder='비밀번호 입력'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </InputProvider>
                        </div>
                        <div className={`${styles.login__button__wrap}`}>
                            <ButtonProvider className={`${styles.login__button}`}>
                                <button type="submit" className={`button button__black`}>
                                    <span className={`button__text`}>로그인</span>
                                </button>
                            </ButtonProvider>
                            <ButtonProvider className={`${styles.login__button} ${styles.login__button__google}`}>
                                <button type="button" onClick={handleGoogleLogin}>
                                    <span className='blind'>구글 로그인</span>
                                    <i className='icon icon-google'></i>
                                </button>
                            </ButtonProvider>
                        </div>
                        <div className={styles.user__account}>
                            <Link to="/find-email" className={styles.user__account__link}>아이디 찾기</Link><Link to="/find-password" className={styles.user__account__link}>비밀번호 찾기</Link><Link to="/signup" className={styles.user__account__link}>회원가입</Link>
                        </div>

                        <InputProvider>
                            <label htmlFor="save-id" className={`form__label form__label__checkbox`}>
                                <input
                                    type='checkbox'
                                    className={`form__input`}
                                    id='save-id'
                                    name='자동로그인'
                                    checked={rememberEmail}
                                    onChange={() => setRememberEmail(!rememberEmail)}
                                />
                                <span className={`input__text`}>자동로그인</span>
                            </label>
                        </InputProvider>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
