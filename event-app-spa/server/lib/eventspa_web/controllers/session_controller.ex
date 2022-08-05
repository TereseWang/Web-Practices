defmodule EventspaWeb.SessionController do
  use EventspaWeb, :controller

#referenced from Nat Lecture, Photo_Blog SPA Project session controller
  def create(conn, %{"email" => email, "password" => password}) do
    try do
      user = Eventspa.Users.authenticate(email, password)
      if user do
        sess = %{
          user_id: user.id,
          email: user.email,
          name: user.name,
          token: Phoenix.Token.sign(conn, "user_id", user.id)
        }
        conn
        |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(
        :created,
        Jason.encode!(%{session: sess})
        )
      else
        conn
        |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Password Incorrect"})
        )
      end
    rescue
      _e in Ecto.NoResultsError ->
      conn
      |> put_resp_header(
      "content-type",
      "application/json; charset=UTF-8")
      |> send_resp(
      :unauthorized,
      Jason.encode!(%{error: "User Email Does Not Exist"})
      )
    end
  end
end
