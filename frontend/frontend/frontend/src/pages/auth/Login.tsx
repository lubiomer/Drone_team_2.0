/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Label, Button, Container } from 'reactstrap';
import { LoginUserRequest } from '../../redux/api/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { useLoginUserMutation } from '../../redux/api/authAPI';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getGoogleUrl, getHomeRouteForLoggedInUser, getUserData } from '../../utils/Utils';
import googleImg from '../../assets/images/google.svg';
// import facebookImg from '../../assets/images/facebook.png';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginUserRequest>();

    const navigate = useNavigate();
    const location = useLocation();

    // 👇 API Login Mutation
    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();
    const from = ((location.state as any)?.from.pathname as string) || '/';
    
    useEffect(() => {
        if (isSuccess) {
            const user = getUserData();
            toast.success('You successfully logged in');
            
            navigate(getHomeRouteForLoggedInUser(user.role))
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

    const onSubmit: SubmitHandler<LoginUserRequest> = (data) => {
        console.log(data)
        loginUser(data);
    };

    return (
        <div className="main-view drone-background">
            <Container>
                <div className="auth-panel">
                    <Form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
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
                            <Label>Password</Label>
                            <input
                                className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                type="password"
                                id="password"
                                {...register('password', { required: true })}
                            />
                            {errors.password && <small className="text-danger">Password is required.</small>}
                        </div>
                        <div className="mt-4">
                            <Button color="orange" className="btn-block" type="submit">
                                Submit
                            </Button>
                        </div>
                        <div className="text-separator">Or</div>
                        <div className="mt-3 text-center">
                            <a href={getGoogleUrl(from)} className='btn btn-gray d-flex align-items-center justify-content-center'>
                                <img className='mx-2' src={googleImg} style={{ height: '25px' }} alt='google' />
                                Continue with Google
                            </a>
                        </div>
                        {/* <div className="mt-3 text-center">
                            <a href="#" className='btn btn-water d-flex align-items-center justify-content-center'>
                                <img className='mx-2' src={facebookImg} style={{ height: '25px' }} alt='google' />
                                Continue with Facebook
                            </a>
                        </div> */}
                        <div className="mt-3 text-center">
                            <p>
                                New to our platform?
                                <Link to="/register" className="primary-link mx-2">
                                    <span>Create an account</span>
                                </Link>{' '}
                            </p>
                        </div>
                        
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default Login;