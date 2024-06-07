/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Label, Button, Container, Card, CardBody, CardHeader } from 'reactstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ContactRequest } from '../../redux/api/types';
import classnames from 'classnames';
import { useSupportSendMutation } from '../../redux/api/supportAPI';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Support = () => {

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful }
    } = useForm<ContactRequest>();

    const [supportSend, { isLoading, isError, error, isSuccess }] = useSupportSendMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success('You successfully logged in');
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

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const onSubmit: SubmitHandler<ContactRequest> = (data) => {
        console.log(data);
        supportSend(data);
    };

    return (
        <div className="main-view drone-background">
            <Container>
                <div className='board-panel'>
                    <div className='support-form'>
                        <Card>
                            <CardHeader className='py-3'>
                                <h5 className="mb-0 text-white">Contact</h5>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='mb-3'>
                                        <Label>Email</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                            type="email"
                                            id="email"
                                            {...register('email', { required: true })}
                                        />
                                        {errors.email && <small className="text-danger">Email is required.</small>}
                                    </div>
                                    <div className='mb-3'>
                                        <Label>Content</Label>
                                        <textarea
                                            className={`form-control ${classnames({ 'is-invalid': errors.content })}`}
                                            rows={5}
                                            id="content"
                                            {...register('content', { required: true })}
                                        ></textarea>
                                        {errors.content && <small className="text-danger">Content is required.</small>}
                                    </div>
                                    <div className="mt-4">
                                        <Button color="orange" className="btn-block" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>

                </div>

            </Container>
        </div>
    )
}

export default Support;