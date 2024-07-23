/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    Badge,
    Container} from 'reactstrap';
import { ChevronDown } from 'react-feather';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { IUser } from '../../redux/api/types';
import { useGetUsersQuery } from '../../redux/api/userAPI';

const Users = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: users, refetch } = useGetUsersQuery();

    useEffect(() => {
        refetch()
    }, []);


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