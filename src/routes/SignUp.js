import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/AxiosInstance';
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import FormFileIcon from '../components/FormFileIcon';
import Swal from 'sweetalert2';
import { AuthTitleProvider } from '../components/TitleProvider';
import styles from '../assets/styles/css/Auth.module.css';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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

  const handleDeleteProfile = () => {
    setProfileImage(null);
  };

  const handleFileChange = (e) => {
    console.log(e)
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

        if (!isValidEmail(email)) {
          setDuplication('해당 이메일은 이메일 형식이 아닙니다');
          return;
        }

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
          });
        }
      } else {
        setDuplication('중복된 이메일입니다');
        Swal.fire({
          icon: 'error',
          title: '중복된 이메일입니다',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '이메일 중복 확인 중 오류 발생',
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
      });
    }
  };

  return (
    <div id='signup' className={styles.auth__container}>
      <section className={styles.auth__wrap}>
        <AuthTitleProvider title={`회원가입`} />
        <form onSubmit={handleSubmit}>
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

              {!isOAuthSignUp && (
                <ButtonProvider width={`120`}>
                  <button type="button" className="button button__primary" onClick={getUserAuthCode}>
                    <span className="button__text">인증번호 받기</span>
                  </button>
                </ButtonProvider>
              )}
            </div>
            <span className={`${styles.auth__sub__notice} ${duplication.includes("사용 가능한 이메일") ? styles.success : styles.error}`}>{`${duplication}`}</span>
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

          <InputProvider label={`비밀번호`} inputId={`password01`} required={true}>
            <input
              type="password"
              className="form__input"
              id="password01"
              name="비밀번호"
              value={password}
              placeholder="비밀번호 입력"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputProvider>

          <InputProvider label={`닉네임`} inputId={`nickname01`} required={true}>
            <input
              type="text"
              className="form__input"
              id="nickname01"
              name="닉네임"
              value={nickname}
              placeholder="닉네임 입력"
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </InputProvider>

          <div className={`${styles.auth__form__item}`}>
            <h5 className='form__label__title'>프로필 사진 등록</h5>
            {profileImage == null ?
              <InputProvider>
                <label htmlFor="file01" className="form__label form__label__file">
                  <input type="file" className="blind" id="file01" onChange={handleFileChange} />
                  <FormFileIcon />
                </label>
              </InputProvider> :

              <div className={`${styles.profile__img__wrap}`}>
                <label htmlFor="profileImage" className={`${styles.profile__img__label}`}>
                  <img
                    src={`${URL.createObjectURL(profileImage)}`}
                    alt="프로필 사진"
                    className={`${styles.profile__img}`}
                  />
                  <i className={`icon icon__profile__file ${styles.profile__icon}`}></i>
                  <input type='file' className={`blind`} id="profileImage" onChange={handleFileChange} />
                </label>
                <ButtonProvider width={'icon'} className={`button__item__x ${styles.profile__delete__button}`}>
                  <button type="button" className={`button button__icon button__icon__x`} onClick={handleDeleteProfile}>
                    <span className={`blind`}>삭제</span>
                    <i className={`icon icon__x__black`}></i>
                  </button>
                </ButtonProvider>
              </div>
            }
          </div>

          <div className={`${styles.auth__item__center} ${styles.auth__item__agree}`}>
            <InputProvider>
              <label htmlFor="checkbox02" className={`form__label form__label__checkbox`}>
                <input
                  type='checkbox'
                  className={`form__input`}
                  onChange={(e) => setAgree(e.target.checked)}
                  id='checkbox02'
                  checked={agree}
                  name="개인정보 동의"
                  required />
                <span className={`input__text`}>개인 정보 이용 동의</span>
              </label>
            </InputProvider>
          </div>

          <div className={`${styles.auth__item__center}`}>
            <ButtonProvider>
              <button type="submit" className="button button__primary">
                <span className="button__text">회원가입</span>
              </button>
            </ButtonProvider>
          </div>
        </form>
      </section>
    </div>


  );
}

export default SignUp;
