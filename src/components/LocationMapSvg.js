const LocationMapSvg = ({gId, gClassName, eventClick, pathD}) => {
    return (
        <g id={gId} className={`province ${gClassName}`} role="button" tabIndex="0" onClick={eventClick}>
            <path
                fill="#B1EDF8"
                d={pathD}
                id={"p" + gId}/>
        </g>
    );
}

export default LocationMapSvg;