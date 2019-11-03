dc-e2e:
	docker-compose down --remove-orphans
	docker-compose up e2e
	docker-compose down
dc-make-app:
	docker-compose down --remove-orphans
	docker-compose up client 
	docker-compose down