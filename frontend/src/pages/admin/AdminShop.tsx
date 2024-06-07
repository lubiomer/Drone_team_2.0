/* eslint-disable react-hooks/exhaustive-deps */
import { Key, useEffect, useState } from 'react';
import { Container, Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { useGetProductsQuery } from '../../redux/api/productAPI';
import FullScreenLoader from '../../components/FullScreenLoader';

const AdminShop = () => {
    const [page, setPage] = useState<number>(1);;
    const queryParams = {
        page: page
    }
    const { data: products, isLoading, refetch } = useGetProductsQuery(queryParams);
    
    useEffect(() => {
        refetch();
    }, []);

    // ** Handles pagination
    const handlePageChange = (val: any) => {
        if (val === 'next') {
            setPage(page + 1);
        } else if (val === 'prev') {
            setPage(page - 1);
        } else {
            setPage(val);
        }
    };

    // ** Render pages
    const renderPageItems = () => {
        const arrLength: number = products && products.products.length !== 0 ? Number(products.totalCount) / products.filteredCount : 1;

        return new Array(Math.trunc(arrLength)).fill(undefined).map((item, index) => {
            return (
                <PaginationItem key={index} active={page === index + 1} onClick={() => handlePageChange(index + 1)}>
                    <PaginationLink href="/" onClick={(e) => e.preventDefault()}>
                        {index + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    // ** handle next page click
    const handleNext = () => {
        if (page !== Number(products.totalCount) / products.filteredCount) {
            handlePageChange('next');
        }
    };

    return (
        <div className="main-view drone-background">
            <Container>
                <Row className="my-1">
                    <Col>
                        <a href="/admin/shop/create-product" className="btn btn-primary">Create Product</a>
                    </Col>
                </Row>
                <Row className='my-3'>
                    {isLoading ? (<FullScreenLoader />) :
                        <>
                            {products?.products.map((product: any, index: Key | null | undefined) => (
                                <Col key={index} lg={4} sm={6} className="mb-4">
                                    <div className="drone-item">
                                        <div className="mb-3">
                                            <span>{product.name}</span>
                                        </div>
                                        <Row>
                                            <Col md={6}>
                                                <img
                                                    style={{ borderRadius: '10px', minHeight: '150px', maxHeight: '200px' }}
                                                    src={product.productImg}
                                                    alt={product.name}
                                                    className="img-fluid"
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <p className="text-start">Name: {product.name}</p>
                                                <p className="text-start">Price: {product.price}</p>
                                                <p className="text-start">Stock: {product.stock}</p>
                                                <div className="mt-3 text-end">
                                                    <a href={`/admin/shop/${product._id}`} className="btn btn-gray">Edit &gt;</a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            ))}
                            <Pagination className="d-flex justify-content-center product-pagination mt-4">
                                <PaginationItem disabled={page === 1} className="prev-item" onClick={() => (page !== 1 ? handlePageChange('prev') : null)}>
                                    <PaginationLink href="/" onClick={(e) => e.preventDefault()}></PaginationLink>
                                </PaginationItem>
                                {renderPageItems()}
                                <PaginationItem
                                    className="next-item"
                                    onClick={() => handleNext()}
                                    disabled={page === Number(products.totalCount) / products.filteredCount}>
                                    <PaginationLink href="/" onClick={(e) => e.preventDefault()}></PaginationLink>
                                </PaginationItem>
                            </Pagination>
                        </>
                    }
                </Row>
            </Container>
        </div>
    )
}

export default AdminShop;