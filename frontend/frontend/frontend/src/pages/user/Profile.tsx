/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Container, Form, Label, Row } from "reactstrap";
import userImg from '../../assets/images/user.png';
import itemImg from '../../assets/images/item.jpg';
import { getMeAPI } from "../../redux/api/getMeAPI";
import { ProfileRequest } from "../../redux/api/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useGetProfileQuery, useUpdateUserMutation, useUploadProfileImgMutation } from "../../redux/api/userAPI";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Edit2 } from "react-feather";

const Profile = () => {
    const { data: user } = getMeAPI.endpoints.getMe.useQuery(null);
    const { data: profile, isLoading: profileLoading, refetch: profileRefetch } = useGetProfileQuery({});

    const [uploadProfileImg] = useUploadProfileImgMutation();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileRequest>();

    useEffect(() => {
        profileRefetch();
    }, []);

    const [updateUser, { isLoading, isSuccess, error, isError, data }] = useUpdateUserMutation();

    const [avatarFile, setAvatarFile] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fields: (keyof ProfileRequest)[] = ['username', 'firstname', 'lastname', 'email'];
            fields.forEach((field) => {
                setValue(field, user[field]);
            });
            if (user.avatar) {
                setAvatarFile(user.avatar);
            }
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
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
                console.log(error);
                toast.error(errorMsg, {
                    position: 'top-right',
                });
            }
        }
    }, [isLoading]);

    const onSubmit: SubmitHandler<ProfileRequest> = (data) => {
        console.log(data)
        updateUser(data);
    };

    const handleUserImage = (): void => {
        const fileInput: HTMLInputElement | null = document.getElementById('updateUserImage') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const manageUserImage = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const input = e.target as HTMLInputElement;
        const file: File | undefined = input.files ? input.files[0] : undefined;

        if (file) {
            const reader: FileReader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result: any = event.target?.result;
                if (typeof result === 'string') {
                    setAvatarFile(result);
                }
            };

            reader.readAsDataURL(file);

            // Assuming uploadProfileAvatar returns a promise with a specific type
            const result: any = await uploadProfileImg(file);

            const avatarData: string = result.data.updateAvatar.avatar;
            setAvatarFile(avatarData);
        }
    };

    return (
        <div className="main-view drone-background">
            {profileLoading ? (<FullScreenLoader />) : (
                <Container>
                    <Row>
                        <Col md={4}>
                            <div className="drone-item" style={{ minHeight: '450px' }}>
                                <div className="mb-3 d-flex justify-content-center">
                                    <div className="position-relative">
                                        <img
                                            src={avatarFile || userImg}
                                            alt="Profile"
                                            className="profile-img"
                                        />
                                        <label htmlFor="updateUserImage" className="position-absolute avatar-style">
                                            <button type="button" className="avatar-button" onClick={handleUserImage}>
                                                <Edit2 size={14} />
                                            </button>
                                        </label>
                                        <input
                                            type="file"
                                            id="updateUserImage"
                                            className="visually-hidden"
                                            onChange={manageUserImage}
                                            accept="image/*"
                                        />
                                    </div>
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
                                    <div className="col-md-6">
                                        {profile?.orders.length > 0 ? (
                                            <p className="text-start">You have the items of {profile.orders.length}</p>
                                        ) : (<p className="text-start">You don't have the items</p>)}
                                    </div>
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
                                    <div className="col-md-6">
                                        {profile.orders.length > 0 ? (
                                            <>
                                                <p className="text-start">Name: {profile.orders[0].products[0].name}</p>
                                                <p className="text-start">Price: {profile.orders[0].products[0].price}</p>
                                            </>
                                        ) : (
                                            <p className="text-start"></p>
                                        )}

                                    </div>
                                </Row>
                            </div>
                            <div className="drone-item mt-3">
                                <div className="mb-4">
                                    <span>Last Flight</span>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        {profile.lastFlight.length > 0 ? (
                                            <>
                                                <p className="text-start">Name: {profile.lastFlight[0].name}</p>
                                                <p className="text-start">Date: {new Date(profile.lastFlight[0].date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                                                <p className="text-start">Duration: {profile.lastFlight[0].duration}</p>
                                                <p className="text-start">Location: {profile.lastFlight[0].location}</p>
                                            </>
                                        ) : (
                                            <p className="text-start">No flight information available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}

        </div>
    )
}

export default Profile;