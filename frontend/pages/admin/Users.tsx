/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    Badge,
    Button,
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import { toast } from 'react-toastify';
import { ChevronDown, MoreVertical, Edit, Trash2 } from 'react-feather';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { IUser } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/types';
import { useDeleteUserMutation, useGetUsersQuery } from '../../../../../OneDrive/שולחן העבודה/תואר מדעי המחשב/ו. תואר במדעי המחשב - שנה ג - סמסטר ב/ג. פיתוח אפליקציות מתקדם/ב. מטלות/drone-typescript-node-mongodb-v8/drone-typescript-node-mongodb-v9/frontend/src/redux/api/userAPI';

const Users = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState(false);
    const { data: users, refetch } = useGetUsersQuery();
    const [deleteUser, { isLoading, isError, error, isSuccess }] = useDeleteUserMutation();

    useEffect(() => {
        refetch()
    }, [])
    useEffect(() => {
        if (isSuccess) {
            toast.success('User deleted successfully');
            navigate('/admin/users');
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
    const handleDeleteUser = (id: string) => {
        deleteUser(id);
        setModalVisibility(false);
    };

    const renderRole = (row: IUser) => {
        const getBadgeColor = (role: string): string => {
            switch (role.toLowerCase()) {
                case 'admin':
                    return 'info'; // This will make the badge color blue
                case 'user':
                    return 'danger'; // This will also be blue, assuming you want primary users to have the same color as admin
                default:
                    return 'danger'; // This will make the badge color green
            }
        };

        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={getBadgeColor(row.role)} className="px-3 py-2" pill>
                    {row.role}
                </Badge>
            </span>
        );
    };


    const columns = () => [
        {
            name: 'Username',
            maxwidth: '100px',
            selector: (row: { username: any; }) => `${row.username}`,
            sortable: true
        },
        {
            name: 'Firstname',
            maxwidth: '100px',
            selector: (row: { firstname: any; }) => `${row.firstname}`,
            sortable: true
        },
        {
            name: 'Lastname',
            maxwidth: '100px',
            selector: (row: { lastname: any; }) => `${row.lastname}`,
            sortable: true
        },
        {
            name: 'Email',
            maxwidth: '100px',
            selector: (row: { email: any; }) => `${row.email}`,
            sortable: true
        },
        {
            name: 'Role',
            cell: (row: IUser) => renderRole(row),
            ignoreRowClick: true,
        },
        {
            name: 'Action',
            width: '120px',
            cell: (row: IUser) => {

                return (
                    <>
                        {row.role !== 'admin' && (
                            <>
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="div" className="btn btn-sm">
                                        <MoreVertical size={14} className="cursor-pointer action-btn" />
                                    </DropdownToggle>
                                    <DropdownMenu end container="body">
                                        <DropdownItem className="w-100" onClick={() => navigate(`/admin/profile-review/${row._id}`)}>
                                            <Edit size={14} className="mr-50" />
                                            <span className="align-middle mx-2">Update</span>
                                        </DropdownItem>
                                        <DropdownItem className="w-100" onClick={() => setModalVisibility(!modalVisibility)}>
                                            <Trash2 size={14} className="mr-50" />
                                            <span className="align-middle mx-2">Delete</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <Modal isOpen={modalVisibility} toggle={() => setModalVisibility(!modalVisibility)}>
                                    <ModalHeader toggle={() => setModalVisibility(!modalVisibility)}>Confirm Delete?</ModalHeader>
                                    <ModalBody>Are you sure you want to delete?</ModalBody>
                                    <ModalFooter className="justify-content-start">
                                        <Button color="danger" onClick={() => handleDeleteUser(row._id)}>
                                            Yes
                                        </Button>
                                        <Button color="secondary" onClick={() => setModalVisibility(!modalVisibility)} outline>
                                            No
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </>
                        )}
                    </>
                );
            }
        }
    ];
    return (
        <div className="main-view drone-background">
            <Container>
                <DataTable
                    title="Users"
                    data={users as IUser[]}
                    responsive
                    className="react-dataTable"
                    noHeader
                    pagination
                    paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                    columns={columns()}
                    sortIcon={<ChevronDown />}
                />
            </Container>

        </div>
    )
}

export default Users;