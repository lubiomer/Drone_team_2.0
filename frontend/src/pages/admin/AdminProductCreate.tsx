import { Button, Card, CardBody, CardHeader, Col, Container, Form, Label, Row } from "reactstrap";
import { useForm, SubmitHandler } from 'react-hook-form';
import classnames from 'classnames';
import { IProductRequest } from "../../redux/api/types";
import uploadImg from "../../assets/images/drone.jpg";
import { useState } from "react";

const AdminProductCreate = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<IProductRequest>();

    const onSubmit: SubmitHandler<IProductRequest> = (data) => {
        console.log(data);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (e.target.files) {
            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="main-view drone-background">
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h5 className="mb-0 text-light">Create Product</h5>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md="6">
                                            <div className="mb-3">
                                                <Label>Product Image</Label>
                                                <input
                                                    type="file"
                                                    id="productImg"
                                                    className="form-control"
                                                    name="productImg"
                                                    onChange={handleImageChange}
                                                    accept=".png, .jpg, .jpeg"
                                                    style={{ display: 'none' }} // hide the input
                                                />
                                                <label htmlFor="productImg" className="d-flex" style={{ cursor: 'pointer' }}>
                                                    <img
                                                        id="product-preview"
                                                        src={imagePreviewUrl ? imagePreviewUrl : uploadImg}
                                                        alt="Preview"
                                                        width="200px"
                                                        height="200px"
                                                    />
                                                </label>
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className='mb-2'>
                                                <Label>Product Name</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.name })}`}
                                                    type="text"
                                                    id="name"
                                                    {...register('name', { required: true })}
                                                />
                                                {errors.name && <small className="text-danger">Product Name is required.</small>}
                                            </div>
                                            <div className='mb-2'>
                                                <Label>Product Detail</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.detail })}`}
                                                    type="text"
                                                    id="password"
                                                    {...register('detail', { required: true })}
                                                />
                                                {errors.detail && <small className="text-danger">Product Detail is required.</small>}
                                            </div>
                                            <div className='mb-2'>
                                                <Label>Product Stock</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.stock })}`}
                                                    type="number"
                                                    id="stock"
                                                    {...register('stock', { required: true })}
                                                />
                                                {errors.stock && <small className="text-danger">Product Stock is required.</small>}
                                            </div>
                                            <div className='mb-2'>
                                                <Label>Product Price</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.price })}`}
                                                    type="number"
                                                    id="password"
                                                    {...register('price', { required: true })}
                                                />
                                                {errors.price && <small className="text-danger">Product Price is required.</small>}
                                            </div>
                                            <div className="mt-4">
                                                <Button color="orange" className="btn-block" type="submit">
                                                    Submit
                                                </Button>
                                            </div>

                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdminProductCreate;