# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Eventapp.Repo.insert!(%Eventapp.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Eventapp.Repo
alias Eventapp.Events.Event
alias Eventapp.Users.User
alias Eventapp.Photos

defmodule Inject do
  def photo(name) do
    photos = Application.app_dir(:eventapp, "priv/photos")
    path = Path.join(photos, name)
    {:ok, hash} = Photos.save_photo(name, path)
    hash
  end
end

aaa = Inject.photo("1.jpg")
alice = Repo.insert!(
%User{
  email: "teresewang2000@gmail.com",
  name: "alice",
  photo_hash: aaa})

p1 = %Event{
  user_id: alice.id,
  name: "Alice’s Birthday Bash",
  date: ~N[2023-08-17 18:00:00],
  description: "There will be Pizza"
}
Repo.insert!(p1)
