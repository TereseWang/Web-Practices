#From Nat Tuck's CS4550 Lecture Notes, Photoblog deployment
#!/bin/bash
export MIX_ENV=prod
export PORT=4797
export SECRET_KEY_BASE=insecure
export DATABASE_URL=ecto://hw09:bad@localhost/hw09_prod

mix deps.get --only prod

mix compile
CFGD=$(readlink -f /home/hw09/.config/hw09)

if [ ! -d "$CFGD" ]; then
	mkdir -p "$CFGD"
fi

if [ ! -e "$CFGD/base" ]; then
	mix phx.gen.secret > "$CFGD/base"
fi

if [ ! -e "$CFGD/db_pass" ]; then
	pwgen 12 1 > "$CFGD/db_pass"
fi

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://hw09:$DB_PASS@localhost/hw09_prod

mix ecto.create
mix ecto.reset

npm install --prefix ./assets
npm run deploy --prefix ./assets
mix phx.digest

mix release
