defmodule Eventapp.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :body, :text, null: false
      add :vote, :integer, null: false, default: 0
      add :event_id, references(:events, on_delete: :nothing),
        null: false
      add :user_id, references(:users, on_delete: :nothing),
        null: false
      timestamps()
    end
    create index(:comments, [:event_id])
    create index(:comments, [:user_id])
  end
end
