defmodule EventappWeb.EventController do
  use EventappWeb, :controller

  alias Eventapp.Events
  alias Eventapp.Events.Event
  alias Eventapp.Users
  alias Eventapp.Users.User
  alias Eventapp.Photos
  alias EventappWeb.Plugs

  #From Nat Tuck Lecture Notes photo_blog/lib/photo_blog_web/post_controller.ex
  plug Plugs.RequireUser when action
    not in [:index, :show, :photo]
  plug :fetch_event when action
    in [:show, :edit, :update, :delete]
  plug :require_owner when action
    in [:edit, :update, :delete]

  def fetch_event(conn, _args) do
    id = conn.params["id"]
    event = Events.get_event!(id)
    assign(conn, :event, event)
  end

  def require_owner(conn, _agrs) do
    user = conn.assigns[:current_user]
    event = conn.assigns[:event]
    if user.id == event.user_id do
      conn
    else
      conn
      |> put_flash(:error, "You cannot edit others' events.")
      |> redirect(to: Routes.page_path(conn, :index))
      |> halt()
    end
  end

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.html", events: events)
  end

  def new(conn, _params) do
    changeset = Events.change_event(%Event{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"event" => event_params}) do
    event_params = event_params
    |> Map.put("user_id", conn.assigns[:current_user].id)
    case Events.create_event(event_params) do
      {:ok, event} ->
        conn
        |> put_flash(:info, "Event created successfully.")
        |> redirect(to: Routes.event_path(conn, :show, event))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    |> Events.load_comments()
    |> Events.load_invites()
    comm = %Eventapp.Comments.Comment{
      event_id: event.id,
      user_id: current_user_id(conn),
      vote: 0,
    }
    new_comment = Eventapp.Comments.change_comment(comm)
    invite = %Eventapp.Invites.Invite{
      event_id: event.id,
      user_id: current_user_id(conn)
    }
    invites = Eventapp.Invites.get_invite_by_userid_eventid(current_user_id(conn), id)
    track_invite =
    if(!Enum.empty?(invites)) do
      Eventapp.Invites.change_invite(List.first(invites))
    else
      nil
    end
    new_invite = Eventapp.Invites.change_invite(invite)
    responses= count_responses(Eventapp.Invites.list_invites())
    render(conn, "show.html", responses: responses, event: event, new_comment: new_comment, new_invite: new_invite, track_invite: track_invite)
  end

  def edit(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    changeset = Events.change_event(event)
    render(conn, "edit.html", event: event, changeset: changeset)
  end


  def update(conn, %{"id" => id, "event" => event_params}) do
    event = conn.assigns[:event]
    case Events.update_event(event, event_params) do
      {:ok, event} ->
        conn
        |> put_flash(:info, "Event updated successfully.")
        |> redirect(to: Routes.event_path(conn, :show, event))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", event: event, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    event = conn.assigns[:event]
    {:ok, _event} = Events.delete_event(event)

    conn
    |> put_flash(:info, "Event deleted successfully.")
    |> redirect(to: "/")
  end
end
