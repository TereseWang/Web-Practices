# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :eventspa,
  ecto_repos: [Eventspa.Repo]

# Configures the endpoint
config :eventspa, EventspaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "8pXtHtV1lQD35gqd8WSdkZ/Zepn0VkF1qXDpdn3f7nEKs08FV8eZFZ+KxrrWWUNs",
  render_errors: [view: EventspaWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Eventspa.PubSub,
  live_view: [signing_salt: "OsnbRIjU"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
