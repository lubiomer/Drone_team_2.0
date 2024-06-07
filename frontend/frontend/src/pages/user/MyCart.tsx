/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
import { Col, Container, Row } from "reactstrap";
import { useGetMyCartsQuery } from "../../redux/api/cartAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Key, useEffect } from "react";

const MyCart = () => {
    const { data: mycarts, refetch: refetchMyCart, isLoading } = useGetMyCartsQuery(undefined);

    useEffect(() => {
        refetchMyCart();
    }, []);

    console.log(mycarts, '--------')
    return (
        <div className="main-view drone-background">
            <Container>
                <Row className="my-3">
                    <Col>
                        <h4 className="text-white">My Shipping Cart</h4>
                    </Col>
                </Row>
                <Row className="my-1">
                    <Col>
                        <div className="d-flex my-3">
                            <div className="mycart-item">
                                Item
                            </div>
                            <div className="mycart-item">
                                Item Price
                            </div>
                            <div className="mycart-item">
                                Quantity
                            </div>
                            <div className="mycart-item">
                                Price
                            </div>
                        </div>
                    </Col>
                </Row>
                {
                    isLoading ? (
                        <FullScreenLoader />
                    ) : (
                        <>
                            {
                                mycarts.map((cart: any, index: Key | null | undefined) => (
                                    <Row key={index}>
                                        <Col>
                                            <div className="d-flex my-1 mycart-item-detail">
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '5%', fontSize: '24px' }}>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id={cart._id} value="" />
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '35%' }}>
                                                    {cart.product?.name}
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '20%' }}>
                                                    {cart.product?.price}
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '15%' }}>
                                                    <div className="cart_quantity_button d-flex justify-content-center align-items-center">
                                                        <a href="javascript:void(0);" className="cart_quantity_up"> + </a>

                                                        <input className="cart_quantity_input" type="text" name="quantity" value={cart.quantity} autoComplete="off" size={2} />
                                                        <a href="javascript:void(0);" className="cart_quantity_down"> - </a>
                                                    </div>
                                                </div>
                                                <div style={{ width: '15%' }} className="total-price">
                                                    {parseFloat(cart.quantity) * parseFloat(cart.product?.price)}
                                                </div>
                                                <div style={{ width: '10%' }}>
                                                    <a href="javascript:void(0);" className="cart-delete btn btn-primary btn-sm" data-id={cart._id}>
                                                        <svg className="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path></svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                ))
                            }
                            <div className="d-flex mt-3 justify-content-between">
                                <a href="/shop/items" className="btn btn-primary">Continue shopping</a>
                                <button type="button" id="checkout_btn" className="btn btn-primary">Check out</button>
                            </div>
                        </>
                    )
                }


            </Container>

        </div>
    )
}

export default MyCart;