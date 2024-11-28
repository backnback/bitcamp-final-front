import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/AxiosInstance';
import { FormProvider, StoryForm } from '../components/FormProvider';
import Swal from 'sweetalert2';


const MyStoryAddForm = ({ provinceId, cityId, isModal }) => {
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
                    const response = await axiosInstance.get(`/location/${locationId}`);
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
                const response = await axiosInstance.get('/location/list');
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
                    const response = await axiosInstance.get(`/location/list/${selectedFirstName}`);
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
        const uploadedFiles = Array.from(event.target.files);
        setFiles(uploadedFiles);

        // 사진이 한 장만 업로드된 경우 mainPhotoIndex를 0으로 설정
        if (uploadedFiles.length === 1) {
            setMainPhotoIndex(0);
        }
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
            await axiosInstance.post('/my-story/add', formData, {
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


    useEffect(() => {
        if (files.length > 0) {
            console.log("업로드된 파일들:", files);
        }


    }, [files]);


    const onAddPhoto = (files) => {
        const uploadedFiles = Array.from(files);

        if (uploadedFiles.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

            // 사진이 한 장만 업로드된 경우 mainPhotoIndex를 0으로 설정
            if (uploadedFiles.length === 1) {
                setMainPhotoIndex(0);
            }
        } else {
            console.warn("No files selected.");
        }
    };

    const onDeletePhoto = (photo) => {
        setFiles((prevFiles) => {
            console.log("삭제하려는 파일:", photo);

            const updatedFiles = prevFiles.filter((file) => {
                return file !== photo;
            });

            console.log("삭제 후 파일 리스트:", updatedFiles);
            return updatedFiles;
        });
    };


    const formValue = {
        title, setTitle,
        selectedYear, setSelectedYear,
        selectedMonth, setSelectedMonth,
        selectedDay, setSelectedDay,
        selectedFirstName, setSelectedFirstName, firstNames,
        selectedSecondName, setSelectedSecondName, secondNames,
        locationDetail, setLocationDetail,
        handleFileChange, onAddPhoto, onDeletePhoto,
        content, setContent,
        checkedShare, handleCheckboxChange,
        files,
        mainPhotoIndex, handleMainPhotoSelect,
        handleButtonClick,
        handleSubmit
    }


    return (
        <>
            {
                isModal ?
                    <div>
                        <FormProvider value={formValue}>
                            <StoryForm />
                        </FormProvider>
                    </div>
                    :
                    <FormProvider value={formValue}>
                        <StoryForm />
                    </FormProvider>
            }
        </>
    );
};

export default MyStoryAddForm;
