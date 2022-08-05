defmodule Eventapp.Repo do
  use Ecto.Repo,
    otp_app: :eventapp,
    adapter: Ecto.Adapters.Postgres
end
