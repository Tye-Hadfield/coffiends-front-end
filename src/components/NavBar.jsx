import React, { useContext } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Navbar, Button, NavItem, Nav, Container, Col } from "reactstrap";

import StateContext from "../utils/store";

const NavBar = () => {
  const { store, dispatch } = useContext(StateContext);
  const { loggedInUser, buttonToggle } = store;

  const handleLogout = () => {
    axios.get(`${process.env.REACT_APP_BACK_END_URL}/users/logout`, { credentials: "include" })
      .then(() => dispatch({ type: "setLoggedInUser", data: null }))
      .catch(() => dispatch({ type: "setFlashMessage", data: "Unable to logout" }));
    
    dispatch({ type: "setButtonToggle", data: "login" });
  };

  const loggedOut = (
    <>
      {buttonToggle === "signup" ? (
        <NavItem className="mr-3">
          <Link to="/">
            <Button outline className="button-color" >LOG IN</Button>
          </Link>
        </NavItem>
      ) : (
        <NavItem className="mr-3">
          <Link to="/register">
            <Button outline className="button-color" >SIGN UP</Button>
          </Link>
        </NavItem>
      )}
    </>
  );
  const activeSession = (
    <>
      <NavItem className="mr-3">
        <Link to="/logout">
          <Button outline onClick={handleLogout} className="button-color" size="sm" >
            LOG OUT
          </Button>
        </Link>
      </NavItem>
    </>
  );
  const userNav = (
    <>
      <NavItem  className="mr-3">
        <Link to="/orders">
          <Button outline size="sm" className="button-color">ORDERS</Button>
        </Link>
      </NavItem>
      <NavItem className="mr-3">
        <Link to="/user/edit">
          <Button outline size="sm" className="button-color" >EDIT PROFILE</Button>
        </Link>
      </NavItem>
    </>
  );
  const cafeNav = (
    <>
      <NavItem className="mr-3">
        <Link to="/menu">
          <Button outline className="button-color" size="sm">MENU</Button>
        </Link>
      </NavItem>
    </>
  );
  const adminNav = (
    <>
      <NavItem className="mr-3">
        <Link to="/admin/cafe/new">
          <Button outline className="button-color" size="sm">ADD CAFE</Button>
        </Link>
      </NavItem>
      <NavItem className="mr-3">
        <Link to="/admin/coffee/new">
          <Button outline className="button-color" size="sm">ADD COFFEE</Button>
        </Link>
      </NavItem>
    </>
  );

  return (
    <Container fluid="true" className="Remove-padding-margin">
      <Navbar className="nav-color">
        <Col sm={{size: 2}}>
          {loggedInUser ? (
            <Link to="/home">
              <img src={`${process.env.REACT_APP_BACK_END_URL}/images/newLogo.svg`} alt="Logo" className="logo-styles" />
            </Link>) : (
            <Link to="/">
              <img src={`${process.env.REACT_APP_BACK_END_URL}/images/newLogo.svg`} alt="Logo" className="logo-styles" />
            </Link>)}
        </Col>
        <Col  sm={{size: 3}}>
          <div>
            <div className="header"><b>Co<span>ff</span>ien<span>d</span>s</b></div>
          </div>
        </Col>
        <Nav>
          <Col sm={{ size: 'auto'}} className="d-flex flex-nowrap">
          {!loggedInUser ? loggedOut : <></>}
          {loggedInUser && loggedInUser.role === "user" ? userNav : <></>}
          {loggedInUser && loggedInUser.role === "cafe" ? cafeNav : <></>}
          {loggedInUser && loggedInUser.role === "admin" ? adminNav : <></>}
          {loggedInUser ? activeSession : <></>}
          </Col>
        </Nav>
      </Navbar>
    </Container>
  );
};

export default NavBar;
