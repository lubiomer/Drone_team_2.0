/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useGetDashboardProductsQuery } from "../redux/api/dashboardAPI";
import FullScreenLoader from "../components/FullScreenLoader";
import { useCookies } from "react-cookie";
import { setToken, setUserData } from "../utils/Utils";
import { getMeAPI } from "../redux/api/getMeAPI";
import { useDispatch } from "react-redux";

const Home = () => {
    const { data: products, isLoading, refetch } = useGetDashboardProductsQuery({});
    const [cookies, removeCookie] = useCookies(['isLoggedIn', 'userData', 'accessToken']);
    const navigate = useNavigate();
    const dispatch = useDispatch<any>();
    // Access the cookies directly from the cookies object
    const isLoggedIn = cookies.isLoggedIn as boolean;
    const userData = cookies.userData as any; // Use the appropriate type here instead of any
    const accessToken = cookies.accessToken as string;

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn && userData) {
                setToken(accessToken);
                setUserData(userData);
                removeCookie('userData', { path: '/' });
                try {
                    await dispatch(getMeAPI.endpoints.getMe.initiate(null)).unwrap();
                    navigate('/profile');
                } catch (error) {
                    // Handle error here if necessary
                }
            }
        };

        fetchUser();
    }, []); 

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div className="main-view drone-background">
            {isLoading ? (<FullScreenLoader />) : (
                <Container>
                    <div className="drone-tail text-center">
                        <p className="drone-title mb-4">Hello Mr. Eliav</p>
                        <ul className="mt-4 no-list-style">
                            {/* sign up */}
                            <li>
                                <Link className="btn btn-orange btn-xl text-uppercase drone-link"
                                    to="/register">
                                    sign up {'>'}
                                </Link>
                            </li>
                        </ul>
                        <ul className="mt-4 no-list-style">
                            {/* sign in */}
                            <li>
                                <Link className="btn btn-orange btn-xl text-uppercase drone-link"
                                    to="/login">
                                    sign in {'>'}
                                </Link>
                            </li>
                        </ul>
                        <ul className="mt-4 no-list-style">
                            {/* learn more */}
                            <li>
                                <Link className="btn btn-orange btn-xl text-uppercase drone-link"
                                    to="/">
                                    Learn more {'>'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <Row>
                        {products.map((product: any, index: any) => (
                            <Col key={index} md={4}>
                                <div className="drone-item">
                                    <div className="mb-3">
                                        <span>{product.name}</span>
                                    </div>
                                    <Row>
                                        <Col md={6}>
                                            <img
                                                style={{ borderRadius: '10px', minHeight: '150px', maxHeight: '200px' }}
                                                src={product.productImg}
                                                alt={product.name}
                                                className="img-fluid"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <p className="text-start">Name: {product.name}</p>
                                            <p className="text-start">Price: {product.price}</p>
                                            <div className="mt-3 text-end">
                                                <Link className="btn btn-gray" to="/shop/items">
                                                    Buy now {'>'}
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                        ))}
                    </Row>

                </Container>
            )}
        </div>
    );
};

export default Home;
