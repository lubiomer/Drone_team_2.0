/* eslint-disable react-hooks/exhaustive-deps */
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Label, Row } from "reactstrap";
import classnames from 'classnames';
import { LastFlightRequest } from "../../redux/api/types";
import { useGetPurchasesQuery } from "../../redux/api/purchaseAPI";
import { useEffect } from "react";
import { useCreateFlightMutation } from "../../redux/api/flightAPI";
import { toast } from 'react-toastify';

const LastFlight = () => {
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful }
    } = useForm<LastFlightRequest>();
    const { data: purchases, refetch: refetchPurchase, isLoading } = useGetPurchasesQuery({});

    const [createFlight, { isLoading: flightLoading, isError, error, isSuccess }] = useCreateFlightMutation();

    const onSubmit: SubmitHandler<LastFlightRequest> = (data) => {
        console.log(data);
        createFlight(data);
    };

    useEffect(() => {
        refetchPurchase()
    }, []);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('The Flight data created successfully!');
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
    }, [flightLoading]);


    console.log(purchases, '-----------')

    return (
        <div className="main-view drone-background">
            <Container>
                <Row className="d-flex justify-content-center">
                    <Col md={8}>
                        <Card>
                            <CardHeader className='py-3'>
                                <h5 className="mb-0 text-light">Last Flight</h5>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='mb-2'>
                                        <Label>Date</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.date })}`}
                                            type="date"
                                            id="flightDate"
                                            {...register('date', { required: true })}
                                        />
                                        {errors.date && <small className="text-danger">date is required.</small>}
                                    </div>
                                    {!isLoading && (
                                        <div className='mb-2'>
                                            <Label>Item</Label>
                                            <select
                                                className={`form-control ${classnames({ 'is-invalid': errors.item })}`}
                                                id="item"
                                                {...register('item', { required: true })}
                                            >
                                                {/* Add options here */}
                                                <option value="">Select an item</option>
                                                {purchases.map((purchase: any, index: any) => (
                                                    <option key={index} value={purchase.product.name}>{purchase.product.name}</option>
                                                ))}
                                                {/* etc. */}
                                            </select>
                                            {errors.item && <small className="text-danger">item is required.</small>}
                                        </div>
                                    )}

                                    <div className='mb-2'>
                                        <Label>Duration</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.date })}`}
                                            type="text"
                                            id="duration"
                                            {...register('duration', { required: true })}
                                        />
                                        {errors.duration && <small className="text-danger">duration is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Location</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.location })}`}
                                            type="text"
                                            id="location"
                                            {...register('location', { required: true })}
                                        />
                                        {errors.location && <small className="text-danger">location is required.</small>}
                                    </div>
                                    <div className='mb-2'>
                                        <Label>Comment</Label>
                                        <textarea
                                            className={`form-control ${classnames({ 'is-invalid': errors.comment })}`}
                                            id="comment"
                                            rows={5}
                                            {...register('comment', { required: true })}
                                        ></textarea>
                                        {errors.comment && <small className="text-danger">comment is required.</small>}
                                    </div>
                                    <div className="mt-4">
                                        <Button color="orange" className="btn-block" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LastFlight;