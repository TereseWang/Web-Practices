import { Row, Col, Form, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react';
import { useHistory, NavLink, useLocation } from 'react-router-dom';
import pick from 'lodash/pick';
import store from '../store';
import { update_event , fetch_events, fetch_users, fetch_user, fetch_event} from '../api';
import Datetime from 'react-datetime';
import moment from 'moment';

function EventEdit({session, user_form, event_form}) {
  let history = useHistory();
  let location = useLocation();
  let event_id = location.pathname.split("/events/edit/")[1]

  if(typeof(event_form.id) == "undefined" || event_form.id != event_id) {
    fetch_events()
    fetch_event(event_id)
  }

  if(typeof(event_form.id) == "undefined" || user_form.id != event_form.user_id){
    fetch_events()
    fetch_user(event_form.user_id)
  }

  const [event, setEvent] = useState({
    user_id: "", name: event_form.name, description: event_form.description, date: event_form.date, id: event_form.id
  })

  function onSubmit(ev) {
    ev.preventDefault();
    event['user_id'] = session.user_id;
    let data = pick(event, ['user_id', 'name', 'description', 'date', 'id']);
    update_event(data).then((data) => {
        if(data.error) {
          let action={
            type:"error/set",
            data: data.error
          }
          store.dispatch(action)
        }
        else {
          fetch_events()
          fetch_users()
          fetch_event(event_id)
          history.push("/events/view/" + event_id)
        }
    });
  }

  function update(field, ev) {
    let u1 = Object.assign({}, event);
    u1[field] = ev.target.value;
    setEvent(u1);
  }

  function updateDate(date) {
    let newEvent = Object.assign({}, event);
    newEvent["date"] = date;
    setEvent(newEvent);
  }

  if(session) {
  return(
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <h1 className="mt-5">Edit Event</h1>
          <Form.Label>Event Name</Form.Label>
          <Form.Control type="text"
                        onChange={
                          (ev) => update("name", ev)}
            value={event.name} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Date</Form.Label>
            <br></br>
            <Datetime
              value={event.date}
              onChange={(value) => updateDate(value)}
              dateFormat="YYYY-MM-DD"
              timeFormat="HH:mm:SS"
              className="mb-4 max-width-300"
              inputProps={{
              value: event.date
              ? moment(event.date).format('MMMM D, YYYY   h:mm a')
              : '',
          }}
        />
        </Form.Group>
        <Form.Group>
          <Form.Label>Event Description</Form.Label>
          <Form.Control type="text"
                        onChange={
                          (ev) => update("description", ev)}
            value={event.description} />
        </Form.Group>
        <Button variant="primary" type="submit" className="h3 font-weight-bold mr-3">
          Save
        </Button>
      </Form>
    );
  }
  else {
    return <h1>Log in to edit</h1>
  }
}

function state2props({session, user_form, event_form}) {
  return {session, user_form, event_form};
}

export default connect(state2props)(EventEdit);
