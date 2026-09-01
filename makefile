COMPOSE = docker-compose
ENV_FILE = server/.env

.PHONY: up down rebuild ps logs start stop restart check-env secret

up: check-env
	$(COMPOSE) up -d

check-env:
	@if [ ! -f "$(ENV_FILE)" ]; then \
		echo "Missing $(ENV_FILE)"; \
		read -p "Resend API key: " key; \
		echo "RESEND_API_KEY=$$key" > "$(ENV_FILE)"; \
	fi

down:
	$(COMPOSE) down

rebuild: check-env
	$(COMPOSE) up --build -d

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f server

start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

db_users:
	sqlite3 -header -column server/db/database.sqlite "SELECT * FROM users;"

db_passresets:
	sqlite3 -header -column server/db/database.sqlite "SELECT * FROM password_resets;"

db_reset:
	rm -f server/db/database.sqlite
	php server/db/setup/setup.php

secret:
	@read -p "Resend API key: " key; \
	echo "RESEND_API_KEY=$$key" > server/.env

nuke:
	$(COMPOSE) down --rmi all