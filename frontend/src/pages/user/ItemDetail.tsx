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
import { useCreateReviewMutation, useDeleteReviewMutation, useGetProductReviewQuery, useUpdateReviewMutation, useUploadReviewImgMutation } from "../../redux/api/reviewAPI";
import { getDateFormat } from "../../utils/Utils";
import { Edit2, Trash2 } from "react-feather";
import { useCreateCommentMutation, useDeleteCommentMutation, useUpdateCommentMutation } from "../../redux/api/commentAPI";
import { RootState, useAppSelector } from "../../redux/store";
import { IUser } from "../../redux/api/types";

const ItemDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentUser: IUser | null = useAppSelector((state: RootState) => state.userState.user);
    const [uploadReviewImg] = useUploadReviewImgMutation();
    const [reviewComment, setReviewComment] = useState<any[]>([]);
    const { data: item, refetch: refetchProduct, isLoading } = useGetProductQuery(id);
    const { data: reviewData, refetch: refetchReview, isLoading: reviewLoading } = useGetProductReviewQuery(id);
    const [createCart, { isLoading: cartIsLoading, isSuccess, error, isError, data }] = useCreateCartMutation();
    const [createReview] = useCreateReviewMutation();
    const [createComment] = useCreateCommentMutation();
    const [updateComment] = useUpdateCommentMutation();
    const [updateReview] = useUpdateReviewMutation();
    const [deleteReview, { isSuccess: isDeleteReviewSuccess }] = useDeleteReviewMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [reviewFile, setReviewFile] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewModal, setReviewModal] = useState(false);
    const [newComments, setNewComments] = useState<any>({});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [visibleReviewCount, setVisibleReviewCount] = useState(5);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<any>();

    const toggle = () => setReviewModal(!reviewModal);
    useEffect(() => {
        refetchProduct();
        refetchReview();
    }, []);

    useEffect(() => {
        if (reviewData && reviewData.reviews.length > 0) {
            setReviewComment(reviewData.reviews);
        }
    }, [reviewData]);

    useEffect(() => {
        // This will run if either isReviewSuccess or isDeleteReviewSuccess changes.
        if (isDeleteReviewSuccess) {
            refetchReview();
        }
    }, [isDeleteReviewSuccess, refetchReview]);

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

    const onSubmit: SubmitHandler<any> = async (data) => {
        if (reviewFile) {
            data.reviewImg = reviewFile;
        }
        data.product = id;
        const { image, ...restReviewData } = data;
        console.log(restReviewData);
        try {
            if (selectedReview) {
                await updateReview({ id: selectedReview._id, review: restReviewData }).unwrap();
            } else {
                await createReview(restReviewData).unwrap();
            }
            setSelectedReview(null);
            reset();
            toggle();
            refetchReview()

        } catch (error) { }

    };

    const handleReviewImageChange = async (e: any) => {
        e.preventDefault();

        // Check if files array is present and has at least one file.
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            try {
                const uploadResult = await uploadReviewImg({ reviewFile: file }).unwrap();
                setReviewFile(uploadResult.imageUri)
            } catch (error) {
                // Handle the error case here
                console.error('An error occurred during image upload:', error);
            }
        } else {
            // Handle the case where no file was selected
            console.error('No file selected.');
        }
    };

    const handleReviewDeleteClick = async (reviewId: string) => {
        console.log(reviewId)
        await deleteReview(reviewId);
    }

    const handleCommentSubmit = async (reviewId: string) => {
        const commentContent = newComments[editingCommentId || reviewId];
        if (!commentContent || !commentContent.trim()) {
            toast.error("Comment cannot be empty.", { position: "top-right" });
            return;
        }
        if (editingCommentId) {
            const updateCommentData = {
                comment: commentContent,
            }
            await updateComment({ id: editingCommentId, comment: updateCommentData })

        } else {
            const commentData = {
                review: reviewId,
                comment: commentContent,
                product: id,
            }
            await createComment(commentData).unwrap();
        }

        // Clear the textarea and reset editing state
        setNewComments((prevComments: any) => ({ ...prevComments, [reviewId]: '', [editingCommentId || '']: '' }));
        setEditingCommentId(null);

        refetchReview();
    };

    const handleUpdateComment = (comment: any) => {
        // Logic to handle comment update
        console.log('Updating comment:', comment);
        setEditingCommentId(comment._id); // Save the id of comment being edited
        setNewComments((prevComments: any) => ({
            ...prevComments,
            [comment._id]: comment.comment // Set textarea to the comment's content
        }));
    }

    const handleDeleteComment = async (commentId: string) => {
        await deleteComment(commentId);
        refetchReview();
    }

    const handleUpdateReviewClick = async (review: any) => {
        setSelectedReview(review);
        setValue('content', review.content);
        toggle();
    }

    return (
        <div className={`main-view ${reviewData?.reviews?.length > 0 ? 'drone-background-item-detail' : 'drone-background'}`}>
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
                                                            <Label for="content">Comment:</Label>
                                                            <textarea
                                                                className={`form-control ${classnames({ 'is-invalid': errors.content })}`}
                                                                id="content"
                                                                {...register('content', { required: true })}
                                                            ></textarea>
                                                            {errors.content && <small className="text-danger">Comment is required.</small>}
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
                                                                            if (selectedReview && selectedReview.reviewImg) {
                                                                                return true;
                                                                            }
                                                                            if (files.length === 0) return 'Image is required.';
                                                                            const pattern = /image-*/;
                                                                            if (!pattern.test(files[0].type)) {
                                                                                return 'Only image files are allowed.';
                                                                            }
                                                                            return true;
                                                                        }
                                                                    },
                                                                })}
                                                                onChange={handleReviewImageChange}
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
                                {!reviewLoading && (
                                    reviewComment.length > 0 ? (
                                        <>
                                            {reviewComment.slice(0, visibleReviewCount).map((review: any, index: any) => {
                                                return (
                                                    <div className="mb-4" key={index}>
                                                        <div className="row">
                                                            <div className="col-md-8">
                                                                <div className='d-flex justify-content-start align-items-center mb-1 text-white'>
                                                                    <img className='me-1 user-img' src={review.user?.avatar || userImg} alt="" />
                                                                    <div className='profile-user-info'>
                                                                        <h6 className='mb-0'>{review?.user.username}</h6>
                                                                        <small className='text-white'>{getDateFormat(review?.updatedAt)}</small>
                                                                    </div>
                                                                </div>
                                                                <CardText className="text-white">{review?.content}</CardText>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="my-1">
                                                                    <img src={review.reviewImg || backgroundImg} alt="" className='review-img-fluid rounded mb-3' />
                                                                </div>
                                                                {currentUser?._id === review?.user._id && (
                                                                    <div className="my-1">
                                                                        <button onClick={() => handleUpdateReviewClick(review)} className="btn btn-primary btn-sm mx-1">
                                                                            <Edit2 size={20} />
                                                                        </button>
                                                                        <button onClick={() => handleReviewDeleteClick(review._id)} className="btn btn-danger btn-sm mx-1">
                                                                            <Trash2 size={20} />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>

                                                        <Row className='d-flex justify-content-start align-items-center flex-wrap pb-1 review-actions '>
                                                            <Col className='d-flex justify-content-between justify-content-sm-start mb-2' sm='6'>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='avatar-group ms-1'>
                                                                        {review.uniqueCommentUsers.map((user: any, cindex: any) => {
                                                                            return (
                                                                                <div key={`${cindex}_user`} className="avatar pull-up">
                                                                                    <Fragment>
                                                                                        <img
                                                                                            className=''
                                                                                            src={user?.avatar || userImg}
                                                                                            id={`user_${user?.username}`}
                                                                                            alt=""
                                                                                            style={{ height: "30px", width: "30px" }}
                                                                                        />
                                                                                        <UncontrolledTooltip
                                                                                            target={`user_${user?.username}`}
                                                                                            placement='top'
                                                                                        >
                                                                                            {user?.username}
                                                                                        </UncontrolledTooltip>
                                                                                    </Fragment>
                                                                                </div>
                                                                            )
                                                                        })}

                                                                    </div>
                                                                    <a href='/' className='text-nowrap ms-3' onClick={e => e.preventDefault()}>
                                                                        <span className="text-white">+ {review?.commentCounts} comments</span>
                                                                    </a>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        {review.comments.length > 0 && (
                                                            <div className="mb-1 text-white">
                                                                <div className="mb-1">
                                                                    Comments
                                                                </div>
                                                                {review.comments.map((comment: any, rcindex: any) => {
                                                                    return (
                                                                        <div key={`${rcindex}_rcuser`} className='d-flex align-items-start mb-3'>
                                                                            <img className='me-1 user-img' src={comment.userDetail?.avatar || userImg} alt="User" />
                                                                            <div className='profile-user-info w-100'>
                                                                                <div className='d-flex align-items-center justify-content-between'>
                                                                                    <h6 className='mb-0'>{comment.userDetail?.username}</h6>
                                                                                    {currentUser?._id === comment?.user && (
                                                                                        <div className="my-1">
                                                                                            <Edit2
                                                                                                size={22}
                                                                                                className='icon me-2'
                                                                                                onClick={() => handleUpdateComment(comment)}
                                                                                                style={{
                                                                                                    cursor: 'pointer',
                                                                                                    border: '1px solid #fff',
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                    backgroundColor: '#007bff' // This sets the background color. Change to your desired color.
                                                                                                }}
                                                                                            />
                                                                                            <Trash2
                                                                                                size={22}
                                                                                                className='icon'
                                                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                                                style={{
                                                                                                    cursor: 'pointer',
                                                                                                    border: '1px solid #fff',
                                                                                                    borderRadius: '5px',
                                                                                                    padding: '5px',
                                                                                                    backgroundColor: '#dc3545' // This sets the background color. Change to your desired color.
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    )}

                                                                                </div>
                                                                                <small>{comment.comment}</small>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}


                                                        <div className='form-label-group my-2'>
                                                            <Label className='form-check-label' htmlFor={`add-comment-${index}`}>
                                                                Add Comment
                                                            </Label>
                                                            <textarea
                                                                id={`add-comment-${index}`}
                                                                className="form-control"
                                                                placeholder={editingCommentId ? 'Edit Comment' : 'Add Comment'}
                                                                value={newComments[editingCommentId || review._id] || ''}
                                                                onChange={(e) =>
                                                                    setNewComments((prevComments: any) => ({
                                                                        ...prevComments,
                                                                        [editingCommentId || review._id]: e.target.value
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                        <Button
                                                            color='primary'
                                                            size='sm'
                                                            onClick={() => handleCommentSubmit(review._id)}
                                                        >
                                                            {editingCommentId ? 'Update Comment' : 'Post Comment'}
                                                        </Button>
                                                        <hr className="custom-hr" />
                                                    </div>
                                                )
                                            })}
                                            {reviewComment.length > visibleReviewCount && (
                                                <Button
                                                    color='primary'
                                                    size='sm'
                                                    className="my-2"
                                                    onClick={() => setVisibleReviewCount(visibleReviewCount + 5)}
                                                >
                                                    Load More
                                                </Button>
                                            )}
                                        </>

                                    ) : (
                                        <div className="text-white">
                                            No reviews yet. Be the first to review.
                                        </div>
                                    )
                                )}
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </div>

    )
}

export default ItemDetail;