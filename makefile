COMPOSE = docker-compose


PHONY: up down rebuild ps logs start stop backend

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

backend:
	docker compose exec server sh