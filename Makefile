e2e:
	docker-compose down --remove-orphans
	docker-compose up e2e
	docker-compose down
make-app:
	docker-compose down --remove-orphans
	docker-compose up client 
	docker-compose down
