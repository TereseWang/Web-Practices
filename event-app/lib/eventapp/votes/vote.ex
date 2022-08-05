defmodule Eventapp.Votes.Vote do
  use Ecto.Schema
  import Ecto.Changeset

  schema "votes" do
    field :votes, :integer
    belongs_to :event, Eventapp.Events.Event
    belongs_to :user, Eventapp.Users.User
    timestamps()
  end

  @doc false
  def changeset(vote, attrs) do
    vote
    |> cast(attrs, [:votes, :event_id, :user_id])
    |> validate_required([:votes, :event_id, :user_id])
  end
end
