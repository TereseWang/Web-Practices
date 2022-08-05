defmodule BullsWeb.GameServer do
  use GenServer

  alias BullsWeb.BackupAgent
  alias BullsWeb.Game

  # public interface

  def reg(name) do
    {:via, Registry, {BullsWeb.GameReg, name}}
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker
    }
    BullsWeb.GameSup.start_child(spec)
  end

  def start_link(name) do
    game = BackupAgent.get(name) || Game.new
    GenServer.start_link(
      __MODULE__,
      game,
      name: reg(name)
    )
  end

  def reset(name) do
    GenServer.call(reg(name), {:reset, name})
  end

  def leave(name,user_name) do
    GenServer.call(reg(name), {:leave, name, user_name})
  end


  def guess(name, guess, user_name) do
    GenServer.call(reg(name), {:guess, name, guess, user_name})
  end

  def validate(name, guess) do
    GenServer.call(reg(name), {:validate, name, guess})
  end

  def peek(name) do
    GenServer.call(reg(name), {:peek, name})
  end

  def login(name, user_name) do
    GenServer.call(reg(name), {:login, name, user_name})
  end

  def pass(name, user_name) do
    GenServer.call(reg(name),{:ready, name, user_name})
  end

  def ready(name, user_name) do
    GenServer.call(reg(name), {:ready, name, user_name})
  end

  def player(name, user_name) do
    GenServer.call(reg(name), {:player, name, user_name})
  end

  def observer(name, user_name, game_name) do
    GenServer.call(reg(name), {:observer, name, user_name,game_name})
  end

  # implementation

  def init(game) do
    Process.send_after(self(), :update, 1_000)
    {:ok, game}
  end

  def handle_call({:peek, name}, _from, game) do
    BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:reset, name}, _from, game) do
    game = Game.new
    BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:leave, name, user_name}, _from, game) do
    game = Game.leave(game, user_name)
    {:reply, game, game}
  end

  def handle_call({:validate, name, guess}, _from, game) do
    game = Game.validateGuesses(game, guess)
    BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:guess, name, guess, user_name}, _from, game) do
    game = Game.returnResult(game, guess, user_name)
    BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:ready, name, user_name}, _from, game) do
    game = Game.ready(game, user_name)
    {:reply, game, game}
  end

  def handle_call({:pass, name, user_name}, _from, game) do
    game = Game.pass(game, user_name)
    {:reply, game, game}
  end

  def handle_call({:observer, name, user_name, game_name}, _from, game) do
    game = Game.make_observer(game, user_name,game_name)
    {:reply, game, game}
  end

  def handle_call({:player, name, user_name}, _from, game) do
    game = Game.make_player(game, user_name)
    {:reply, game, game}
  end

  def handle_info(:update, game) do
    new_game = Game.timer(game)
    BullsWeb.Endpoint.broadcast!(
      "game:"<> game.game_name,
      "view",
      Game.view(new_game, ""))
    Process.send_after(self(), :update, 1_000)
    {:noreply, new_game}
  end
end
