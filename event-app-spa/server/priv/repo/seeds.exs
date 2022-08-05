# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Eventspa.Repo.insert!(%Eventspa.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Eventspa.Repo
alias Eventspa.Users.User
alias Eventspa.Events.Event
alias Eventspa.Comments.Comment
alias Eventspa.Invites.Invite

defmodule Inject do
  def user(name, pass, email) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{name: name, password_hash: hash, email: email})
  end
end

alice = Inject.user("alice", "test1", "teresewang2000@gmail.com")
bob = Inject.user("bob", "test1", "wang.haoqi@northeastern.edu")

p1 = %Event{
  name: "Alice Birthday Party",
  date: ~N[2000-01-01 23:00:07],
  description: "There will be pizza",
  user_id: alice.id
}
Repo.insert!(p1)
c1 = %Comment{
  body: "I will attend",
  user_id: alice.id,
  event_id: 1,
}
 i1 = %Invite {
   response: "Yes",
   user_id: bob.id,
   event_id: 1
 }
Repo.insert!(c1)
Repo.insert!(i1)
