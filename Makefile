.PHONY: build

all:

local:
	npm start

build:
	npm run build

run:
	npx serve -s build
