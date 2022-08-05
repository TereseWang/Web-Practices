defmodule Eventspa.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, :string
    belongs_to :event, Eventspa.Events.Event
    belongs_to :user, Eventspa.Users.User
    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :event_id, :user_id])
    |> validate_required([:response, :event_id, :user_id])
  end
end
