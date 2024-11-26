import {useEffect, useRef, useState} from "react";
import styles from "../assets/styles/css/city.module.css"

const LocationActiveSvg = ({
                               gId,
                               eventClick,
                               clipPathId,
                               pathD,
                               pathId,
                               imgHref,
                               imgId,
                           }) => {

    const pathRef = useRef(null);
    const imgRef = useRef(null);

    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const image = new Image();

        image.onload = () => {
            // 원본 이미지가 로드된 후 크기 값을 가져옴
            setImageDimensions({
                width: image.width,  // 원본 이미지의 width
                height: image.height,  // 원본 이미지의 height
            });
            console.log(imgId, "imgWidth", image.width, "imgHeight", image.height)

        };
        // 이미지 소스를 설정하여 로드 시작
        image.src = imgHref;
    }, [imgHref]);

    useEffect(() => {
        if (imageDimensions.width === 0 || imageDimensions.height === 0) return;

        const imageTag = imgRef.current;
        // console.log(imageTag)
        const pathTag = pathRef.current;
        // console.log(pathTag)

        const pathBox = pathTag.getBBox();

        let imgWidth, imgHeight, imgX, imgY;

        // 이미지가 정사각형일 때 크기 조정
        if (imageDimensions.width === imageDimensions.height) {
            // 더 큰 값을 기준으로 크기 설정
            const scaleFactor = Math.max(pathBox.width, pathBox.height) / imageDimensions.width;

            imgWidth = imageDimensions.width * scaleFactor;
            imgHeight = imageDimensions.height * scaleFactor;

            // 중심 좌표를 기준으로 배치
            imgX = pathBox.x + (pathBox.width - imgWidth) / 2;
            imgY = pathBox.y + (pathBox.height - imgHeight) / 2;
        } else {
            // 비율이 다른 경우 기존 로직 적용
            if (imageDimensions.width > imageDimensions.height) {
                imgHeight = pathBox.height;
                imgWidth = (imageDimensions.width / imageDimensions.height) * pathBox.height;
                imgX = pathBox.x + (pathBox.width - imgWidth) / 2;
                imgY = pathBox.y;
            } else {
                imgWidth = pathBox.width;
                imgHeight = (imageDimensions.height / imageDimensions.width) * pathBox.width;
                imgX = pathBox.x;
                imgY = pathBox.y + (pathBox.height - imgHeight) / 2;
            }
        }

        // 이미지 속성 설정
        imageTag.setAttribute("width", imgWidth);
        imageTag.setAttribute("height", imgHeight);
        imageTag.setAttribute("x", imgX);
        imageTag.setAttribute("y", imgY);

    }, [imageDimensions]); // imgHref가 변경될 때마다 이미지 정보를 업데이트

    return (
        <g id={gId} role="button" tabIndex="0" onClick={eventClick}>
            <defs>
                <clipPath id={clipPathId}>
                    <path
                        ref={pathRef}
                        d={pathD}
                        id={pathId}/>
                </clipPath>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor="black" floodOpacity="0.5"/>
                </filter>
            </defs>
            <image
                ref={imgRef}
                href={imgHref}
                clipPath={`url(#${clipPathId})`} id={imgId}/>
            <path
                className={styles.shadow}
                fillOpacity={0}
                ref={pathRef}
                d={pathD}
                id={"p" + pathId}
                filter="url(#shadow)"
            />
            <use href={`#${pathId}`} fill={`url(#${imgId})`}/>
        </g>
    );
}

export default LocationActiveSvg;