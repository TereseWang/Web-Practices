defmodule BullsWeb.GameChannel do
    use BullsWeb, :channel

    alias BullsWeb.Game
    alias BullsWeb.GameServer

    @impl true
    def join("game:" <> name, payload, socket) do
        if authorized?(payload) do
            GameServer.start(name)
            view = GameServer.peek(name)
            |> Game.view("")
            socket = assign(socket, :name, name)
            socket = assign(socket, :user, "")
            {:ok, view, socket}
        else
            {:error, %{reason: "unauthorized"}}
        end
    end

    @impl true
    def handle_in("login", %{"user_name" => user, "game_name" => game_name}, socket) do
      socket = assign(socket, :user, user)
      name = socket.assigns[:name]
      view = GameServer.observer(name, user,game_name)

      result = Game.view(view,user)
      broadcast(socket, "view", view)
      {:reply, {:ok, result}, socket}
    end

    @impl true
    def handle_in("leave", %{"user_name" => user}, socket) do
      socket = assign(socket, :user, "")
      name = socket.assigns[:name]
      view = GameServer.leave(name, user)
      result = Game.view(view,user)
      broadcast(socket, "view", view)
      {:reply, {:ok, result}, socket}
    end

    @impl true
    def handle_in("player", %{"user_name" => user}, socket) do
      #socket = assign(socket, :user, user)
      user = socket.assigns[:user]
      name = socket.assigns[:name]
      view = GameServer.player(name, user)
      |> Game.view(user)
      broadcast(socket, "view", view)
      {:reply, {:ok, view}, socket}
    end

    @impl true
    def handle_in("observer", %{"user_name" => user, "game_name" => game_name}, socket) do
      #socket = assign(socket, :user, user)
      user = socket.assigns[:user]
      name = socket.assigns[:name]
      view = GameServer.observer(name, user, game_name)
      |> Game.view(user)
      broadcast(socket, "view", view)
      {:reply, {:ok, view}, socket}
    end

    @impl true
    def handle_in("ready", %{"user_name" => user}, socket) do
      #socket = assign(socket, :user, user)
      user = socket.assigns[:user]
      name = socket.assigns[:name]
      view = GameServer.ready(name, user)
      |> Game.view(user)
      broadcast(socket, "view", view)
      {:reply, {:ok, view}, socket}
    end

    @impl true
    def handle_in("pass", %{"user_name" => user}, socket) do
      user = socket.assigns[:user]
      name = socket.assigns[:name]
      view = GameServer.observer(name, user)
      |> Game.view(user)
      broadcast(socket, "view", view)
      {:reply, {:ok, view}, socket}
    end

    @impl true
    def handle_in("guess", %{"guess" => guess}, socket) do
        user = socket.assigns[:user]
        name = socket.assigns[:name]
        game1 = GameServer.validate(name, guess)
        case game1[:message] do
            {:error, _message} ->
                view = Game.view(game1, user)
                {:reply, {:ok, view}, socket};
            {:ok, _message} ->
                view = GameServer.guess(name, guess, user)
                |> Game.view(user)
                broadcast(socket, "view", view)
                {:reply, {:ok, view}, socket};
        end
    end



    @impl true
    def handle_in("guess", _x, socket) do
        game = BullsWeb.Game.new();
        socket = assign(socket, :game, game);
        view = BullsWeb.Game.view(game,"");
        {:reply, {:ok, view}, socket};
    end

    @impl true
    def handle_in("reset", _payload, socket) do
        game = BullsWeb.Game.new()
        view = BullsWeb.Game.view(game,"")
        socket = assign(socket, :game, game)
        {:reply, {:ok, view}, socket};
    end

    intercept ["view"]

    @impl true
    def handle_out("view", msg, socket) do
      user = socket.assigns[:user]
      msg = Map.delete(%{msg | user_name: user}, :message)
      push(socket, "view", msg)
      {:noreply, socket}
    end

    defp authorized?(_payload) do
        true
    end
end
