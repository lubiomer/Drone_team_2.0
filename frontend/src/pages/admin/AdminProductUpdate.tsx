/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, CardBody, CardHeader, Col, Container, Form, Label, Row } from "reactstrap";
import { useForm, SubmitHandler } from 'react-hook-form';
import classnames from 'classnames';
import { IProductRequest } from "../../redux/api/types";
import uploadImg from "../../assets/images/drone.jpg";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useGetProductQuery, useUpdateProductMutation, useUploadProductImgMutation } from "../../redux/api/productAPI";
import { useNavigate, useParams } from "react-router-dom";

type ProductType = {
    name: string;
    detail: string;
    stock: number;
    price: number;
    productImg?: string;
};

const AdminProductUpdate = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, refetch: refetchProduct } = useGetProductQuery(id);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [productFile, setProductFile] = useState<string | null>(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<IProductRequest>();

    const [uploadProductImg] = useUploadProductImgMutation();
    const [updateProduct, { isLoading, isSuccess, error, isError, data }] = useUpdateProductMutation();

    useEffect(() => {
        refetchProduct();
    }, []);

    useEffect(() => {
        if (product) {
            const fields: Array<keyof ProductType> = ['name', 'detail', 'stock', 'price', 'productImg'];
            fields.forEach((field) => setValue(field, product[field]));
            if (product.productImg) {
                setImagePreviewUrl(product.productImg);
            }
        }
    }, [product]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/admin/shop');
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
    }, [isLoading]);

    const onSubmit: SubmitHandler<IProductRequest> = (data) => {
        if (productFile) {
            data.productImg = productFile;
        }

        updateProduct({ id: id, product: data });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Check if files array is present and has at least one file.
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Ensure that the file is of Blob type (File inherits from Blob).
            if (file instanceof Blob) {
                let reader = new FileReader();

                reader.onloadend = () => {
                    // Here, we are assuming setImagePreviewUrl is a function that sets the state
                    // Make sure this function is correctly defined in your component
                    setImagePreviewUrl(reader.result as string);
                };

                reader.readAsDataURL(file);
                try {
                    const uploadResult = await uploadProductImg({ productFile: file }).unwrap();
                    setProductFile(uploadResult.imageUri)
                } catch (error) {
                    // Handle the error case here
                    console.error('An error occurred during image upload:', error);
                }
            } else {
                // Handle the error case where the file is not a Blob
                console.error('The provided file is not of type Blob.');
            }
        } else {
            // Handle the case where no file was selected
            console.error('No file selected.');
        }
    };


    return (
        <div className="main-view drone-background">
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                <h5 className="mb-0 text-light">Update Product</h5>
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
                                                <textarea
                                                    className={`form-control ${classnames({ 'is-invalid': errors.detail })}`}
                                                    id="password"
                                                    {...register('detail', { required: true })}
                                                ></textarea>
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

export default AdminProductUpdate;