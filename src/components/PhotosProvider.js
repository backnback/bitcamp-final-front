import { createContext, useContext, useRef, useState } from 'react';
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";


export const PhotosProvider = ({ photos, viewMode, className, itemClassName, layout }) => {
    const flickingRef = useRef(null); // Flicking에 대한 ref를 생성
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 진행 중 상태


    // 버튼 클릭 시 호출되는 함수
    const moveToSlide = (index) => {
        if (isAnimating) return; // 애니메이션 진행 중이면 이동하지 않음
        setIsAnimating(true); // 애니메이션 시작

        flickingRef.current.moveTo(index).then(() => {
            setIsAnimating(false); // 애니메이션이 끝나면 상태를 원래대로 복원
        });
    };

    // 왼쪽으로 1칸 이동하는 함수
    const moveLeft = () => {
        const newIndex = Math.max(currentIndex - 1, 0); // 0보다 작은 인덱스로 이동하지 않도록 설정
        setCurrentIndex(newIndex);
        moveToSlide(newIndex);
    };

    // 오른쪽으로 1칸 이동하는 함수
    const moveRight = () => {
        const newIndex = Math.min(currentIndex + 1, photos.length - 3); // 최대 인덱스를 초과하지 않도록 설정
        setCurrentIndex(newIndex);
        moveToSlide(newIndex);
    };


    return (
        < div className={`photo__photos ${viewMode ? `` : `photo__photos__noMain`} ${className != null ? className : ``}`
        }>
            {
                photos.length > 0 ? (
                    <div className="photo_layout2">
                        {viewMode && photos.map(photo => (
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
                            >
                                {photos.map(photo => (
                                    <div className={`photo__photoItem ${itemClassName ? `photo__photoItem__custom` : ``}`} key={photo.id}>
                                        <img
                                            src={`https://kr.object.ncloudstorage.com/bitcamp-bucket-final/story/${photo.path ? photo.path : 'default.png'}`}
                                            alt={`Photo ${photo.id}`}
                                            className={`story-photo ${photo.mainPhoto ? 'main-photo' : ''}`}
                                        />
                                        {photo.mainPhoto && <span className="main-label">대표</span>}
                                    </div>
                                ))}
                            </Flicking>
                        </div>
                        {/* 버튼을 추가하여 슬라이드를 이동 */}
                        <div className="slider__button">
                            {currentIndex > 0 && <button className="left" onClick={moveLeft}>◀</button>}
                            {currentIndex < photos.length - 3 && <button className="right" onClick={moveRight}>▶</button>}
                        </div>
                    </div>
                ) : (
                    <p>사진이 없습니다.</p>
                )
            }

        </div >
    );
};
