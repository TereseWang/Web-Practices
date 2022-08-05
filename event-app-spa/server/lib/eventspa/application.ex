defmodule Eventspa.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Eventspa.Repo,
      # Start the Telemetry supervisor
      EventspaWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Eventspa.PubSub},
      # Start the Endpoint (http/https)
      EventspaWeb.Endpoint
      # Start a worker by calling: Eventspa.Worker.start_link(arg)
      # {Eventspa.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Eventspa.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    EventspaWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
