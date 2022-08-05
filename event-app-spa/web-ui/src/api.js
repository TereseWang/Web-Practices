import store from './store';

//referenced from lecture code SPA Structure from Nat Tuck CS4550 Northeastern University
async function api_get(path) {
  let text = await fetch(
    "http://events-spa-api.teresewang.com/api/v1" + path, {});
  let resp = await text.json();
  return resp.data;
}

async function api_post(path, data) {
  let opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };
  let text = await fetch(
    "http://events-spa-api.teresewang.com/api/v1" + path, opts);
  return await text.json();
}

export function fetch_users() {
    api_get("/users").then((data) => store.dispatch({
        type: 'users/set',
        data: data,
    }));
}

export function fetch_user(id) {
  api_get("/users/" + id).then((data) => store.dispatch({
      type: 'user_form/set',
      data: data,
  }));
}

export async function create_user(user) {
  let data = new FormData();
  data.append("user[name]", user.name);
  data.append("user[email]", user.email);
  data.append("user[password]", user.password);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/users", {
    method: "POST",
    body: data,
  })
return await resp.json();
}

export async function update_user(user) {
  let data = new FormData();
  data.append("user_id", user.id);
  data.append("user[name]", user.name);
  data.append("user[email]", user.email);
  data.append("user[password]", user.password);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/users/" + user.id, {
    method: "PATCH",
    body: data,
  })
return await resp.json();
}

export function fetch_events() {
  api_get("/events").then((data) => {
    store.dispatch({
    type: 'events/set',
    data: data,
  })});
}

export function fetch_event(id) {
  api_get("/events/"+id).then((data) => store.dispatch({
    type: 'event_form/set',
    data: data,
  }));
}

export async function create_event(event) {
  let data = new FormData();
  data.append("event[user_id]", event.user_id);
  data.append("event[date]", JSON.stringify(event.date));
  data.append("event[description]", event.description);
  data.append("event[name]", event.name);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/events", {
    method: "POST",
    body: data,
  })
  return await resp.json();
}


export async function update_event(event) {
  let data = new FormData();
  data.append("event[user_id]", event.user_id);
  data.append("event[date]", JSON.stringify(event.date));
  data.append("event[description]", event.description);
  data.append("event[name]", event.name);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/events/" + event.id, {
    method: "PATCH",
    body: data,
  })
return await resp.json();
}

export async function delete_event(id) {
  let data = new FormData();
  data.append("id", id);
  fetch("http://events-spa-api.teresewang.com/api/v1/events/" + id, {
    method: 'DELETE',
    body: data,
  }).then((resp) => {
    if(!resp.ok){
      let action = {
        type: 'error/set',
        data: 'Unable to delete event.',
      };
      store.dispatch(action);
    }else {
      fetch_events();
    }
  });
}


export function fetch_comments(event_id) {
  api_get("/comments").then((data) => {
    let result = []
    for (let [key, value] of Object.entries(data)) {
      if (value.event_id == event_id) {
        result.push(value)
      }
    }
    store.dispatch({
    type: 'comments/set',
    data: result,
  })})
}

export async function create_comment(comment, user_id, event_id) {
  let data = new FormData();
  data.append("comment[body]", comment);
  data.append("comment[event_id]", event_id);
  data.append("comment[user_id]", user_id);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/comments", {
    method: "POST",
    body: data,
  })
  return await resp.json();
}

export async function delete_comment(id, event_id) {
  let data = new FormData();
  data.append("id", id);
  fetch("http://events-spa-api.teresewang.com/api/v1/comments/" + id, {
    method: 'DELETE',
    body: data,
  }).then((resp) => {
    if(!resp.ok){
      let action = {
        type: 'error/set',
        data: 'Unable to delete event.',
      };
      store.dispatch(action);
    }else {
      fetch_comments(event_id);
      fetch_events()
    }
  });
}

export function fetch_invites(event_id) {
  api_get("/invites").then((data) => {
    let result = []
    for (let [key, value] of Object.entries(data)) {
      if (value.event_id == event_id) {
        result.push(value)
      }
    }
    store.dispatch({
    type: 'invites/set',
    data: result,
  })})
}

export async function create_invite(email, event_id) {
  let data = new FormData();
  data.append("invite[email]", email);
  data.append("invite[event_id]", event_id);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/invites", {
    method: "POST",
    body: data,
  })
  return await resp.json();
}

export async function update_invite(response, user_id, event_id, invite_id) {
  let data = new FormData();
  data.append("invite[response]", response);
  data.append("invite[user_id]", user_id);
  data.append("invite[event_id]", event_id);
  let resp = await fetch("http://events-spa-api.teresewang.com/api/v1/invites/" + invite_id, {
    method: "PATCH",
    body: data,
  })
return await resp.json();
}

export function api_login(email, password) {
  api_post("/session", {email, password}).then((data) => {
    if (data.session) {
      let action = {
        type: 'session/set',
        data: data.session,
      }
      store.dispatch(action);
    }
    else if (data.error) {
     let action = {
        type: 'error/set',
        data: data.error,
      }
      store.dispatch(action);
    }
  });
}

export function load_defaults() {
  fetch_users();
  fetch_events();
}
