import { Nav, NavRow, Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import pick from 'lodash/pick';
import store from '../store';
import { api_login, fetch_reason, fetch_user } from '../api';

function UsersView() {
  let history = useHistory();

  function Redirect({to, children}) {
    return (
      <Nav.Item>
        <NavLink to={to} exact
          className="btn btn-lg font-weight-bold text-light btn-info"
          activeClassName="active">
          {children}
        </NavLink>
      </Nav.Item>
    );
  }

  function View({session}) {
        return(
        <Row>
          <Col>
            <h1 className="mt-3 my-3">My Profile</h1>
            <h3>Name: {session.name}</h3>
            <h3>Email: {session.email}</h3>
            <h3>Reason For Using This Website: {session.reason}</h3>
            <Redirect to="/users/edit">Edit Profile</Redirect>
          </Col>
        </Row>
      )
  }

  function OtherUserView({current_user}) {
    return <h1></h1>
  }

  function LoginView({session, current_user}) {
    if (session) {
      return <View session={session}/>
    }
    else {
      return <OtherUserView current_user={current_user}/>
    }
  }

  const LoginInRegister = connect(
    ({session, current_user}) => ({session, current_user}))(LoginView);

  return (
    <div>
      <LoginInRegister />
    </div>
  );
}

function state2props(_state) {
  return {};
}

export default connect(state2props)(UsersView);
