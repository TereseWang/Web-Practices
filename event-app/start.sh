#From Nat Tuck CS4550 Lecture Notes photoblog deployment
#!/bin/bash

# Could factor some of this out into an env.sh
# to share with deploy.sh
export MIX_ENV=prod
export PORT=4795

CFGD=$(readlink -f /home/hw07/.config/events)

if [ ! -e "$CFGD/base" ]; then
    echo "Need to deploy first"
    exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://hw07:$DB_PASS@localhost/hw07_prod

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/eventapp/bin/eventapp start
