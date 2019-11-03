e2e:
	docker-compose down --remove-orphans
	docker-compose up e2e
app:
	docker-compose down --remove-orphans
	docker-compose up client 