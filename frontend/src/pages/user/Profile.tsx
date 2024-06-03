/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Container, Form, Label, Row } from "reactstrap";
import userImg from '../../assets/images/user.png';
import itemImg from '../../assets/images/item.jpg';
import { getMeAPI } from "../../redux/api/getMeAPI";
import { ProfileRequest } from "../../redux/api/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import classnames from 'classnames';

const Profile = () => {
    const { data: user } = getMeAPI.endpoints.getMe.useQuery(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileRequest>();

    console.log(user)

    useEffect(() => {
        if (user) {
            const fields: (keyof ProfileRequest)[] = ['username', 'firstname', 'lastname', 'email'];
            fields.forEach((field) => {
                setValue(field, user[field]);
            });
        }
    }, [user]);

    const onSubmit: SubmitHandler<ProfileRequest> = (data) => {

    };

    return (
        <div className="main-view drone-background">
            <Container>
                <Row>
                    <Col md={4}>
                        <div className="drone-item" style={{ minHeight: '450px' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <img src={userImg} style={{ width: '120px', height: '120px' }} alt="User Avatar" />
                            </div>
                            <Row>
                                <Col md={12}>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='mb-2'>
                                            <Label>Username</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                                type="text"
                                                id="username"
                                                {...register('username', { required: true })}
                                            />
                                            {errors.username && <small className="text-danger">Username is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Firstname</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.firstname })}`}
                                                type="text"
                                                id="firstname"
                                                {...register('firstname', { required: true })}
                                            />
                                            {errors.firstname && <small className="text-danger">Firstname is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Lastname</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.lastname })}`}
                                                type="text"
                                                id="lastname"
                                                {...register('lastname', { required: true })}
                                            />
                                            {errors.lastname && <small className="text-danger">Lastname is required.</small>}
                                        </div>
                                        <div className='mb-2'>
                                            <Label>Email</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                                type="email"
                                                id="email"
                                                {...register('email', { required: true })}
                                            />
                                            {errors.email && <small className="text-danger">Email is required.</small>}
                                        </div>
                                        <div className="my-4">
                                            <Button color="orange" className="btn-sm btn-block" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="drone-item mb-3">
                            <div className="mb-4">
                                <span>Your Items</span>
                            </div>
                            <Row>
                                <div className="col-md-6">
                                    <img className="img-fluid" style={{ borderRadius: "10px" }} src={itemImg} alt="..." />
                                </div>
                                {/* <div className="col-md-6">
                                    <% if (user.orders.length > 0) { %>
                                    <p className="text-start">You have the items of <%= user.orders.length %></p>
                                <% } else { %>
                                    <p className="text-start">You don't have the items</p>
                                <% }  %>
                                </div> */}
                            </Row>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="drone-item mb-3">
                            <div className="mb-4">
                                <span>Last purchase</span>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <img className="img-fluid" style={{ borderRadius: "10px" }} src={itemImg} alt="..." />
                                </Col>
                                {/* <div className="col-md-6">
                                    <% if (user.orders.length > 0) { %>
                                    <p className="text-start">Name: <%= user.orders[0].products[0].name %></p>
                                    <p className="text-start">Price: <%= user.orders[0].products[0].price %></p>
                                <% } else { %>
                                    <p className="text-start"></p>
                                <% }  %>

                                </div> */}
                            </Row>
                        </div>
                        <div className="drone-item mt-3">
                            <div className="mb-4">
                                <span>Last Flight</span>
                            </div>
                            {/* <div className="row">
                                <div className="col-md-12">
                                    <% if (user.lastFlight.length > 0) { %>
                                    <p className="text-start">Name: <%= user.lastFlight[0].name %></p>
                                    <p className="text-start">Date: <%= user.lastFlight[0].date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) %></p>
                                    <p className="text-start">Duration: <%= user.lastFlight[0].duration %></p>
                                    <p className="text-start">Location: <%= user.lastFlight[0].location %></p>
                                <% } else { %>
                                    <p className="text-start"></p>
                                <% }  %>
                                </div>
                            </div> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Profile;