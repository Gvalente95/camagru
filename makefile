COMPOSE = docker-compose


PHONY: up down rebuild ps logs start stop restart backend

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

rebuild:
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

backend:
	docker compose exec server sh

db_users:
	sqlite3 -header -column server/db/database.sqlite "SELECT * FROM users;"

db_passresets:
	sqlite3 -header -column server/db/database.sqlite "SELECT * FROM password_resets;"

db_reset:
	rm -f server/db/database.sqlite
	php server/db/setup/setup.php