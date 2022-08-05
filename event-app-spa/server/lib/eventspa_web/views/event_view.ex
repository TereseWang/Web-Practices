defmodule EventspaWeb.EventView do
  use EventspaWeb, :view
  alias EventspaWeb.EventView
  alias EventspaWeb.UserView
  alias EventspaWeb.InviteView

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: event}) do
    user = if Ecto.assoc_loaded?(event.user) do
      render_one(event.user, UserView, "user.json")
    else
      nil
    end
    invites = if Ecto.assoc_loaded?(event.invites) do
      render_many(event.invites, InviteView, "invite.json")
    else
      nil
    end
    %{
      user: user,
      id: event.id,
      user_id: event.user_id,
      name: event.name,
      date: event.date,
      description: event.description,
      invites: invites}
  end
end
