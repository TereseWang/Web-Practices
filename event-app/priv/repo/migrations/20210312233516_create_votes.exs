defmodule Eventapp.Repo.Migrations.CreateVotes do
  use Ecto.Migration

  def change do
    create table(:votes) do
      add :votes, :integer, null: false
      add :event_id, references(:events, on_delete: :nothing), null: false
      add :user_id, references(:users, on_delete: :nothing), null: false

      timestamps()
    end
    create index(:votes, [:event_id, :user_id], unique: true)
    create index(:votes, [:event_id])
    create index(:votes, [:user_id])
  end
end
