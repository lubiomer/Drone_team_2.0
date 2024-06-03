/* eslint-disable jsx-a11y/iframe-has-title */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import FullScreenLoader from '../components/FullScreenLoader';
import { WeatherData } from '../redux/api/types';

const Explore = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getWeather = async () => {
        let location = "Rishon Lezion, Israel";
        let encodedLocation = encodeURIComponent(location);

        var config = {
            method: 'GET',
            url: `https://api.openweathermap.org/data/2.5/weather?appid=bc1301b0b23fe6ef52032a7e5bb70820&units=metric&q=${encodedLocation}`,
            headers: {}
        };

        try {
            const weatherRes = await axios(config);
            setWeather(weatherRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching the weather data", error);
        }
    }

    useEffect(() => {
        getWeather();
    }, []);

    return (
        loading ? (
            <FullScreenLoader />
        ) : (
            <div className="main-view drone-background drone-explore">
                <Container>
                    <Row>
                        <Col md="6">
                            <iframe
                                src="https://www.google.com/maps/d/embed?mid=1lci7DKvcfYjZEO2xhYBOPjXcol9sFy3E&ehbc=2E312F"
                                style={{ width: '100%', height: '500px', border: '0' }}
                                allowFullScreen
                            />
                        </Col>
                        <Col md="6">
                            {weather && (
                                <div className="weather">
                                    <p className="text-capitalize text-dark mb-2">
                                        <span>High {weather.main.temp_max} °C</span>
                                        <span> | Low {weather.main.temp_min} °C</span>
                                    </p>
                                    <p className="text-capitalize text-dark mb-2">
                                        <span>Wind {weather.wind.speed} mph</span>
                                    </p>
                                    <p className="text-capitalize text-dark mb-2">
                                        <span>{weather.weather[0].description}</span>
                                    </p>
                                    <p className="text-capitalize text-dark mb-2">
                                        <span>Humidity {weather.main.humidity}%</span>
                                    </p>
                                </div>
                            )}

                            <div className="my-2" style={{ backgroundColor: "wheat" }}>
                                <video width="100%" controls style={{ maxHeight: '250px' }}>
                                    <source src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    );
}

export default Explore;