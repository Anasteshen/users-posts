build:
	npm install
	npm run build

postgres:
	@if [ $(shell lsof -i:5432 | wc -l) -eq 0 ]; then \
		echo "Starting postgres docker container on port 5432"; \
		docker run -d \
			-p 5432:5432 \
			--name test-postgres \
			-e POSTGRES_PASSWORD=postgres \
			-e POSTGRES_USER=postgres \
			-e POSTGRES_DB=test_task \
			postgres; \
	fi

clean:
	@if [ $(shell docker ps -a | grep test-postgres | wc -l) -gt 1 ]; then \
		echo "Removing postgres docker container"; \
		docker rm -f test-postgres; \
	fi

start: build postgres
	docker-compose up -d
	npm run migration:run
	npm run start:dev 