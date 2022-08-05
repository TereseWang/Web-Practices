defmodule Eventspa.Repo do
  use Ecto.Repo,
    otp_app: :eventspa,
    adapter: Ecto.Adapters.Postgres
end
