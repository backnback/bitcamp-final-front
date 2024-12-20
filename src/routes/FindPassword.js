import React, { useState, useEffect } from 'react';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/AxiosInstance';
import Swal from 'sweetalert2';
import { AuthTitleProvider } from '../components/TitleProvider';
import styles from '../assets/styles/css/Auth.module.css';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


const FindPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState(''); // 가입 여부 메시지를 저장할 상태 추가
  const [duplication, setDuplication] = useState('');

  const getUserAuthCode = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "이메일을 입력해주세요.",
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
      const response = await axiosInstance.post('/sign/passwordEmailverification', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (response.data === "성공") {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "인증번호가 이메일로 발송되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (response.data === "가입되지않은이메일"){
        Swal.fire({
          toast: true,
          icon: "error",
          title: "가입되지 않은 이메일입니다.",
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

  const setUserAuthCode = async (e) => {
    e.preventDefault();

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
        Swal.fire({
          position: "top",
          icon: "success",
          title: "정상적으로 처리 되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
        sessionStorage.setItem("email", email);
        navigate('/newPassword');
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
  };

  useEffect(() => {
    document.body.className = 'body body__auth body__findpassword';
  })

  return (
    <div id='findpassword' className={styles.auth__container}>
      <section className={styles.auth__wrap}>
        <AuthTitleProvider title={`비밀번호 찾기`} />
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
              <button type="button" className="button button__primary" onClick={getUserAuthCode}>
                <span className="button__text">인증번호 받기</span>
              </button>
            </ButtonProvider>
          </div>
          { <span className={`${styles.auth__sub__notice} ${duplication.includes(" ") ? styles.error : styles.success}`}>{`${duplication}`}</span> }
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
              <button type="button" className="button button__primary" onClick={setUserAuthCode}>
                <span className="button__text">인증확인</span>
              </button>
            </ButtonProvider>
          </div>
        </InputProvider>
      </section >
    </div >
  );
};

export default FindPassword;
