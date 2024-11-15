import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonProvider } from '../components/ButtonProvider';
import { InputProvider } from '../components/InputProvider';
import { SelectProvider } from '../components/SelectProvider';
import { PhotosProvider } from '../components/PhotosProvider';
import FormFileIcon from "../components/FormFileIcon";
import Swal from 'sweetalert2';
import styles from '../assets/styles/css/StoryAddForm.module.css';


const MyStoryAddForm = ({ provinceId, cityId }) => {
    const [title, setTitle] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [content, setContent] = useState('');
    const [locationDetail, setLocationDetail] = useState(''); // 사용자가 입력할 위치 상세 필드
    const [files, setFiles] = useState([]);
    const [firstNames, setFirstNames] = useState([]);
    const [secondNames, setSecondNames] = useState([]);
    const [selectedFirstName, setSelectedFirstName] = useState('');
    const [selectedSecondName, setSelectedSecondName] = useState('');
    const [accessToken, setAccessToken] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 월은 0부터 시작
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [checkedShare, setCheckedShare] = useState(false);
    const [mainPhotoIndex, setMainPhotoIndex] = useState('');


    // 로컬 스토리지에서 accessToken을 가져오는 함수
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            console.warn("Access token이 없습니다.");
        }

        if (provinceId !== undefined && cityId !== undefined) {
            const setLocation = async () => {
                try {
                    const locationId = provinceId + cityId;
                    const response = await axios.get(`http://localhost:8080/location/${locationId}`);
                    setSelectedFirstName(response.data.firstName)
                    setSelectedSecondName(response.data.secondName)
                } catch (error) {
                    console.error("LocationID 가져오는 중 오류", error);
                }
            };
            setLocation();
        }

        const fetchFirstNames = async () => {
            try {
                const response = await axios.get('http://localhost:8080/location/list');
                setFirstNames(response.data);
            } catch (error) {
                console.error("로케이션 가져오는 중 오류가 발생했습니다!", error);
            }
        };
        fetchFirstNames();
        console.log(mainPhotoIndex);
    }, []);


    useEffect(() => {
        const fetchSecondNames = async () => {
            if (selectedFirstName) {
                try {
                    const response = await axios.get(`http://localhost:8080/location/list/${selectedFirstName}`);
                    setSecondNames(response.data);
                } catch (error) {
                    console.error("두 번째 이름 가져오는 중 오류가 발생했습니다!", error);
                }
            } else {
                setSecondNames([]);
            }
        };


        fetchSecondNames();
    }, [selectedFirstName]);

    useEffect(() => {
        // 연도, 월, 일이 변경될 때 travelDate 업데이트
        setTravelDate(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`);
    }, [selectedYear, selectedMonth, selectedDay]);


    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!title || !travelDate || !content || !locationDetail) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "모든 필수 항목을 입력해주세요!",
                footer: '<a href="#">왜 이 문제가 발생했나요?</a>'
            });
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('travelDate', travelDate);
        formData.append('locationDetail', locationDetail); // 사용자가 입력한 위치 상세
        formData.append('content', content);
        formData.append('firstName', selectedFirstName);
        formData.append('secondName', selectedSecondName);
        formData.append('share', checkedShare);
        formData.append('mainPhotoIndex', mainPhotoIndex);

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        // mainPhoto 값 확인
        console.log("전송할 mainPhoto 인덱스:", mainPhotoIndex);


        try {
            await axios.post('http://localhost:8080/my-story/add', formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                position: "top",
                icon: "success",
                title: "스토리가 추가되었습니다!",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // 3초 후 페이지 이동
                if (provinceId === undefined && cityId === undefined) {
                    window.location.href = '/my-story/list';
                } else {
                    window.location.href = `/map/story/${provinceId}`
                }
            });
        } catch (error) {
            console.error("스토리 추가 중 오류가 발생했습니다!", error);
        }
    };

    const handleButtonClick = () => {
        handleSubmit(new Event('submit', { cancelable: true }));
    };

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setCheckedShare(checked);
        console.log("Checkbox is checked:", checked);
    };


    const handleMainPhotoSelect = (index) => {
        setMainPhotoIndex(index); // Main 이미지
    };



    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form_box}>
                <div className={styles.title__box}>
                    <h5 className={styles.title__text}>제목</h5>
                    <InputProvider>
                        <input
                            type='text'
                            className={`form__input`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            id='text01'
                            name='텍수투'
                            placeholder="title" />
                    </InputProvider>
                </div>
                <div>
                    <h5>날짜</h5>
                    <div className={styles.date__box}>
                        <SelectProvider>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                id="select01" name="selectYear" className={`form__select`}>
                                <option value={'0'}>년</option>
                                {[...Array(10)].map((_, index) => {
                                    const year = new Date().getFullYear() - index;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>년</p>
                        <SelectProvider>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                id="select02" name="selectMonth" className={`form__select`}>
                                <option value={'0'}>달</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>월</p>
                        <SelectProvider>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(Number(e.target.value))}
                                id="select03" name="selectDay" className={`form__select`}>
                                <option value={'0'}>일</option>
                                {[...Array(31)].map((_, index) => {
                                    const day = index + 1;
                                    return <option key={day} value={day}>{day}</option>;
                                })}
                            </select>
                        </SelectProvider>
                        <p className={styles.date__text}>일</p>
                    </div>
                </div>
                <div className={styles.location__box}>
                    <h5>지역</h5>
                    <div className={styles.location__picker__box}>
                        <SelectProvider className={styles.location__picker__province}>
                            <select id="select04" name="selectFirstName" className={`form__select`}
                                onChange={(e) => setSelectedFirstName(e.target.value)} value={selectedFirstName}>
                                <option value={'0'}>지역 선택</option>
                                {firstNames.map((firstName) => (
                                    <option key={firstName} value={firstName}>
                                        {firstName}
                                    </option>
                                ))}
                            </select>
                        </SelectProvider>
                        <SelectProvider>
                            <select id="select05" name="selectSecondName" className={`form__select`}
                                onChange={(e) => setSelectedSecondName(e.target.value)} value={selectedSecondName}
                                disabled={!selectedFirstName}>
                                <option value={'0'}>세부 지역 선택</option>
                                {secondNames.map((location) => (
                                    <option key={location.id} value={location.secondName}>
                                        {location.secondName}
                                    </option>
                                ))}
                            </select>
                        </SelectProvider>
                    </div>
                    <InputProvider>
                        <input
                            type='text'
                            className={`form__input`}
                            value={locationDetail}
                            onChange={(e) => setLocationDetail(e.target.value)}
                            required
                            id='text02'
                            name='텍수투'
                            placeholder="지역 상세정보 입력" />
                    </InputProvider>
                </div>
                <div className={styles.photo__box}>
                    {files.length === 0 ? (
                        <InputProvider>
                            <label htmlFor="file01" className="form__label form__label__file">
                                <input type="file" className="blind" id="file01" multiple onChange={handleFileChange} />
                                <FormFileIcon />
                            </label>
                        </InputProvider>
                    ) : (
                        <PhotosProvider
                            photos={files}
                            viewMode={false}
                            className="custom-photo-container"
                            mainPhotoIndex={mainPhotoIndex}
                            onSelectMainPhoto={handleMainPhotoSelect}
                        />
                    )}
                </div>
                <div className={styles.content__box}>
                    <h5>내용</h5>
                    <InputProvider className={styles.content__inputBox}>
                        <textarea
                            id='textarea01'
                            placeholder='내용 입력'
                            className={`form__textarea`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </InputProvider>
                </div>

                <InputProvider className={styles.share__check__box}>
                    <label htmlFor="checkbox01" className={`form__label form__label__checkbox`}>
                        <input
                            type='checkbox'
                            className={`form__input`}
                            defaultChecked={checkedShare}
                            id='checkbox01'
                            name='체크체크'
                            onChange={handleCheckboxChange}
                        />
                        <span className={`input__text`}>해당 스토리를 공개합니다.</span>
                    </label>
                </InputProvider>

                <ButtonProvider className={styles.save__button__box}>
                    <button type="button" id="submit-button" className={`button button__primary`}
                        onClick={handleButtonClick}>
                        <span className={`button__text`}>등록</span>
                    </button>
                </ButtonProvider>
            </form>
        </div>
    );
};

export default MyStoryAddForm;
