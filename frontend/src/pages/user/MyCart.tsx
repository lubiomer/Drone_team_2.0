/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable array-callback-return */
import { Col, Container, Row } from "reactstrap";
import { useCheckoutCartMutation, useDeleteCartMutation, useGetMyCartsQuery } from "../../redux/api/cartAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Key, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const MyCart = () => {
    const { data: mycarts, refetch: refetchMyCart, isLoading } = useGetMyCartsQuery(undefined);
    const [deleteCart] = useDeleteCartMutation();
    const [checkoutCart, { isLoading: checkoutIsLoading, isSuccess, error, isError, data }] = useCheckoutCartMutation();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [checkedItems, setCheckedItems] = useState<any>({});

    useEffect(() => {
        if (mycarts) {
            setCartItems(mycarts);
        }
        refetchMyCart();
    }, [mycarts, refetchMyCart]);

    const handleQuantityChange = (cartId: string, newQuantity: number): void => {
        if (newQuantity < 1) return;
        const updatedCartItems = cartItems.map((item) =>
            item._id === cartId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
    };

    const handleDelete = (cartId: string): void => {
        const updatedCartItems = cartItems.filter((item) => item._id !== cartId);
        setCartItems(updatedCartItems);
        deleteCart(cartId);
    };

    const handleCheckboxChange = (cartId: string, quantity: number) => {
        setCheckedItems((prevState: { [x: string]: any; }) => ({
            ...prevState,
            [cartId]: prevState[cartId] ? undefined : quantity // Toggle check/uncheck status
        }));
    };

    const handleCheckout = () => {
        const checkedCartItemsArray = cartItems.filter(cart => checkedItems[cart._id]).map(cart => ({
            cart: cart._id,
            name: cart.product?.name,
            unitPrice: cart.product?.price,
            quantity: parseFloat(cart.quantity),
            totalPrice: parseFloat(cart.quantity) * parseFloat(cart.product?.price),
            product: cart.product?._id,
            user: cart.user?._id,
        }));
        if (checkedCartItemsArray.length > 0) {
            console.log(checkedCartItemsArray);
            checkoutCart(checkedCartItemsArray);
        }

    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            refetchMyCart();
        }
        if (isError) {

            if (Array.isArray((error as any).data.error)) {
                (error as any).data.error.forEach((el: any) =>
                    toast.error(el.message, {
                        position: 'top-right',
                    })
                );
            } else {
                const errorMsg = (error as any).data && (error as any).data.message ? (error as any).data.message : (error as any).data;
                toast.error(errorMsg, {
                    position: 'top-right',
                });
            }
        }
    }, [checkoutIsLoading]);

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
                                cartItems.length > 0 ?
                                    cartItems.map((cart: any, index: Key | null | undefined) => (
                                        <Row key={index}>
                                            <Col>
                                                <div className="d-flex my-1 mycart-item-detail">
                                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '5%', fontSize: '24px' }}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id={`checkbox-${cart._id}`} value="" onChange={() => handleCheckboxChange(cart._id, cart.quantity)}
                                                                checked={!!checkedItems[cart._id]} />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '35%', fontWeight: '600' }}>
                                                        {cart.product?.name}
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '20%', fontWeight: '600' }}>
                                                        {cart.product?.price?.toFixed(2)}
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center" style={{ width: '15%' }}>
                                                        <div className="cart_quantity_button d-flex justify-content-center align-items-center">
                                                            <button className="cart_quantity_up" onClick={() => handleQuantityChange(cart._id, cart.quantity + 1)}> + </button>
                                                            <input className="cart_quantity_input" type="text" name="quantity" value={cart.quantity} autoComplete="off" size={2} readOnly />
                                                            <button className="cart_quantity_down" onClick={() => handleQuantityChange(cart._id, cart.quantity - 1)}> - </button>
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '15%', fontWeight: '600' }} className="d-flex justify-content-center align-items-center">
                                                        {(parseFloat(cart.quantity) * parseFloat(cart.product?.price)).toFixed(2)}
                                                    </div>
                                                    <div style={{ width: '10%' }}>
                                                        <button className="cart-delete btn btn-primary btn-sm" onClick={() => handleDelete(cart._id)}>
                                                            <svg className="svg-inline--fa fa-xmark" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                                <path fill="currentColor" d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )) : (
                                        <div className="text-center my-4">There is no data</div>
                                    )
                            }
                            <div className="d-flex mt-3 justify-content-between">
                                <Link to="/shop/items" className="btn btn-primary">Continue shopping</Link>
                                {cartItems.length > 0 && (
                                    <button type="button" id="checkout_btn" className="btn btn-primary" onClick={handleCheckout}>Check out</button>
                                )}
                            </div>
                        </>
                    )
                }


            </Container>

        </div>
    )
}

export default MyCart;