defmodule Eventapp.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, :string, default: "unrespond"
    field :email, :string
    belongs_to :event, Eventapp.Events.Event
    belongs_to :user, Eventapp.Users.User

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:response, :email, :event_id, :user_id])
    |> unique_constraint(:email)
    |> validate_required([:response, :email, :event_id, :user_id])
  end
end
