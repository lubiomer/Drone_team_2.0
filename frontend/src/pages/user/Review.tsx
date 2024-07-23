/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardBody, CardHeader, CardText, Col, Container, Row } from "reactstrap";
import FullScreenLoader from "../../components/FullScreenLoader";
import { useGetMyReviewsQuery } from "../../redux/api/reviewAPI";
import { useState, useEffect } from "react";
import userImg from '../../assets/images/user.png';
import backgroundImg from '../../assets/images/background.jpg';
import { getDateFormat } from "../../utils/Utils";

const Review = () => {
    const { data: reviews, isLoading, refetch } = useGetMyReviewsQuery({});
    const [myReviews, setMyReviews] = useState<any[]>([]);
    const [visibleReviewCount, setVisibleReviewCount] = useState(5);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (reviews && reviews.length > 0) {
            setMyReviews(reviews);
        }
    }, [reviews]);

    return (
        <>
            {isLoading ? (<FullScreenLoader />) : (
                <div className="main-view drone-background">
                    <Container>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader>
                                        <h5 className="mb-0 text-light">My Reviews</h5>
                                    </CardHeader>
                                    <CardBody>
                                        {!isLoading && (
                                            myReviews.length > 0 ? (
                                                <>
                                                    {myReviews.slice(0, visibleReviewCount).map((review: any, index: any) => {
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
                                                                    </div>
                                                                </div>
                                                                
                                                                <hr className="custom-hr" />
                                                            </div>
                                                        )
                                                    })}
                                                    {myReviews.length > visibleReviewCount && (
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
            )}
        </>
    )
}

export default Review;