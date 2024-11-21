import React, { useState } from 'react';
import styles from '../assets/styles/css/FindEmail.module.css';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import axiosInstance from '../components/AxiosInstance';


const FindEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // 가입 여부 메시지를 저장할 상태 추가
    const [authCode, setAuthCode] = useState('');

    const getUserEmail = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("이메일을 입력해주세요");
            return;
        }
        try {
            const response = await axiosInstance.post('/sign/emailverification', { email }, {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            });
            if (response.data) {
              alert("인증번호가 이메일로 발송되었습니다.");
            } else {
              alert("인증번호 발송에 실패했습니다.");
            }
          } catch (error) {
            console.error("이메일 찾는중 오류 발생", error);
          }
    };

    const emailVerification = async (e) => {
        try {

            if (!authCode) {
                alert("인증번호를 입력해주세요");
                return;
              }
          
              try {
                const response = await axiosInstance.post('/sign/verificationcode', { authCode }, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true, // 쿠키 사용 시 설정
                });
                if (response.data) {
                  alert("정상적으로 처리 되었습니다");

                  const response = await axiosInstance.post('/sign/findemail', { email }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                if (response.data) {
                    setMessage("해당 아이디는 가입되어있는 아이디 입니다");
                } else {
                    setMessage("해당 아이디는 가입되어있지 않은 아이디 입니다");
                }
                 
                } else {
                  alert("인증코드가 알맞지 않습니다 다시입력해 주세요");
                }
          
              } catch (error) {
                console.error("인증번호 요청 중 오류 발생:", error);
              }
        } catch (error) {
            console.error("이메일 찾는중 오류 발생", error);
            setMessage("오류가 발생했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div>
                    <h2>아이디 찾기</h2>
                    <div>
                        <InputProvider>
                            <input
                                type="email"
                                className="form__input"
                                id="email01"
                                name="이메일"
                                placeholder="이메일 입력"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // 이메일 상태 업데이트
                                required
                            />
                        </InputProvider>
                        <ButtonProvider>
                            <button type="button" className="button button__primary" onClick={getUserEmail}>
                                <span className="button__text">인증번호 받기</span>
                            </button>
                        </ButtonProvider>
                        <InputProvider>
                            <input
                            type="text"
                            placeholder="인증번호"
                            value={authCode}
                            className="form__input"
                            onChange={(e) => setAuthCode(e.target.value)}
                            required
                            />
                        </InputProvider>
                        <ButtonProvider>
                            <button type="button" className="button button__primary" onClick={emailVerification}>
                                <span className="button__text">확인</span>
                            </button>
                        </ButtonProvider>
                    </div>
                    {message && <div className={styles.message}>{message}</div>} {/* 메시지를 화면에 표시 */}
                </div>
            </div>
        </div>
    );
};

export default FindEmail;
