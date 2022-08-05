defmodule EventappWeb.PageController do
  use EventappWeb, :controller

  alias Eventapp.Events
  alias Eventapp.Events.Event
  alias Eventapp.Users
  alias Eventapp.Users.User
  alias EventappWeb.Helpers

  def index(conn, _params) do
    events = Events.list_events()
    |> Events.load_votes()
    render(conn, "index.html", events: events)
  end
end
