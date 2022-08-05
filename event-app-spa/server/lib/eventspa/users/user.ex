defmodule Eventspa.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    has_many :events, Eventspa.Events.Event
    has_many :comments, Eventspa.Comments.Comment
    has_many :invites, Eventspa.Invites.Invite
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
      user
      |> cast(attrs, [:name, :email, :password_hash])
      |> add_password_hash(attrs["password"])
      |> unique_constraint(:email)
      |> validate_required([:name, :email, :password_hash])
  end

  def add_password_hash(cset, nil) do
    cset
  end

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
