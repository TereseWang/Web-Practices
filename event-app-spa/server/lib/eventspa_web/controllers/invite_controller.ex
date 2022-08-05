defmodule EventspaWeb.InviteController do
  use EventspaWeb, :controller

  alias Eventspa.Invites
  alias Eventspa.Invites.Invite

  action_fallback EventspaWeb.FallbackController

  def index(conn, _params) do
    invites = Invites.list_invites()
    render(conn, "index.json", invites: invites)
  end

  def create(conn, %{"invite" => invite_params}) do
    event_id = invite_params["event_id"]
    user_email = invite_params["email"]
    user_id =
    if Eventspa.Users.get_user_by_email!(user_email) do
      Eventspa.Users.get_user_by_email!(user_email).id
    else
      Eventspa.Users.create_user(%{"name" => "changeLater", "email" => user_email, "password_hash" => "$argon2id$v=19$m=131072,t=8,p=4$eikbhpg4VH11CdXVFz49dg$WL1LWa2tZZx3GdmAkE+IfOBApY8TJg6GAFCxUDdpfuI"})
      Eventspa.Users.get_user_by_email!(user_email).id
    end
    invite_par = %{
      "response" => "Not Answered",
      "event_id" => event_id,
      "user_id" => to_string(user_id)
    }
    case Invites.create_invite(invite_par) do
      {:ok, %Invite{} = invi} ->
        invite = Invites.load_user(invi)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
        |> render("show.json", invite: invite)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create invite."}))
    end
  end

  def show(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)
    render(conn, "show.json", invite: invite)
  end

  def update(conn, %{"id" => id, "invite" => invite_params}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
      render(conn, "show.json", invite: invite)
    end
  end

  def delete(conn, %{"id" => id}) do
    invite = Invites.get_invite!(id)

    with {:ok, %Invite{}} <- Invites.delete_invite(invite) do
      send_resp(conn, :no_content, "")
    end
  end
end
