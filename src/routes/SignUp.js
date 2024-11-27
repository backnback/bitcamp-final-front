import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/AxiosInstance';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import FormFileIcon from '../components/FormFileIcon';
import styles from '../assets/styles/css/SignUp.module.css';
import Swal from 'sweetalert2';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [agree, setAgree] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [duplication, setDuplication] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isOAuthSignUp, setIsOAuthSignUp] = useState(false);

  // URL로 전달된 파라미터 값을 읽어 초기값으로 설정
  useEffect(() => {
    document.body.className = 'body body__auth body__login__signup';

    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const nameParam = params.get('name');
    const pictureParam = params.get('picture');

    if (emailParam) {
      setEmail(emailParam);
      setIsVerified(true); // OAuth 회원가입 시 이메일 인증 불필요
      setIsOAuthSignUp(true); // OAuth 회원가입 플래그 설정
    }

    if (nameParam) {
      setNickname(nameParam);
    }

    if (pictureParam) {
      setProfileImage(pictureParam); // 프로필 이미지 URL 저장
    }
  }, []);

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '인증이 완료되지 않은 이메일입니다.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);

    if (profileImage && typeof profileImage !== 'string') {
      formData.append('profileImage', profileImage); // 업로드한 파일일 경우만 추가
    }

    try {
      const response = await axiosInstance.post('/sign/up', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/login');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '회원가입 중 오류 발생',
        text: error.message,
      });
    }
  };

  const getUserAuthCode = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '이메일을 입력해주세요.',
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/sign/findemail', { email }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (!response.data) {
        setDuplication('사용 가능한 이메일입니다');

        try {
          const authResponse = await axiosInstance.post('/sign/emailverification', { email }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          });

          if (authResponse.data) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: '인증번호가 이메일로 발송되었습니다.',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: '인증번호 발송에 실패했습니다.',
            });
          }
        } catch (authError) {
          Swal.fire({
            icon: 'error',
            title: '인증번호 요청 중 오류 발생',
            text: authError.message,
          });
        }
      } else {
        setDuplication('중복된 이메일입니다');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '이메일 중복 확인 중 오류 발생',
        text: error.message,
      });
    }
  };

  const setUserAuthCode = async (e) => {
    e.preventDefault();

    if (!authCode) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '인증번호를 입력해주세요.',
      });
      return;
    }

    try {
      const response = await axiosInstance.post('/sign/verificationcode', { authCode }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.data) {
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: '인증이 완료되었습니다.',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsVerified(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '인증코드가 올바르지 않습니다. 다시 입력해주세요.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '인증번호 확인 중 오류 발생',
        text: error.message,
      });
    }
  };

  return (
    <div id='signup' className={styles.signupContainer}>
      <section className={styles.signupBox}>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>이메일 <span className={styles.required}>*</span></label>
            <span className={duplication.includes("사용가능한 이메일") ? styles.success : styles.error}>
              {`${duplication}`}
            </span>
            <div className={styles.inputWrapper}>
              <InputProvider>
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
              </InputProvider>
              {!isOAuthSignUp && (
                <ButtonProvider>
                  <button type="button" className="button button__primary" onClick={getUserAuthCode}>
                    <span className="button__text">인증번호 받기</span>
                  </button>
                </ButtonProvider>
              )}
            </div>
          </div>
          {!isOAuthSignUp && (
            <div className={styles.inputGroup}>
              <label>인증번호 <span className={styles.required}>*</span></label>
              <div className={styles.inputWrapper}>
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
                  <button type="button" className="button button__primary" onClick={setUserAuthCode}>
                    <span className="button__text">인증확인</span>
                  </button>
                </ButtonProvider>
              </div>
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>비밀번호 <span className={styles.required}>*</span></label>
            <InputProvider>
              <input
                type="password"
                className="form__input"
                id="pwd01"
                name="비밀번호"
                value={password}
                placeholder="비밀번호"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputProvider>
          </div>
          <div className={styles.inputGroup}>
            <label>닉네임 <span className={styles.required}>*</span></label>
            <InputProvider>
              <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                className="form__input"
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </InputProvider>
          </div>
          <div className={styles.inputGroup}>
            <label>프로필 사진</label>
            {profileImage && <span>{"(" + profileImage.name + ")"}</span>}
            <div className={styles.inputWrapper}>
              <InputProvider>
                <label htmlFor="file01" className="form__label form__label__file">
                  <input type="file" className="blind" id="file01" onChange={handleFileChange} />
                  <FormFileIcon />
                </label>
              </InputProvider>
            </div>
          </div>
          <div className={styles.checkboxGroup}>
            <InputProvider>
              <label htmlFor="checkbox02" className="form__label form__label__checkbox">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="form__input"
                  id="checkbox02"
                  name="개인정보 동의"
                  required
                />
                <span className="input__text">개인 정보 이용 동의</span>
              </label>
            </InputProvider>
          </div>
          <ButtonProvider>
            <button type="submit" className="button button__primary">
              <span className="button__text">회원가입</span>
            </button>
          </ButtonProvider>
        </form>
      </section>
    </div>


  );
}

export default SignUp;
