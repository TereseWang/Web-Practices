defmodule EventspaWeb.UserController do
  use EventspaWeb, :controller

  alias Eventspa.Users
  alias Eventspa.Users.User

  action_fallback EventspaWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    try do
      if !validate_params(user_params) do
        if Users.get_user_by_email!(user_params["email"]) == nil do
          with {:ok, %User{} = user} <- Users.create_user(user_params) do
            conn
            |> put_status(:created)
            |> put_resp_header("location", Routes.user_path(conn, :show, user))
            |> render("show.json", user: user)
          end
        else
          conn
          |> put_resp_header(
          "content-type",
          "application/json; charset=UTF-8")
          |> send_resp(
          :unauthorized,
          Jason.encode!(%{error: "User With This Email Already Exist"})
          )
        end
      else
        conn
        |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Fields Missing"})
        )
      end
    rescue
      _e in MultipleResultsError ->
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
      :unauthorized,
      Jason.encode!(%{error: "This User has Already Been Exist"})
      )
    end
  end

  def validate_params(user_params) do
    Map.values(user_params) |> Enum.member?("") || Map.values(user_params) |> Enum.member?("undefined")
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)
    if !validate_params(user_params) do
      with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
        conn
        |> render("show.json", user: user)
      end
    else
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
      |> send_resp(
        :unauthorized,
        Jason.encode!(%{error: "Fields Missing"})
        )
      end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
