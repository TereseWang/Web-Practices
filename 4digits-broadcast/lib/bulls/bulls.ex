defmodule BullsWeb.Game do
    def new do
        %{
            user_name: "",
            game_name: "",
            secret: generateSecret("", ["1", "2", "3", "4", "5", "6", "7", "8", "9"]),
            guesses: %{},
            result: [],
            message: {:ok, "Enter 4 Digits To Start!"},
            game: false,
            userInput: "",
            players: %{},
            observers: [],
            last_winner: "",
            wins: %{},
            timer: 0,
        }
    end

    def isOver(state) do
        !state.game;
    end

    def checkReady(players) do
      check(players, true)
    end

    def check(players, acc) do
      keys = Map.keys(players)
      if length(keys) == 0 do
        true
      else
        acc && Map.get(players, hd(keys)) && check(Map.delete(players,hd(keys)) ,acc)
      end
    end

    def generateSecret(acc, nums) do
        random = Enum.random(nums);
        if String.length(acc) == 4 do
            acc
        else
            if String.length(acc) == 0 do
                generateSecret(acc <> random, nums--[random]++[0]);
            else
                generateSecret(acc <> random, nums--[random]);
            end
        end
    end

    def isUnique(guess) do
        MapSet.size(MapSet.new(String.split(guess, "", trim: true))) == 4;
    end

    def validateGuesses(state, guess) do
        cond do
            !isUnique(guess) ->
                %{state | message: {:error, "Please enter 4 Unique Number!"}};
            String.at(guess, 0) == "0" ->
                %{state | message: {:error, "First Digit cannot be zero"}}
            String.length(guess) != 4 ->
                %{state | message: {:error, "Please enter 4 digits please"}}
            !Regex.match?(~r/^\d+$/, guess) ->
                %{state | message: {:error, "Please only enter Number please"}}
            true ->
                %{state | message: {:ok, "Guess Processed"}};
        end
    end

    def checkGuesses(guess, answer, acc, bull, cow) do
        if(acc < String.length(guess)) do
            guessI = String.at(guess, acc)
            answerI = String.at(answer, acc)
            cond do
                guessI == answerI ->
                    checkGuesses(guess, answer, acc+1, bull+1, cow);
                String.contains?(answer, guessI) ->
                    checkGuesses(guess, answer, acc+1, bull, cow+1);
                true ->
                    checkGuesses(guess, answer, acc+1, bull, cow);
            end
        else
            {bull, cow}
        end
    end


    def view(state,user_name) do
      IO.inspect(state.secret)
      {_, msg} = state.message
        %{
            user_name: user_name,
            game_name: state.game_name,
            guesses: state.guesses,
            result: state.result,
            message: msg,
            players: state.players,
            observers: state.observers,
            last_winner: state.last_winner,
            wins: state.wins,
            game: state.game,
            timer: state.timer,
        }
    end

    def getWinners(results,secret,acc) do
      if length(results) == 0 do
          acc
      else
        player = hd(results)
        guess = hd(tl(results))
        rest = tl(tl(tl(results)))
        {bull,cow} = checkGuesses(guess,secret,0,0,0)
        if bull == 4 do
            getWinners(rest, secret, acc ++ [player])
        else
            getWinners(rest,secret, acc)
        end
    end
end


def changeWinners(winners, map) do
    if length(winners) == 0 do
        map
    else
        changeWinners(tl(winners),Map.update(map, hd(winners), [0, 1], fn existing_value -> [hd(existing_value), hd(tl(existing_value)) + 1] end))
    end
end

def changeLosers(losers, map) do
    if length(losers) == 0 do
        map
    else
        changeLosers(tl(losers),Map.update(map, hd(losers), [1, 0], fn existing_value -> [hd(existing_value) + 1, hd(tl(existing_value))] end))
    end
