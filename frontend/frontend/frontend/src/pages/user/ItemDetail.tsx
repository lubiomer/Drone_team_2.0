/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import { Button, Card, CardBody, CardHeader, CardText, Col, Container, Label, Row, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import { useGetProductQuery } from "../../redux/api/productAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useCreateCartMutation } from "../../redux/api/cartAPI";
import { toast } from 'react-toastify';
import userImg from '../../assets/images/user.png';
import backgroundImg from '../../assets/images/background.jpg';
import classnames from 'classnames'
import { useForm, SubmitHandler } from "react-hook-form";

const ItemDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: item, refetch: refetchProduct, isLoading } = useGetProductQuery(id);
    const [createCart, { isLoading: cartIsLoading, isSuccess, error, isError, data }] = useCreateCartMutation();
    const [quantity, setQuantity] = useState(1);
    const [reviewModal, setReviewModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<any>();

    const toggle = () => setReviewModal(!reviewModal);

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

    const handleReview = () => {
        toggle();
    }

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
        reset();
        toggle();
    };

    return (
        <div className="main-view drone-background-item-detail">
            <Container>
                <Row className="my-1">
                    <Col>
                        <Link to="/shop/items" className="btn btn-primary">Continue Shopping</Link>
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
                                                    <button className="w-100 btn btn-primary btn-sm" style={{ height: '38px' }} onClick={handleCart}>Add to Cart</button>
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
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <button className="w-100 btn btn-success btn-sm" style={{ height: '38px' }} onClick={handleReview}>Review</button>
                                                </div>
                                            </div>
                                            <Modal isOpen={reviewModal} toggle={toggle}>
                                                <ModalHeader toggle={toggle}>Review</ModalHeader>
                                                <Form onSubmit={handleSubmit(onSubmit)}>
                                                    <ModalBody>
                                                        <div className="mb-2">
                                                            <Label for="comment">Comment:</Label>
                                                            <textarea
                                                                className={`form-control ${classnames({ 'is-invalid': errors.comment })}`}
                                                                id="comment"
                                                                {...register('comment', { required: true })}
                                                            ></textarea>
                                                            {errors.comment && <small className="text-danger">Comment is required.</small>}
                                                        </div>
                                                        <div className="mb-2">
                                                            <Label for="image">Upload Image:</Label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                id="image"
                                                                accept="image/*"
                                                                {...register('image', {
                                                                    validate: {
                                                                        isImage: (files: FileList) => {
                                                                            if (files.length === 0) return 'Image is required.';
                                                                            const pattern = /image-*/;
                                                                            if (!pattern.test(files[0].type)) {
                                                                                return 'Only image files are allowed.';
                                                                            }
                                                                            return true;
                                                                        }
                                                                    },
                                                                })}
                                                            />
                                                            {errors.image && <small className="text-danger">{String(errors.image.message)}</small>}
                                                        </div>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="primary" type="submit">
                                                            Submit
                                                        </Button>{' '}
                                                        <Button color="secondary" onClick={() => {
                                                            reset();
                                                            toggle();
                                                        }}>
                                                            Cancel
                                                        </Button>
                                                    </ModalFooter>
                                                </Form>
                                            </Modal>
                                        </Col>
                                    </Row>
                                ) : (<FullScreenLoader />)}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col md={12}>
                        <Card className='review-item'>
                            <CardHeader>
                                <h5 className="mb-0 text-light">Review</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="mb-4">
                                    <div className='d-flex justify-content-start align-items-center mb-1 text-white'>
                                        <img className='me-1 user-img' src={userImg} alt="" />
                                        <div className='profile-user-info'>
                                            <h6 className='mb-0'>Leeanna Alvord</h6>
                                            <small className='text-white'>12 Dec 2018 at 1:16 AM</small>
                                        </div>
                                    </div>
                                    <CardText className="text-white">Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.</CardText>
                                    <div className="my-1">
                                        <img src={backgroundImg} alt="" className='review-img-fluid rounded mb-3' />
                                    </div>
                                    <Row className='d-flex justify-content-start align-items-center flex-wrap pb-1 review-actions '>
                                        <Col className='d-flex justify-content-between justify-content-sm-start mb-2' sm='6'>
                                            <div className='d-flex align-items-center'>
                                                <div className='avatar-group ms-1'>
                                                    {/* {post.likedUsers.map(user => {
                                                return ( */}
                                                    <div className="avatar pull-up">
                                                        <Fragment>
                                                            <img
                                                                className=''
                                                                src={userImg}
                                                                id={'user'.toLowerCase().split(' ').join('-')}
                                                                alt=""
                                                                style={{ height: "30px", width: "30px" }}
                                                            />
                                                            <UncontrolledTooltip
                                                                target={'user'.toLowerCase().split(' ').join('-')}
                                                                placement='top'
                                                            >
                                                                user1
                                                            </UncontrolledTooltip>
                                                        </Fragment>
                                                    </div>
                                                    <div className="avatar pull-up">
                                                        <Fragment>
                                                            <img
                                                                className=''
                                                                src={userImg}
                                                                id={'user1'.toLowerCase().split(' ').join('-')}
                                                                alt=""
                                                                style={{ height: "30px", width: "30px" }}
                                                            />
                                                            <UncontrolledTooltip
                                                                target={'user1'.toLowerCase().split(' ').join('-')}
                                                                placement='top'
                                                            >
                                                                {'user'}
                                                            </UncontrolledTooltip>
                                                        </Fragment>
                                                    </div>
                                                    <div className="avatar pull-up">
                                                        <Fragment>
                                                            <img
                                                                className=''
                                                                src={userImg}
                                                                id={'user2'.toLowerCase().split(' ').join('-')}
                                                                alt=""
                                                                style={{ height: "30px", width: "30px" }}
                                                            />
                                                            <UncontrolledTooltip
                                                                target={'user2'.toLowerCase().split(' ').join('-')}
                                                                placement='top'
                                                            >
                                                                Kidd
                                                            </UncontrolledTooltip>
                                                        </Fragment>
                                                        {/* ) */}
                                                        {/* })} */}
                                                    </div>
                                                </div>
                                                <a href='/' className='text-muted text-nowrap ms-3' onClick={e => e.preventDefault()}>
                                                    <span className="text-white">+ 20 more</span>
                                                </a>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="mb-1 text-white">
                                        <div className="mb-1">
                                            Comments
                                        </div>
                                        {/* {post.detailedComments.map(comment => ( */}
                                        <div className='d-flex align-items-start mb-3'>
                                            <img className='me-1 user-img' src={userImg} alt="" />
                                            <div className='profile-user-info w-100'>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <h6 className='mb-0'>Kitty Allanson</h6>
                                                </div>
                                                <small>Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.</small>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-start mb-3'>
                                            <img className='me-1 user-img' src={userImg} alt="" />
                                            <div className='profile-user-info w-100'>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <h6 className='mb-0'>Kitty Allanson</h6>
                                                </div>
                                                <small>Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.</small>
                                            </div>
                                        </div>
                                        {/* ))} */}
                                    </div>

                                    <div className='form-label-group my-2'>
                                        <Label className='form-check-label' for={`add-comment`}>
                                            Add Comment
                                        </Label>
                                        <textarea id={`add-comment`} className="form-control" placeholder='Add Comment'></textarea>
                                    </div>
                                    <Button color='primary' size='sm'>
                                        Post Comment
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </div>

    )
}

export default ItemDetail;