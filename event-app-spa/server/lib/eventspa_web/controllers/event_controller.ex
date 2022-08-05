defmodule EventspaWeb.EventController do
  use EventspaWeb, :controller

  alias Eventspa.Events
  alias Eventspa.Events.Event

  action_fallback EventspaWeb.FallbackController

  def index(conn, _params) do
    events = Events.list_events()
    render(conn, "index.json", events: events)
  end

  def create(conn, %{"event" => event_params}) do
    date = Jason.decode!(event_params["date"])
    event_params = event_params
    |> Map.put("date", date)
    if !validate_params(event_params) do
      with {:ok, %Event{} = event} <- Events.create_event(event_params) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.event_path(conn, :show, event))
        |> render("show.json", event: event)
      end
    else
      conn
      |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
      |> send_resp(
      :unauthorized,
      Jason.encode!(%{error: "Fields Missing"})
      )
    end
  end

  def validate_params(event_params) do
    Map.values(event_params) |> Enum.member?("") || Map.values(event_params) |> Enum.member?("undefined")
  end

  def show(conn, %{"id" => id}) do
    current_user = conn.assigns[:current_user]
    event = Events.get_event!(id)
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)
    date = Jason.decode!(event_params["date"])
    event_params = event_params
    |> Map.put("date", date)
    if !validate_params(event_params) do
        with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
          conn
          |> render("show.json", event: event)
        end
      else
        conn
        |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Fields Missing"})
        )
      end
  end

  def delete(conn, %{"id" => id}) do
    event = Events.get_event!(id)

    with {:ok, %Event{}} <- Events.delete_event(event) do
      send_resp(conn, :no_content, "")
    end
  end
end
