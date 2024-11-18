import { useEffect, useRef, useState } from 'react';
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { InputProvider } from '../components/InputProvider';


export const PhotosProvider = ({ photos, viewMode, mainPhotoIndex, className, itemClassName, layout, onSelectMainPhoto, onAddPhoto }) => {
    const validPhotos = Array.isArray(photos) ? photos : [];
    const flickingRef = useRef(null); // Flicking에 대한 ref를 생성
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중 상태
    const [mainPhotoIdx, setMainPhotoIdx] = useState(mainPhotoIndex);


    const handleSelectMainPhoto = (index) => {
        if (onSelectMainPhoto) {
            console.log("선택된 사진 index : ", index);
            onSelectMainPhoto(index); // 상위 컴포넌트로 선택한 대표 이미지 ID 전달
        }
        setMainPhotoIdx(index);
    };


    // 슬라이드를 이동하는 함수
    const moveToSlide = (index) => {
        if (isAnimating) return; // 애니메이션 진행 중이면 이동하지 않음
        setIsAnimating(true); // 애니메이션 시작

        flickingRef.current.moveTo(index)
            .then(() => {
                setIsAnimating(false); // 애니메이션이 끝나면 상태를 원래대로 복원
                setCurrentIndex(index);
            })
            .catch((error) => {
                setIsAnimating(false); // 애니메이션 도중 오류 발생 시 상태 복원
                console.error("애니메이션 오류:", error);
            });
    };

    // 왼쪽으로 1칸 이동하는 함수
    const moveLeft = (event) => {
        if (isAnimating) return; // 애니메이션 진행 중일 때 이동 차단
        event.stopPropagation();
        const newIndex = Math.max(currentIndex - 1, 0); // 0보다 작은 인덱스로 이동하지 않도록 설정
        setCurrentIndex(newIndex); // 인덱스 업데이트
        moveToSlide(newIndex); // 슬라이드 이동
    };

    // 오른쪽으로 1칸 이동하는 함수
    const moveRight = (event) => {
        if (isAnimating) return; // 애니메이션 진행 중일 때 이동 차단
        event.stopPropagation();
        const newIndex = Math.min(currentIndex + 1, validPhotos.length - 2); // 최대 인덱스를 초과하지 않도록 설정
        setCurrentIndex(newIndex); // 인덱스 업데이트
        moveToSlide(newIndex); // 슬라이드 이동
    };


    // photo(기존 사진)과 file(추가 사진) 구분 처리
    const renderPhoto = (photo) => {
        if (photo instanceof File) {
            // File 객체일 경우 URL.createObjectURL로 처리
            const objectURL = URL.createObjectURL(photo);
            return (
                <img
                    src={objectURL}
                    alt="추가된 사진들"
                    className="story-photo"
                />
            );
        } else {
            // 기존 photo 객체일 경우 기존 URL 사용
            return (
                <img
                    src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path ? photo.path : 'default.png'}`}
                    alt={`Photo ${photo.id}`}
                    className={`story-photo ${photo.mainPhoto ? 'main-photo' : ''}`}
                />
            );
        }
    };



    useEffect(() => {
        // mainPhotoIdx가 변경될 때마다 슬라이드를 해당 인덱스로 이동시킴
        if (flickingRef.current) {
            let targetIndex = mainPhotoIdx;

            // mainPhotoIdx가 마지막 인덱스일 경우, 그 인덱스에서 -2로 이동
            if (mainPhotoIdx === validPhotos.length - 1) {
                targetIndex = mainPhotoIdx - 1; // 마지막 인덱스에서 -2
            }
            // mainPhotoIdx가 마지막 직전 인덱스일 경우, 그 인덱스에서 -1로 이동
            else if (mainPhotoIdx === validPhotos.length - 2) {
                targetIndex = mainPhotoIdx; // 마지막 직전 인덱스에서 -1
            }

            moveToSlide(targetIndex); // 최종적으로 결정된 인덱스로 이동
        }
    }, [mainPhotoIdx]);


    return (
        <div className={`photo__photos ${viewMode ? `` : `photo__photos__noMain`} ${className != null ? className : ``}`}>
            {validPhotos.length > 0 ? (
                <div>
                    {viewMode && validPhotos.map(photo => (
                        photo.mainPhoto && (
                            <div key={photo.id} className="photo__mainPhoto">
                                <img
                                    src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path ? photo.path : 'default.png'}`}
                                    alt={`Main Photo`}
                                    className={`story-photo main-photo`}
                                />
                            </div>
                        )
                    ))}

                    <div className={`photo__layout ${layout ? `photo__layout__custom` : ``}`}>
                        <Flicking
                            ref={flickingRef} // Flicking에 ref 연결
                            circular={false}  // 순환 슬라이드 여부
                            duration={500}    // 애니메이션 지속 시간
                            drag={false}
                            touch={viewMode ? undefined : false}
                        >
                            {validPhotos.map((photo, index) => (
                                <div className={`photo__photoItem ${itemClassName ? `photo__photoItem__custom` : ``}`}
                                    key={`${photo.id}-${index}`} >

                                    {renderPhoto(photo)}

                                    {viewMode ? (
                                        photo.mainPhoto && <span className="main-onelabel">대표</span>  // viewMode가 true일 때 대표 이미지만 표시
                                    ) : (
                                        <div className={index === mainPhotoIdx ? "main-label" : "sub-label"}>
                                            <InputProvider>
                                                <label htmlFor={`radio-${index}`} className={`form__label form__label__radio`}>
                                                    <input
                                                        type='radio'
                                                        className={`form__input`}
                                                        id={`radio-${index}`}
                                                        name='라디오1'
                                                        checked={index === mainPhotoIdx}  // 선택된 상태 반영
                                                        onChange={() => handleSelectMainPhoto(index)} />
                                                    <span className={`input__text`}>대표이미지</span>
                                                </label>
                                            </InputProvider>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="photo__photoItem">
                                <button type="button" className={`button button__story__add`} onClick={onAddPhoto}>
                                    <span className={`blind`}>사진 등록</span>
                                    <i className={`icon icon__plus__white`}></i>
                                </button>
                            </div>
                        </Flicking>
                        {/* 버튼을 추가하여 슬라이드를 이동 */}
                        <div className="slider__button">
                            {currentIndex > 0 && <button type="button" className="left" onClick={moveLeft}>◀</button>}
                            {currentIndex < validPhotos.length - 2 && <button type="button" className="right" onClick={moveRight}>▶</button>}
                        </div>
                    </div>
                </div>
            ) : (
                <p>사진이 없습니다.</p>
            )}
        </div>
    );
};