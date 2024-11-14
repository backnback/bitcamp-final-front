import React from 'react';
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";  // 기본 CSS 파일

const CarouselComponent = () => (
  <Flicking
    align="center"   // 슬라이드 위치 정렬
    circular={true}  // 순환 슬라이드 여부
    duration={500}   // 애니메이션 지속 시간
  >
    <div className="panel" style={{ backgroundColor: "lightcoral" }}>Slide 1</div>
    <div className="panel" style={{ backgroundColor: "lightblue" }}>Slide 2</div>
    <div className="panel" style={{ backgroundColor: "lightgreen" }}>Slide 3</div>
  </Flicking>
);

export default CarouselComponent;
