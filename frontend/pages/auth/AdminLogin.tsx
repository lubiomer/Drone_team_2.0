/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Label, Button, Container } from 'reactstrap';
import { LoginUserRequest } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { useAdminLoginUserMutation } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/authAPI';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { getHomeRouteForLoggedInUser, getUserData } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/utils/Utils';

const AdminLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginUserRequest>();

    const navigate = useNavigate();

    // 👇 API Login Mutation
    const [adminLoginUser, { isLoading, isError, error, isSuccess }] = useAdminLoginUserMutation();
    
    useEffect(() => {
        if (isSuccess) {
            const user = getUserData();
            toast.success('Admin successfully logged in');
            
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
        adminLoginUser(data);
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
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default AdminLogin;