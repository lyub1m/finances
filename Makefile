docker_compose_bin := $(shell command -v docker-compose 2> /dev/null)

init-back-npm:
	cd back/app && npm i

up-docker-back:
	cd back && $(docker_compose_bin) up -d

build-docker-back:
	cd back && $(docker_compose_bin) build

down-back:
	cd back && $(docker_compose_bin) down

logs-app-back:
	cd back && $(docker_compose_bin) logs -f app

init-front:
	cd front && npm i

start-dev-front:
	cd front && npm run start


## migrations
migrate: ## run migrations
	cd back && $(docker_compose_bin) exec app sh -c 'npm run migrate'

migrate-revert: ## run migrations
	cd back && $(docker_compose_bin) exec svc_train_booking sh -c 'npm run migrate:revert'

migrate-create: ## create migration make create-migration-c name=migration-name
	cd back/app && NAME=./database/migrations/${name} npm run migrate:create