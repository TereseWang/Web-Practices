defmodule Eventapp.Comments.Comment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "comments" do
    field :body, :string
    field :vote, :integer
    belongs_to :event, Eventapp.Events.Event
    belongs_to :user, Eventapp.Users.User

    timestamps()
  end

  @doc false
  def changeset(comment, attrs) do
    comment
    |> cast(attrs, [:body, :vote, :event_id, :user_id])
    |> validate_required([:body, :vote, :event_id, :user_id])
  end
end
