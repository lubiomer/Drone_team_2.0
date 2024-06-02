import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

const Shop = () => {
    return (
        <div className="main-view drone-background">
            <Container>
                <Row>
                    <Col md="12">
                        <Link to="/shop/items">
                            <div className="drone-shop">
                                <div className="mb-4">
                                    <span>Drones</span>
                                </div>
                            </div>
                        </Link>{' '}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Shop;