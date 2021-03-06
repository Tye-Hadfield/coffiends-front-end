import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import axios from "axios";
import { Button, Container } from "reactstrap";
import StateContext from "../../utils/store";
import setTimeString from "../../utils/setTimeString";
import "../../App.css";

const MapView = () => {
  const { coffee } = useParams();
  
  const [ userLocation, setUserLocation ] = useState(null);
  const [ cafesData, setCafesData ] = useState([]);

  const { dispatch } = useContext(StateContext);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(fetchData);

    function fetchData(position) {
      const geoLocationCoordinates = [ position.coords.latitude, position.coords.longitude ];
      setUserLocation(geoLocationCoordinates);
  
      if (geoLocationCoordinates && coffee) {
        const postBody = {
          location: geoLocationCoordinates,
          time: setTimeString(false, true),
          coffee: coffee
        };
  
        axios.post(`${process.env.REACT_APP_BACK_END_URL}/cafes/map`, postBody)
          .then((res) => {
            setCafesData(res.data);
            if (res.data === []) {
              dispatch({ type: "setFlashMessage", data: "Sorry, there are no cafes near you selling that coffee that are currently open" });
            };
          })
          .catch(() => dispatch({ type: "setFlashMessage", data: "Unable to find any cafes" }));
      };
    };
  }, [ coffee, dispatch ]);

  function handleClick(cafe, item) {
    dispatch({
      type: "setUserCoffee",
      data: {
        _id: item.coffeeId,
        name: item.coffeeName,
        price: item.coffeePrice
      }
    });
    dispatch({
      type: "setOrderCafe",
      data: cafe
    });
  };

  return (
    <>
      <Container fluid="true" className="background justify-content-center">
        {userLocation && coffee ? (
          <>
            <h2 className="text-center map-heading-colors " >Nearby cafes selling: {coffee}</h2>
            <div className="Admin-Dashboard-Center">
            <MapContainer center={userLocation} zoom={17} scrollWheelZoom={false} >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {cafesData.map((cafe, index) => (
                <Marker key={index} position={[cafe.location[0], cafe.location[1]]} >
                  <Popup key={index} className="map-marker-popup">
                    <h3>{cafe.cafe_name}</h3>
                    <p>Open: {cafe.operating_hours[0]} - {cafe.operating_hours[1]}</p>
                    {cafe.menu.map((item) =>
                      item.coffeeName === coffee ? (
                        <>
                          <h5>{item.coffeeName} - ${item.coffeePrice.toFixed(2)}</h5>
                          <Link key={item.coffeeId} to="/orders/new" onClick={() => handleClick(cafe, item)} >
                            <Button color="info" >
                                ORDER
                            </Button>
                          </Link>
                        </>
                      ) : (<></>)
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            </div>
          </> 
        ) : (
          <>
            <div className="Admin-Dashboard-Center">
              <h2 className="text-center map-heading-colors ">Searching for nearby Cafes</h2>
              <p className="text-center subtext-heading-colors">Make sure location access is allowed</p>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default MapView;
