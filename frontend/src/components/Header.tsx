/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { RootState, useAppSelector } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';
import cartImg from '../assets/images/cart.png';
import { toast } from 'react-toastify';
import { useLogoutUserMutation } from "../redux/api/authAPI";
import { IUser } from "../redux/api/types";

const Header = () => {
    const user: IUser | null = useAppSelector((state: RootState) => state.userState.user);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();
    const navigate = useNavigate();
    const toggle = () => setIsOpen(!isOpen);

    const mobileToggle = () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setIsOpen(!isOpen);
        };
    };

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            if (Array.isArray((error as any).data.error)) {
                (error as any).data.error.forEach((el: any) =>
                    toast.error(el.message, {
                        position: 'top-right',
                    })
                );
            } else {
                toast.error((error as any).data.message, {
                    position: 'top-right',
                });
            }
        }
    }, [isLoading]);
    const onLogoutHandler = () => {
        logoutUser();
    };
    return (
        <header>
            <div className="container">
                <Navbar expand="md">
                    <NavbarBrand
                        href={
                            user ? user?.role === 'admin' ? '/admin/dashboard' : '/profile' : '/'
                        }>
                        <img
                            src={logoImg}
                            alt="Drone"
                            className="logo-image"
                        />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} className="ms-auto" />
                    <Collapse isOpen={isOpen} navbar>
                        {!user && (
                            <>
                                <Nav className="me-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => { navigate('/shop'); mobileToggle(); }}>
                                            <button className="btn btn-gray">SHOP</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/explore')}>
                                            <button className="btn btn-gray">EXPLORE</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/support')}>
                                            <button className="btn btn-gray">SUPPORT</button>
                                        </NavLink>
                                    </NavItem>
                                </Nav><Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/mycart')}>
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
                                </Nav>
                            </>
                        )}
                        {user && user?.role === 'user' && (
                            <>
                                <Nav className="me-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/shop')}>
                                            <button className="btn btn-gray">SHOP</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/explore')}>
                                            <button className="btn btn-gray">EXPLORE</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/support')}>
                                            <button className="btn btn-gray">SUPPORT</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/purchase')}>
                                            <button className="btn btn-gray">PURCHASE</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/flight')}>
                                            <button className="btn btn-gray">LAST FILGHT</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/myreview')}>
                                            <button className="btn btn-gray">MY REVIEW</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/news')}>
                                            <button className="btn btn-gray">NEWS</button>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <Nav className="ms-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/mycart')}>
                                            <img src={cartImg} alt="Cart" className="user-img" />
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={user?.avatar || userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem tag={Link} to="/profile">
                                                <span className="align-middle">PROFILE</span>
                                            </DropdownItem>
                                            <DropdownItem onClick={onLogoutHandler}>Log Out</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                        {user && user?.role === 'admin' && (
                            <>
                                <Nav className="me-auto" navbar>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/admin/shop')}>
                                            <button className="btn btn-gray">SHOP</button>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem className="nav-item-responsive">
                                        <NavLink onClick={() => navigate('/admin/users')}>
                                            <button className="btn btn-gray">USERS</button>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <Nav className="ms-auto" navbar>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            <img src={userImg} alt="user" className="user-img" />
                                        </DropdownToggle>
                                        <DropdownMenu end>
                                            <DropdownItem onClick={onLogoutHandler}>Sign Out</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>
                        )}
                    </Collapse>
                </Navbar>
            </div>
        </header>
    );
}

export default Header;
