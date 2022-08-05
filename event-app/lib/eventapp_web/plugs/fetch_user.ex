#From Nat Tuck CS4550 Lecture Notes fetch_user.ex
#https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0302/photo_blog/lib/photo_blog_web/plugs/fetch_user.ex
defmodule EventappWeb.Plugs.FetchUser do
  import Plug.Conn
  def init(args), do: args
  def call(conn, _args) do
    user_id = get_session(conn, :user_id) || -1
    user = Eventapp.Users.get_user(user_id)
    if user do
      assign(conn, :current_user, user)
    else
      assign(conn, :current_user, nil)
    end
  end
end
