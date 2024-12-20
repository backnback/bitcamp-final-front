import { useEffect, useRef, useState } from 'react';
import Flicking, { ViewportSlot } from "@egjs/react-flicking";
import { Arrow, Pagination } from "@egjs/flicking-plugins";
import { InputProvider } from '../components/InputProvider';
import { ButtonProvider } from '../components/ButtonProvider';
import styles from "../assets/styles/css/Photo.module.css";
import FormFileIcon from './FormFileIcon';



export const PhotosProvider = ({ photos, viewMode, mainPhotoIndex, className, itemClassName, layout, onSelectMainPhoto, onAddPhoto, onDeletePhoto }) => {
    const validPhotos = Array.isArray(photos) ? photos : [];
    const fileInputRef = useRef(null);
    const flickingRef = useRef(null); // Flicking에 대한 ref를 생성
    const [currentIndex, setCurrentIndex] = useState(mainPhotoIndex);
    const [syncImg, setSyncImg] = useState();
    const [_active, setActive] = useState(false);
    const [plugins, setPlugins] = useState([new Arrow(), new Pagination({ type: 'fraction' })]);
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중 상태
    const [mainPhotoIdx, setMainPhotoIdx] = useState(mainPhotoIndex);
    const [deleteClick, setDeleteClick] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);


    const handleDeletePhoto = (photo, index) => {
        // console.log("삭제하려는 파일:", photo);
        onDeletePhoto(photo);  // 상위 컴포넌트에게 삭제할 사진을 전달
        setDeleteClick(true);
        setSlideIndex(index);
    };

    const handleSelectMainPhoto = (index) => {
        if (onSelectMainPhoto) {
            // console.log("선택된 사진 index : ", index);
            onSelectMainPhoto(index); // 상위 컴포넌트로 선택한 대표 이미지 ID 전달
        }
        setMainPhotoIdx(index);
    };

    // const handleAddPhotoClick = () => {
    //     // button 클릭 시 file input의 click 이벤트를 트리거
    //     if (fileInputRef.current) {
    //         fileInputRef.current.click();
    //     }
    // };

    const handleFileChange = (event) => {
        // 파일 선택이 변경되었을 때 처리
        const files = event.target.files;
        if (files && files.length > 0) {
            onAddPhoto(files); // 부모 컴포넌트로 파일 목록 전달
        }
    };

    const handleClickSlide = (event) => {
        const img = event.currentTarget.querySelector(`[data-img-id]`);

        setSyncImg(img.src);
    }

    // photo(기존 사진)과 file(추가 사진) 구분 처리
    const renderPhoto = (photo, index) => {
        if (photo instanceof File) {
            // File 객체일 경우 URL.createObjectURL로 처리
            const objectURL = URL.createObjectURL(photo);
            return (
                <div className={`${styles.slide__photo__wrap}`}>
                    <img
                        src={objectURL}
                        alt="추가된 사진들"
                        className={`${styles.photo__img} ${styles.slide__photo__img}`}
                    />
                </div>
            );
        } else {
            // 기존 photo 객체일 경우 기존 URL 사용
            return (
                <div className={`${styles.slide__photo__wrap}`} role='button' tabIndex={0}
                    onClick={(e) => {
                        if (flickingRef.current) {
                            flickingRef.current.moveTo(index);
                        }
                        setCurrentIndex(index);
                        handleClickSlide(e);
                    }}>
                    <img
                        src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path ? photo.path : 'default.png'}`}
                        alt={`Photo ${photo.id}`}
                        data-img-id={photo.id}
                        className={`${styles.photo__img} ${styles.slide__photo__img} ${photo.mainPhoto ? 'main-photo' : ''}`}
                    />
                </div>
            );
        }
    };



    useEffect(() => {
        // setPanels([...panels, panels[panels.length - 1] + 1])
        // setPagination(new Pagination().fractionCurrentFormat)
        // mainPhotoIdx가 변경될 때마다 슬라이드를 해당 인덱스로 이동시킴
        // if (flickingRef.current) {
        //     let targetIndex = mainPhotoIdx;

        //     if (mainPhotoIdx === validPhotos.length - 1) {
        //         targetIndex = viewMode ? mainPhotoIdx - 2 : mainPhotoIdx - 1; // 마지막 인덱스에서 -1
        //     }
        //     // mainPhotoIdx가 마지막 직전 인덱스일 경우, 그 인덱스에서 -1로 이동
        //     else if (mainPhotoIdx === validPhotos.length - 2) {
        //         targetIndex = viewMode ? mainPhotoIdx - 1 : mainPhotoIdx; // 마지막 직전 인덱스
        //     }
        // }
    }, [mainPhotoIdx]);


    return (
        <div className={`photo__photos ${viewMode ? `` : `photo__photos__noMain`} ${className != null ? className : ``}`}>
            {validPhotos.length > 0 ? (
                <div className={`${styles.storyPhoto__wrap}`}>
                    {viewMode && validPhotos.map(photo => (
                        photo.mainPhoto && (
                            <div key={photo.id} className={`${styles.photo__big}`}>
                                <img
                                    // src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path ? photo.path : 'default.png'}`}
                                    src={`${syncImg ? syncImg : `https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path}`}`}
                                    alt={`Main Photo`}
                                    className={`${styles.photo__big__img}`}
                                />
                            </div>
                        )
                    ))}

                    <div className={`${styles.slide__wrap} ${layout ? `${styles.slide__wrap__custom}` : ``}`}>
                        <Flicking
                            ref={flickingRef}
                            duration={300}
                            circular={false}  // 순환 슬라이드 여부
                            align={'prev'}
                            plugins={plugins}
                            onReady={(e) => {
                                if (!viewMode) {
                                    flickingRef.current.moveTo(flickingRef.current.panelCount - 2);
                                }
                            }}
                            onPanelChange={(e) => {
                                if (!deleteClick) {
                                    flickingRef.current.moveTo(flickingRef.current.panelCount - 2);
                                } else {
                                    flickingRef.current.activePlugins.forEach(plugin => {
                                        if (plugin instanceof Pagination) {
                                            if (slideIndex - 1 > 0) {
                                                plugin._onIndexChange(slideIndex - 1);
                                            } else if (flickingRef.current.panelCount >= slideIndex) {
                                                plugin._onIndexChange(flickingRef.current.panelCount - 2);
                                            }
                                        }
                                    });
                                }
                            }}
                        >
                            {validPhotos.map((photo, index) => (
                                <div className={`${styles.slide__item} ${itemClassName ? `${styles.slide__item__custom}` : ``} ${viewMode ? currentIndex === index ? styles._active : `` : ``}`}
                                    key={`${photo.id}-${index}`} >

                                    {renderPhoto(photo, index)}

                                    {viewMode ? (
                                        photo.mainPhoto && <strong className={`${styles.photo__main__badge}`}>대표</strong>  // viewMode가 true일 때 대표 이미지만 표시
                                    ) : (
                                        <div className={`${styles.photo__badge__wrap}`}>
                                            <InputProvider className={`${styles.photo__main__radio} ${index === mainPhotoIdx ? "photo__radio__main" : "photo__radio__sub"}`}>
                                                <label htmlFor={`radio-${index}`} className={`form__label form__label__radio ${index === mainPhotoIdx ? styles.photo__main__radio__checked : ``}`}>
                                                    <input
                                                        type='radio'
                                                        className={`form__input blind`}
                                                        id={`radio-${index}`}
                                                        name='라디오1'
                                                        checked={index === mainPhotoIdx}  // 선택된 상태 반영
                                                        onChange={() => { handleSelectMainPhoto(index) }} />
                                                    <span className={`input__text`}>대표이미지</span>
                                                </label>
                                            </InputProvider>

                                            <ButtonProvider width={'icon'} className={`button__item__x ${styles.photo__delete__button}`}>
                                                <button type="button" className={`button button__icon button__icon__x`} onClick={() => handleDeletePhoto(photo, index)}>
                                                    <span className={`blind`}>삭제</span>
                                                    <i className={`icon icon__x__black`}></i>
                                                </button>
                                            </ButtonProvider>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {!viewMode && <div className={`${styles.slide__item} ${styles.slide__photo__add}`}>
                                <InputProvider>
                                    <label htmlFor="file01" className="form__label form__label__file">
                                        <input type="file" className="blind" id="file01" multiple onChange={handleFileChange} onClick={(e) => { setDeleteClick(false); }} />
                                        <FormFileIcon />
                                    </label>
                                </InputProvider>
                            </div>}

                            <ViewportSlot>
                                <div className="flicking-pagination"></div>
                                {/* <div className="flicking-pagination"></div> */}
                                <button type='button' className="flicking-arrow-prev flicking-arrow-custom">
                                    <span className='blind'>이전</span>
                                </button>
                                <button type='button' className="flicking-arrow-next flicking-arrow-custom">
                                    <span className='blind'>다음</span>
                                </button>
                            </ViewportSlot>
                        </Flicking>
                    </div>
                </div>
            ) : (
                <p>사진이 없습니다.</p>
            )}
        </div >
    );
};