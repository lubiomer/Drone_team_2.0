import { Container, Row, Col } from 'reactstrap';

const AdminShop = () => {
    return (
        <div className="main-view drone-background">
            <Container>
                <Row className="my-1">
                    <Col>
                        <a href="/admin/shop/create-product" className="btn btn-primary">Create Product</a>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdminShop;