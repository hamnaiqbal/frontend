const MapMarker = ({ user, userLocation }) => {
    return (
        <div>
            <div className="marker"
                lat={user.latitude || userLocation.latitude}
                lng={user.longitude || userLocation.longitude}
                text="My Marker"
            >
            </div>
        </div>
    );
};

export default MapMarker;