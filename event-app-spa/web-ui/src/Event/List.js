import { Button, Nav, NavRow, Row, Col, Card, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { Link, useHistory, NavLink, useLocation } from 'react-router-dom';
import { fetch_invites, fetch_user, fetch_event, fetch_events} from '../api';
import Carousel from 'react-bootstrap/Carousel';

function EventList({events, session}) {
  let history = useHistory()
  let location = useLocation();
  function AddNewEventButton() {
    if (session) {
      return(
        <Redirect to="/events/new" className="btn btn-lg font-weight-bold btn-info ml-3">
          New Event
        </Redirect>
      )
    }
    else {
      return(
        <br></br>
      )
    }
  }

  function ListingArticles({session, event_form}) {
    let rows = events.map((event) => {
      const link = "/events/view/"+ event.id

      function contain_email() {
        for(var i = 0; i < event.invites.length; i++) {
          if(event.invites[i].user_id == session.user_id) {
            return true
            break
          }
        }
        return false
      }

      if (session) {
        if (event.user_id == session.user_id || contain_email()) {
          return (
            <Card fluid className="my-4">
              <Card.Body>
                <h1 className="">{event.name}</h1>
                <p>{event.description}</p>
                <Link to={link}  className="text-danger">Read More</Link>
              </Card.Body>
            </Card>
          )
        }
        else {
          return <div></div>
        }
      }
      else {
        return <div></div>
      }
    })

    return(
      <div className="ml-3">
        {rows}
      </div>
    )
  }

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

  const UpdatingArticles = connect(
      ({session, event_form}) => ({session, event_form}))(ListingArticles);

  return (
    <div>
      <Row className="mt-3">
        <Col>
          <AddNewEventButton />
        </Col>
      </Row>
      <UpdatingArticles />
    </div>
  );
}

function state2props({events, session}) {
  return { events, session};
}

export default connect(state2props)(EventList);
