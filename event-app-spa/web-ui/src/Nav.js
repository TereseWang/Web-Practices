import { Nav, Navbar, Row, Col, Form, Button ,Container, Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { useState } from 'react';
import { fetch_events, api_login, fetch_user } from './api';
import { useHistory } from 'react-router-dom';

function LoginForm() {
  let history = useHistory();
  const [email, setName] = useState("");
  const [pass, setPass] = useState("");

  function on_submit(ev) {
    ev.preventDefault();
    api_login(email, pass);
    history.push("/")
  }

  return (
    <Form onSubmit={on_submit} inline>
      <Row>
        <Col>
          <div className="h5 font-weight-bold text-dark">Email:</div>
          <Form.Control name="email"
                        type="text"
                        onChange={(ev) => setName(ev.target.value)}
                        value={email}/>
        </Col>
      </Row>
      <Row className="ml-2 my-2">
        <Col>
          <div className="h5 font-weight-bold text-dark">Password:</div>
          <Form.Control name="password"
                        type="password"
                        onChange={(ev) => setPass(ev.target.value)}
                        value={pass}/>
          <Button className="h3 font-weight-bold ml-2 mr-2" type="submit">Logins </Button>
        </Col>
      </Row>
      <div className="mt-4">
        <Redirect to="/users/new">Register</Redirect>
      </div>
    </Form>
  );
}

let SessionInfo = connect()(({session, current_user,  dispatch}) => {
  let history = useHistory();
  function logout() {
    dispatch({type: 'session/clear'});
    history.push('/')
  }
  let link = "/users/view/" + session.user_id
  return (
      <Row className="h4 ml-1 font-weight-bold">
        <div className="my-2">{session.name}</div>
        <Button className="btn-danger h3 ml-2 font-weight-bold" onClick={logout}>Logout</Button>
        <Redirect to={link}>View Profile</Redirect>
      </Row>
  );
});

function LOI({session, current_user}) {
  if (session) {
    return <SessionInfo session={session} current_user={current_user} />;
  }
  else {
    return <LoginForm />;
  }
}

const LoginOrInfo = connect(
  ({session, current_user}) => ({session, current_user}))(LOI);

function Link({to, children}) {
  return (
    <Nav.Item>
      <NavLink to={to} exact
        className="nav-link font-weight-bold text-dark"
        activeClassName="active">
        {children}
      </NavLink>
    </Nav.Item>
  );
}

function Redirect({to, children}) {
  return (
    <Nav.Item>
      <NavLink to={to} exact
        className="btn font-weight-bold text-primary ml-2"
        activeClassName="active">
        {children}
      </NavLink>
    </Nav.Item>
  );
}

function AppNav({error}) {
  let error_row = null;

  if (error) {
    error_row = (
      <Row>
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      </Row>
    );
  }
  function Register({session}) {
      return(
        <Row>
          <Nav variant="tabs" defaultActiveKey="/users/new">
            <Link to="/">HomePage</Link>
          </Nav>
      </Row>
    )
  }

  const LoginInRegister = connect(
    ({session}) => ({session}))(Register);

  return(
    <div>
      <h1 className="font-weight-bold text-light display-2">HWZone</h1>
      <LoginOrInfo />
      { error_row }
      <LoginInRegister/>
    </div>
  );
}
export default connect(({error}) => ({error}))(AppNav);
