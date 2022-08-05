defmodule EventappWeb.SessionController do
#From Nat Tuck CS4550 Lecture Notes session_controller
#https://github.com/NatTuck/scratch-2021-01/blob/master/4550/0302/photo_blog/lib/photo_blog_web/controllers/session_controller.ex
  use EventappWeb, :controller

  def create(conn, %{"email" => email}) do
    user = Eventapp.Users.get_user_by_email(email)
    if user do
      conn
      |> put_session(:user_id, user.id)
      |> put_flash(:info, "Welcome back #{user.name}")
      |> redirect(to: Routes.page_path(conn, :index))
    else
      conn
      |> delete_session(:user_id)
      |> put_flash(:error, "Login failed")
      |> redirect(to: Routes.page_path(conn, :index))
    end
  end

  def delete(conn, _params) do
    conn
    |> delete_session(:user_id)
    |> put_flash(:error, "Logged out")
    |> redirect(to: Routes.page_path(conn, :index))
  end
end
