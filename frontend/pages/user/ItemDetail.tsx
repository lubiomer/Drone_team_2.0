/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { useGetProductQuery } from "../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/productAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateCartMutation } from "../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/cartAPI";
import { toast } from 'react-toastify';

const ItemDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: item, refetch: refetchProduct, isLoading } = useGetProductQuery(id);
    const [createCart, { isLoading: cartIsLoading, isSuccess, error, isError, data }] = useCreateCartMutation();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        refetchProduct();
    }, []);

    const handleDecrement = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 0));
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleCart = () => {
        const data = {
            'quantity': quantity,
            'product': id,
        }
        createCart(data);
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/shop/items');
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
    }, [cartIsLoading]);

    return (
        <div className="main-view drone-background">
            <Container>
                <Row className="my-1">
                    <Col>
                        <a href="/shop/items" className="btn btn-primary">Continue Shopping</a>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <Card>
                            <CardHeader>
                                <h5 className="mb-0 text-light">Product</h5>
                            </CardHeader>
                            <CardBody>
                                {!isLoading ? (
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-3 d-flex justify-content-center">
                                                <label htmlFor="productImg" className="form-label d-block text-start text-dark" />
                                                <img className="img-thumbnail" src={item.productImg} style={{ maxHeight: '300px' }} alt="Preview" />
                                            </div>
                                        </Col>
                                        <Col md={6} className="text-white text-center">
                                            <div className="mb-3" style={{ backgroundColor: '#17181873', padding: '10px 5px', borderRadius: '5px' }}>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="mb-3" style={{ backgroundColor: '#17181873', padding: '10px 5px', borderRadius: '5px' }}>
                                                <span>{item.detail}</span>
                                            </div>
                                            <div className="mb-3" style={{ backgroundColor: '#17181873', padding: '10px 5px', borderRadius: '5px' }}>
                                                <span>Stock: {item.stock}</span>
                                            </div>
                                            <div className="mb-3" style={{ backgroundColor: '#17181873', padding: '10px 5px', borderRadius: '5px' }}>
                                                <span>Price: {item.price}</span>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <button className="w-100 btn btn-primary btn-sm" id="add_to_cart" style={{ height: '38px' }} onClick={handleCart}>Add to Cart</button>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="input-group mb-3">
                                                        <div className="input-group-prepend">
                                                            <button className="btn btn-outline-secondary btn-minus" type="button" onClick={handleDecrement}>-</button>
                                                        </div>
                                                        <input type="number" className="form-control quantity text-center" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-secondary btn-plus" type="button" onClick={handleIncrement}>+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                ) : (<FullScreenLoader />)}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>

    )
}

export default ItemDetail;