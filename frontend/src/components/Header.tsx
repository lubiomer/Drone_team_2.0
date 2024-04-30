import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { RootState, useAppSelector } from "../redux/store";
import { getToken } from "../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';
import cartImg from '../assets/images/cart.png';

const Header = () => {
    const user = useAppSelector((state: RootState) => state.userState.user);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const accessToken = getToken();
    const navigate = useNavigate();
    const toggle = () => setIsOpen(!isOpen);
    const location = useLocation();

    const currentRoute = location.pathname;

    const onLogoutHandler = () => {
    };
    return (
        <header>
            <div className="container">
                <Navbar expand="md">
                    <NavbarBrand
                        href={
                            accessToken ? '/' : '/'
                        }>
                        <img
                            src={logoImg}
                            alt="Drone"
                            className="logo-image"
                        />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto" />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ms-auto" navbar>
                            {!accessToken && (
                                <>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/login')}>
                                            <button className="btn btn-gray">SHOP</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/login')}>
                                            <button className="btn btn-gray">EXPLORE</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/login')}>
                                            <button className="btn btn-gray">SUPPORT</button>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/')}>
                                            <img src={cartImg} alt="Cart" className="user-img" />
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={() => navigate('/login')}>Sign In</DropdownItem>
                                            <DropdownItem onClick={() => navigate('/register')}>Sign Up</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                            )}
                            {accessToken && (
                                <>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink className={currentRoute.includes('/') ? 'active' : ''} onClick={() => navigate('/')}>
                                            Dashboard
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink className={currentRoute.includes('new-simulation') ? 'active' : ''} onClick={() => navigate('/new-simulation')}>
                                            New Simulation
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={user.avatar ? user.avatar : userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </>
                            )}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        </header>
    );
}

export default Header;