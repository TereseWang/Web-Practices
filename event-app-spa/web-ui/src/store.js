import { createStore, combineReducers } from 'redux';
//referenced the fetch Structure that store the value of the web from lecture
//code SPA Structure from Nat Tuck CS4550 Northeastern University

function users(state = [], action) {
  switch (action.type) {
    case 'users/set':
      return action.data;
    default:
      return state;
  }
}

function user_form(state = {}, action) {
  switch (action.type) {
    case 'user_form/set':
      return action.data;
    default:
      return state;
  }
}

function events(state=[], action) {
  switch (action.type) {
    case 'events/set':
      return action.data;
    default:
      return state;
    }
}

function event_form(state={}, action) {
  switch (action.type) {
    case 'event_form/set':
      return action.data;
    default:
      return state;
    }
}

function session(state = load_session(), action) {
  switch (action.type) {
    case 'session/set':
      save_session(action.data);
      return action.data;
    case 'session/clear':
      delete_session();
      return null;
    default:
      return state;
  }
}

function save_session(sess) {
  let session = Object.assign({}, sess, {time: Date.now()});
  localStorage.setItem("session", JSON.stringify(session));
}

function delete_session() {
  localStorage.removeItem("session");
}

function load_session() {
  let session = localStorage.getItem("session");
  if (!session) {
    return null;
  }
  session = JSON.parse(session);
  let age = Date.now() - session.time;
  let hours = 60*60*1000;
  if (age < 24 * hours) {
    return session;
  }
  else {
    return null;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case 'error/set':
      return action.data;
    case 'session/set':
      return null;
    default:
      return state;
  }
}

function comments(state=[], action) {
  switch (action.type) {
    case 'comments/set':
      return action.data;
    default:
      return state;
  }
}

function invites(state=[], action) {
  switch (action.type) {
    case 'invites/set':
      return action.data;
    default:
      return state;
  }
}

function root_reducer(state, action) {
    let reducer = combineReducers({
        invites, comments, events, event_form,
        users, user_form, session, error,
    });
    return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;
