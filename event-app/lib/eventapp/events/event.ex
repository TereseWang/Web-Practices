defmodule Eventapp.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :date, :naive_datetime
    field :description, :string
    field :name, :string
    belongs_to :user, Eventapp.Users.User
    has_many :comments, Eventapp.Comments.Comment
    has_many :votes, Eventapp.Votes.Vote
    has_many :invites, Eventapp.Invites.Invite
    field :score, :integer, virtual: true
    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:name, :date, :description, :user_id])
    |> validate_required([:name, :date, :description, :user_id])
  end
end
