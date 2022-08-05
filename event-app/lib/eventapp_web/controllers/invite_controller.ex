defmodule EventappWeb.InviteController do
  use EventappWeb, :controller

  alias Eventapp.Invites
  alias Eventapp.Invites.Invite
  alias Eventapp.Users
  alias Eventapp.Users.User
  alias Eventapp.Events
  alias Eventapp.Events.Event
  alias EventappWeb.Plugs
  alias Eventapp.Photos

  def index(conn, _params) do
    invites = Invites.list_invites()
    render(conn, "index.html", invites: invites)
  end

  def new(conn, _params) do
    changeset = Invites.change_invite(%Invite{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"invite" => invite_params}) do
    event_id = invite_params["event_id"]
    event = Events.get_event!(event_id)
    user_email = invite_params["email"]
    user_id =
    if Eventapp.Users.get_user_by_email(user_email) do
      user_id = Eventapp.Users.get_user_by_email(user_email).id
      if current_user_id(conn) == user_id do
        put_flash(conn, :error, "You can't invite yourself.")
      end
    else
      Eventapp.Users.create_user(%{"name" => "changeLater", "email" => user_email, "photo_hash" => Photos.get_default()})
      Eventapp.Users.get_user_by_email(user_email).id
    end
    invite_params = invite_params
    |> Map.put("user_id", user_id)
    {result, invite} = Invites.create_invite(invite_params)
    if (result == :ok) do
        conn
        |> put_flash(:info, "Invite created successfully.")
        |> redirect(to: Routes.event_path(conn, :show, invite.event_id))
      else
        conn
        |> put_flash(:error, "Invalid Email / Repeated Email.")
        |> redirect(to: Routes.event_path(conn, :show, event_id))
      end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.html", invite: invite)
  end

  def edit(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    changeset = Invites.change_invite(invite)
    render(conn, "edit.html", invite: invite, changeset: changeset)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)
    invite_params = invite_params
    |> Map.put("user_id", current_user_id(conn))
    case Invites.update_invite(invite, invite_params) do
      {:ok, invite} ->
        conn
        |> put_flash(:info, "Invite updated successfully.")
        |> redirect(to: Routes.event_path(conn, :show, invite.event_id))
      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", invite: invite, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    {:ok, _invite} = Invites.delete_invite(invite)

    conn
    |> put_flash(:info, "Invite deleted successfully.")
    |> redirect(to: Routes.invite_path(conn, :index))
  end
end
