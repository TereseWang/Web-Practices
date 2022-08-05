#From Nat Tuck Lecture Notes photo_blog/lib/photo_blog_web/helpers.ex
defmodule EventappWeb.Helpers do

  alias Eventapp.Events
  alias Eventapp.Events.Event
  alias Eventapp.Users
  alias Eventapp.Users.User
  alias Eventapp.Users.User
  alias Eventapp.Invites
  alias Eventapp.Invites.Invite

  def current_user_id(conn) do
    user = conn.assigns[:current_user]
    user && user.id
  end

  def get_user_by_email(conn, email) do
    user = Users.get_user_by_email(email)
    user
  end

  def get_invite(conn) do
    user_id = current_user_id(conn)
    user_email = Users.get_user(user_id).email
    invite = Invites.get_invite_by_email(user_email)
    invite
  end

  def invited(conn, event_id) do
    event = Events.get_event!(event_id)
    invites = Invites.list_invites()
    user_id = current_user_id(conn)
    user_email = Users.get_user(user_id).email
    result = Enum.any?(invites, fn x -> x.email == user_email end)
    result
  end



  def count_responses_helper(invites, acc, yes, no, maybe, unrespond) do
    if Enum.count(invites) == acc do
      "yes: #{yes}, no: #{no}, maybe: #{maybe}, unrespond: #{unrespond}"
    else
      case Map.get(Enum.at(invites, acc), :response) do
        "Yes" -> count_responses_helper(invites, acc+1, yes+1, no, maybe, unrespond)
        "No" -> count_responses_helper(invites, acc+1, yes, no+1, maybe, unrespond)
        "Maybe" -> count_responses_helper(invites, acc+1, yes, no, maybe+1, unrespond)
        "unrespond" -> count_responses_helper(invites, acc+1, yes, no, maybe, unrespond+1)
        true -> count_responses_helper(invites, acc+1, yes, no, maybe, unrespond+1)
      end
    end
  end

  def count_responses(invites) do
    count_responses_helper(invites, 0, 0, 0, 0, 0)
  end

  def current_user(conn) do
    id = current_user_id(conn)
    user = Users.get_user!(id)
    user.name
  end

  def current_user_email(conn) do
    id = current_user_id(conn)
    user = Users.get_user!(id)
    IO.inspect(user.email)
    user.email
  end

  def have_current_user?(conn) do
    conn.assigns[:current_user] != nil
  end

  def current_user_is?(conn, %User{} = user) do
    current_user_is?(conn, user.id)
  end

  def current_user_is?(conn, user_id) do
    current_user_id(conn) == user_id
  end
end
