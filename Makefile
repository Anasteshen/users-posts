build:
	npm install
	npm run build

start: build
	docker-compose up -d
	npm run migration:run
	npm run start:dev 