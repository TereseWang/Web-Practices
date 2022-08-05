defmodule EventspaWeb.CommentView do
  use EventspaWeb, :view
  alias EventspaWeb.CommentView
  alias EventspaWeb.UserView
  alias EventspaWeb.EventView

  def render("index.json", %{comments: comments}) do
    %{data: render_many(comments, CommentView, "comment.json")}
  end

  def render("show.json", %{comment: comment}) do
    %{data: render_one(comment, CommentView, "comment.json")}
  end

  def render("comment.json", %{comment: comment}) do
    user = if Ecto.assoc_loaded?(comment.user) do
      render_one(comment.user, UserView, "user.json")
    else
      nil
    end
    event = if Ecto.assoc_loaded?(comment.event) do
      render_one(comment.event, EventView, "event.json")
    else
      nil
    end
    %{id: comment.id,
      body: comment.body,
      user_id: comment.user_id,
      event_id: comment.event_id,
      user: user,
      event: event}
  end
end
