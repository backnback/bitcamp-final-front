import React, { useEffect, useState } from 'react';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import axiosInstance from '../components/AxiosInstance';
import Swal from 'sweetalert2';
import { AuthTitleProvider } from '../components/TitleProvider';
import styles from '../assets/styles/css/Auth.module.css';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const FindEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // 가입 여부 메시지를 저장할 상태 추가
  const [authCode, setAuthCode] = useState('');
  const [duplication, setDuplication] = useState('');

  const getUserEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "이메일을 입력해주세요",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setDuplication('해당 이메일은 이메일 형식이 아닙니다');
      return;
    } else {
      setDuplication("");
    }

    try {
      const response = await axiosInstance.post('/sign/emailverification', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "인증번호가 이메일로 발송되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "인증번호 발송에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("이메일 찾는중 오류 발생", error);
    }
  };

  const emailVerification = async (e) => {
    try {

      if (!authCode) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "인증번호를 입력해주세요.",
        });
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
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "인증코드가 알맞지 않습니다 다시입력해 주세요.",
          });
        }

      } catch (error) {
        console.error("인증번호 요청 중 오류 발생:", error);
      }
    } catch (error) {
      console.error("이메일 찾는중 오류 발생", error);
      setMessage("오류가 발생했습니다. 다시 시도해주세요.");
    }
  }

  useEffect(() => {
    document.body.className = 'body body__auth body__findemail';
  })

  return (
      <div id='findemail' className={styles.auth__container}>
        <section className={styles.auth__wrap}>
          <AuthTitleProvider title={`아이디 찾기`} />
          <InputProvider label={`이메일`} inputId={`email01`} required={true}>
            <div className={`${styles.auth__input__wrap}`}>
              <input
                  type="email"
                  className="form__input"
                  id="email01"
                  name="이메일"
                  value={email}
                  placeholder="이메일 입력"
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />

              <ButtonProvider width={`120`}>
                <button type="button" className="button button__primary" onClick={getUserEmail}>
                  <span className="button__text">인증번호 받기</span>
                </button>
              </ButtonProvider>
            </div>
            <span className={`${styles.auth__sub__notice} ${duplication.includes(" ") ? styles.error : styles.success}`}>{`${duplication}`}</span>
          </InputProvider>

          <InputProvider label={`인증번호`} inputId={`authNumber`} required={true}>
            <div className={`${styles.auth__input__wrap}`}>
              <input
                  type="text"
                  className="form__input"
                  id="authNumber"
                  name="인증번호"
                  value={authCode}
                  placeholder="인증번호 입력"
                  onChange={(e) => setAuthCode(e.target.value)}
                  required
              />
              <ButtonProvider width={`120`}>
                <button type="button" className="button button__primary" onClick={emailVerification}>
                  <span className="button__text">인증확인</span>
                </button>
              </ButtonProvider>
            </div>
          </InputProvider>

          {message && <div className={`${styles.auth__message} ${message.includes("가입되어있는 아이디") ? styles.success : styles.error}`}>{message}</div>} {/* 메시지를 화면에 표시 */}
        </section>
      </div>
  );
};

export default FindEmail;