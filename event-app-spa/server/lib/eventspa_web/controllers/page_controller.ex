defmodule EventspaWeb.PageController do
  use EventspaWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
