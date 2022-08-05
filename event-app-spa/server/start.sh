#From Nat Tuck CS4550 Lecture Notes photoblog deployment
#!/bin/bash

# Could factor some of this out into an env.sh
# to share with deploy.sh
export MIX_ENV=prod
export PORT=4797

CFGD=$(readlink -f /home/hw09/.config/hw09)

if [ ! -e "$CFGD/base" ]; then
    echo "Need to deploy first"
    exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://hw09:$DB_PASS@localhost/hw09_prod

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/eventspa/bin/eventspa start
