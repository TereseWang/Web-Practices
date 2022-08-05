defmodule EventspaWeb.InviteView do
  use EventspaWeb, :view
  alias EventspaWeb.InviteView
  alias EventspaWeb.UserView
  alias EventspaWeb.EventView

  def render("index.json", %{invites: invites}) do
    %{data: render_many(invites, InviteView, "invite.json")}
  end

  def render("show.json", %{invite: invite}) do
    %{data: render_one(invite, InviteView, "invite.json")}
  end

  def render("invite.json", %{invite: invite}) do
    user = if Ecto.assoc_loaded?(invite.user) do
      render_one(invite.user, UserView, "user.json")
    else
      nil
    end
    event = if Ecto.assoc_loaded?(invite.event) do
      render_one(invite.event, EventView, "event.json")
    else
      nil
    end
    %{id: invite.id,
      event: event,
      user: user,
      event_id: invite.event_id,
      user_id: invite.user_id,
      response: invite.response}
  end
end
