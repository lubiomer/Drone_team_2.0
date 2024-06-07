import { useEffect } from 'react';
import { Container } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useGetPurchasesQuery } from '../../redux/api/purchaseAPI';
import { ChevronDown } from 'react-feather';
import { format } from 'date-fns';

// Define a type for the Purchase structure based on the expected data
type PurchaseType = {
    product: {
        name: string;
        productImg: string;
    };
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    createdAt: string; // You might want to define a more specific date type
};

const Purchase = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: purchases, refetch } = useGetPurchasesQuery({});

    useEffect(() => {
        refetch();
    }, [refetch]); // Add refetch to dependency array to follow eslint recommendations

    const renderProductImg = (row: PurchaseType) => {
        return (
            <img src={row.product.productImg} style={{ height: '35px', width: 'auto' }} alt='' />
        );
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return format(date, 'MM/dd/yyyy');
    };

    // Define the columns configuration with the correct types
    const columns = () => [
        {
            name: '',
            cell: (row: PurchaseType) => renderProductImg(row)
        },
        {
            name: 'Product Name',
            selector: (row: PurchaseType) => row.product.name,
            sortable: true,
        },
        {
            name: 'Product Price',
            selector: (row: PurchaseType) => `${row.unitPrice}`,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (row: PurchaseType) => `${row.quantity}`,
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: (row: PurchaseType) => `${row.totalPrice}`,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: (row: PurchaseType) => formatDate(row.createdAt),
            sortable: false,
        },
    ];

    return (
        <div className="main-view drone-background">
            <Container>
                <DataTable
                    title="Purchases"
                    data={purchases ?? []} // Handle potential undefined purchases
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
    );
};

export default Purchase;
