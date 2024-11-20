const LocationMapSvg = ({gId, gClassName, eventClick, pathD}) => {
    return (
        <g id={gId} className={`province ${gClassName}`} role="button" tabIndex="0" onClick={eventClick}>
            <path
                d={pathD}
                id={gId}/>
        </g>
    );
}

export default LocationMapSvg;