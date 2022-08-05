import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: ""}})
socket.connect()


let state = {
  user_name: "",
  game_name: "",
  guesses: {},
  result: {},
  message: "",
  players: {},
  observers: [],
  last_winner: "",
  wins: {},
  timer: 0,
}

let callback = null;
export function store_input(input) {
    state.userInput = input;
}

function state_update(st) {
    state = st;
    if (callback) {
        callback(st);
    }
}
export function ch_join(cb) {
    callback = cb;
    callback(state);
}
let channel = null;// socket.channel("game:1", {})

export function ch_login(name,game_name) {
  join_game(game_name);
  channel.push("login", {user_name: name, game_name: game_name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_player(name) {
  channel.push("player", {user_name: name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_observer(name, game_name) {
  channel.push("observer", {user_name: name, game_name: game_name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_leave(name) {
  channel.push("leave", {user_name: name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_ready(name) {
  channel.push("ready", {user_name: name})
         .receive("ok", state_update)
         .receive("error", resp => {
           console.log("Unable to push", resp)
         });
}

export function ch_push(guess, user_name) {
    channel.push("guess", { guess : guess , user_name : user_name})
           .receive("ok", state_update)
           .receive("error", resp => {console.log("Unable to push", resp)});
}

export function ch_pass(user_name) {
    channel.push("pass", {user_name : user_name})
           .receive("ok", state_update)
           .receive("error", resp => {console.log("Unable to push", resp)});
}

export function ch_reset() {
    channel.push("reset", "")
           .receive("ok", state_update)
           .receive("error", resp => {console.log("Unable to reset")});
}

export function join_game(game_name) {
  channel = socket.channel("game:" + game_name,{});
  channel.join()
  .receive("ok", state_update)
  .receive("error", resp => { console.log("Unable to join", resp) })
  channel.on("view",state_update)
}

//export default socket