end


    def compileResults(result,guesses,secret,size) do
      keys = Map.keys(guesses)
      if size != length(keys) do
        {result,guesses}
      else
        {compileHelper(result,guesses,secret),%{}}
      end
    end

    def compileHelper(result,guesses,secret) do
      keys = Map.keys(guesses)
      if length(keys) == 0 do
        result
      else
        if Map.get(guesses, hd(keys)) != false do
          {bull, cow} = checkGuesses(Map.get(guesses, hd(keys)), secret, 0, 0, 0)
          compileHelper(result ++ [hd(keys),Map.get(guesses, hd(keys)),"#{bull}A#{cow}B"],
          Map.delete(guesses,hd(keys)),secret)
        else
          compileHelper(result,Map.delete(guesses,hd(keys)),secret)
        end
      end
    end

    def get_time(time, a, b) do
      if a == b do
        0
      else
        time
      end
    end

    def returnResult(state, guess, user) do
      {bull, cow} = checkGuesses(guess, state.secret, 0, 0, 0);
      guesses_temp = Map.put_new(state.guesses, user, guess)
      {result, guesses} = compileResults(state.result,guesses_temp,state.secret,map_size(state.players))
      time = get_time(state.timer,map_size(state.players),map_size(guesses_temp))
      state0 = %{state |
                  guesses: guesses,
                  result: result,
                  userInput: "",
                  timer: time};
      state0;
    end

    def reset_observers(observers, acc) do
      if length(observers) == 0 do
        acc
      else
        reset_observers(tl(observers),acc++[hd(observers)])
      end
    end

    def add_observer(state, name) do
      new_observers = state.observers++[name];
      %{state | observers: new_observers};
    end

    def ready(state, name) do
      if Map.has_key?(state.players, name) do
          new_players = Map.update!(state.players,name,fn(is_ready) -> !is_ready end);
          if checkReady(new_players) && length(Map.keys(new_players)) >= 4 do
              %{state | game: true, players: new_players};
          else
              %{state | players: new_players};
          end
      else
        state;
      end
    end

    def make_player(state, name) do
        new_observers = List.delete(state.observers,name);
        new_players = Map.put_new(state.players, name, false);
        %{state | players: new_players , observers: new_observers};
    end

    def make_observer(state, name, game_name) do
      if !Enum.member?(state.observers,name) do
        new_observers = state.observers++[name];
        new_players = Map.delete(state.players,name);
        if checkReady(new_players) && length(Map.keys(new_players)) >= 4 do
            %{state | game: true, players: new_players,observers: new_observers, game_name: game_name};
        else
            %{state | players: new_players,observers: new_observers, game_name: game_name};
        end
      else
        state;
      end

    end


    def leave(state, name) do
      new_observers = List.delete(state.observers,name);
      new_players = Map.delete(state.players,name);
      %{state | players: new_players , observers: new_observers};
    end

    def pass(state, name) do
      new_guesses = Map.put_new(Map.delete(state.guesses,name), name, false);
      {result, guesses} = compileResults(state.result,new_guesses,state.secret,map_size(state.players))
      state0 = %{state |
                  guesses: guesses,
                  result: result,
                  userInput: ""};

      state0
    end

    def timer(state) do
      time = state.timer + 1
      if !state.game do
        %{state | timer: 0}
      else
        winners = getWinners(state.result,state.secret,[])
        observers = reset_observers(state.observers,[])++reset_observers(Map.keys(state.players),[])
        cond do
          length(winners) > 0 ->
            players = Map.keys(state.players)
            losers = Enum.filter(players, fn el -> !Enum.member?(winners, el) end)
            winner_Map = changeWinners(winners, state.wins)
            loser_Map = changeLosers(losers, winner_Map)
            %{new() |
              observers: observers,
              last_winner: Enum.join(winners,", "),
              wins: loser_Map,
              game_name: state.game_name
              }
          time>=30 ->
            {result,_} = {compileHelper(state.result,state.guesses,state.secret),%{}}
            %{state | timer: 0, result: result, guesses: %{}}
          true->
            %{state | timer: time}
        end
    end
end
end
