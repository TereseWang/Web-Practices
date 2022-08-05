import { Button, Nav, NavRow, Row, Col, Card, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { create_invite, update_invite, fetch_invites, create_comment, delete_comment, fetch_comments, delete_event, fetch_events, fetch_event, fetch_user} from '../api';
import store from '../store';

function EventView({session, event_form, user_form, comments, invites}) {
  let location = useLocation()
  let history = useHistory()
  let event_id = location.pathname.split("/events/view/")[1]
  if(typeof(comments) == "undefined" || (event_form.id) == "undefined" || event_form.id != event_id) {
    fetch_events()
    fetch_event(event_id)
    fetch_comments(event_id)
    fetch_invites(event_id)
  }

  if(typeof(user_form.id) == "undefined" || user_form.id != event_form.user_id){
    fetch_events()
    fetch_user(event_form.user_id)
  }

  function deleteEvent() {
    delete_event(event_id)
    fetch_events()
    history.push("/")
  }
  function AddButtons() {
    if(session && session.user_id == user_form.id) {
      let link = "/events/edit/" + event_form.id
      return(
        <div>
        <Link to={link} className="btn mt-2 btn-lg btn-info text-light mr-2 font-weight-bold">Edit</Link>
        <Button onClick={deleteEvent} className="btn mt-2 btn-lg btn-danger text-light mr-2 font-weight-bold">Delete</Button>
        <Link to="/" className="btn btn-lg mt-2 btn-info text-light  font-weight-bold">Back</Link>
        </div>
      )
    }
    else {
      return(
        <Link to="/" className="btn btn-lg mt-2 btn-danger text-light  font-weight-bold">Back</Link>
      )
    }
  }

  function EditCommentButton({comment}) {
    function deleteComment() {
      delete_comment(comment.id, event_id)
    }

    if (session && comment.user_id == session.user_id) {
      return <Button onClick={deleteComment} className="btn mt-2 btn-danger text-light font-weight-bold">Delete</Button>
    }
    else {
      return <div></div>
    }
  }

  function ListingComments() {
    let rows = comments.map((comment) => {
      return (
        <Card fluid className="my-4">
          <Card.Body>
            <h4 className="text-secondary">{comment.user.name}</h4>
            <h3 className="">{comment.body}</h3>
            <EditCommentButton comment={comment}/>
          </Card.Body>
        </Card>
      )})
      return <div>{rows}</div>
  }

  function ListingInvites() {
    let score = new Map()
    score["yes"] = 0
    score["no"] = 0
    score["maybe"] = 0
    var your_response;
    var invite_id;
    let rows = invites.map((invite) => {
      if (invite.response == "No") {
        score["no"] = score["no"] + 1
      }
      else if(invite.response == "Yes") {
        score["yes"] = score["yes"] + 1
      }
      else {
        score["maybe"] = score["maybe"] + 1
      }

      if (invite.user_id == session.user_id) {
        your_response = invite.response;
        invite_id = invite.id;
      }
      return(
        <div>{invite.user.email} {invite.response}</div>
      )
    })

    const [response, setResponse] = useState(your_response);

    function updateInvite(ev) {
      update_invite(response, session.user_id, event_form.id, invite_id).then((data) => {
          if(data.error) {
            let action={
              type:"error/set",
              data: data.error
            }
            store.dispatch(action)
          }
          else {
            fetch_invites(event_id)
            fetch_events()
          }
      });
    }

    const [email, setEmail] = useState("");

    function containEmail(email) {
      var found = false
      for(var i = 0; i < invites.length; i++) {
        if(invites[i].user.email == email) {
          found = true;
          break
        }
      }
      return found
    }

    function createInvite(ev) {
      let new_email = email.replace(/\s+/g, '');
      if (new_email != session.email && !containEmail(new_email)) {
          create_invite(new_email, event_id).then((data) => {
              if(data.error) {
                let action={
                  type:"error/set",
                  data: data.error
                }
                store.dispatch(action)
              }
              else {
                fetch_invites(event_id)
                fetch_events()
              }
          });
      }
      else {
        setEmail("")
      }
    }

    if(session.user_id == user_form.id) {
      let link = "http://events-spa.teresewang.com/events/view/" + event_id
      return (
        <div className="h3 mt-5">
          <Form  onSubmit={createInvite} className="my-3">
            <Form.Row>
              <Col><h3>Invite</h3></Col>
              <Col xs={9}>
                <Form.Control type="text" onChange={(ev) => setEmail(ev.target.value)}
                  value={email} />
              </Col>
              <Col>
                <Button onClick={(ev) => createInvite(ev)} className="btn btn-info text-light font-weight-bold">Submit</Button>
              </Col>
            </Form.Row>
          </Form>
          <div className="text-danger my-4">Copy Link: {link}</div>
          <div>{rows}</div>
          <div className="text-info">Yes: {score["yes"]} No: {score["no"]} Maybe: {score["maybe"]} </div>
        </div>
      );
    }
    else {
      return (
        <div className="h3 mt-5">
          <Form onSubmit={updateInvite} inline>
            <div className="text-info mr-5 mt-3 my-3">Yes: {score["yes"]} No: {score["no"]} Maybe: {score["maybe"]} </div>
            <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control as="select" onChange={(ev) => setResponse(ev.target.value)} value={response}>
              <option></option>
              <option>Yes</option>
              <option>No</option>
              <option>Maybe</option>
            </Form.Control>
          </Form.Group>
          <Button onClick={(ev) => updateInvite(ev)} className="btn btn-info text-light font-weight-bold">Submit</Button>
          </Form>
          <div>{rows}</div>
        </div>
      )
    }
  }

    const [com, setCom] = useState("");

    function onSubmit(ev) {
      create_comment(com, session.user_id, event_id).then((data) => {
          if(data.error) {
            let action={
              type:"error/set",
              data: data.error
            }
            store.dispatch(action)
          }
          else {
            setCom("")
            fetch_comments(event_id)
            fetch_events()
          }
      });
    }


    if (session) {
      return(
        <div>
          <AddButtons/>
          <div class="row">
            <div class="col">
              <h1 className="display-3">{event_form.name}</h1>
              <h1 className="h4 text-secondary">Posted By: {user_form.name}</h1>
              <h1 className="h4 text-secondary">{event_form.date}</h1>
              <p className="h3 mt-2 text-dark">{event_form.description}</p>
              <ListingInvites />
              <h1 className="text-dark mt-5">Comments</h1>
              <Form  onSubmit={onSubmit} className="my-3">
                <Form.Row>
                  <Col><h3>{session.name}</h3></Col>
                  <Col xs={9}>
                    <Form.Control type="text" onChange={(ev) => setCom(ev.target.value)}
                      value={com} />
                  </Col>
                  <Col>
                    <Button onClick={(ev) => onSubmit(ev)} className="btn btn-info text-light font-weight-bold">Submit</Button>
                  </Col>
                </Form.Row>
              </Form>
              <ListingComments/>
            </div>
          </div>
        </div>
      )
    }
    else {
      return(
        <div className="display-3">
         Please Login to continue
        </div>
      )
    }
  }

function state2props({session, event_form, user_form, comments, invites}) {
  return {session, event_form, user_form, comments, invites};
}

export default connect(state2props)(EventView);
