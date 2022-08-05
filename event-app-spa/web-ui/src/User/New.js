import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import store from '../store';
import { create_user, fetch_users, api_login, fetch_reason } from '../api';

//referenced from lecture code SPA Structure from Nat Tuck CS4550 Northeastern University
function UsersNew() {
  let history = useHistory();
  const [user, setUser] = useState({
    name: "", pass1: "", pass2: "",
  });

  function onSubmit(ev) {
    ev.preventDefault();
    let data = pick(user, ['name', 'email', 'password']);
    create_user(data).then((data) => {
        if(data.error) {
          let action={
            type:"error/set",
            data: data.error
          }
          store.dispatch(action)
        }
        else {
          fetch_users();
          api_login(user['email'], user['password'])
          history.push("/")
        }
    });
  }

  function check_pass(p1, p2) {
    // This is for user experience only,
    // validation logic goes on the server.
    if (p1 !== p2) {
      return "Passwords don't match.";
    }

    if (p1.length < 8) {
      return "Password too short.";
    }

    return "";
  }

  function update(field, ev) {
    let u1 = Object.assign({}, user);
    u1[field] = ev.target.value;
    u1.password = u1.pass1;
    u1.pass_msg = check_pass(u1.pass1, u1.pass2);
    setUser(u1);
  }

  function updatePhoto(ev) {
    let p1 = Object.assign({}, user);
    p1["photo"] = ev.target.files[0];
    setUser(p1);
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <h1 className="mt-5">Register Acount</h1>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text"
                      onChange={
                        (ev) => update("name", ev)}
          value={user.name} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="text"
                      onChange={
                        (ev) => update("email", ev)}
          value={user.email} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password"
          onChange={
            (ev) => update("pass1", ev)}
          value={user.pass1} />
        <p>{user.pass_msg}</p>
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password"
          onChange={
            (ev) => update("pass2", ev)}
          value={user.pass2} />
      </Form.Group>
      <Button variant="primary" type="submit" className="h3 font-weight-bold"
              disabled={user.pass_msg !== ""}>
        Save
      </Button>
    </Form>
  );
}

function state2props(_state) {
  return {};
}

export default connect(state2props)(UsersNew);
