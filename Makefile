.PHONY: build

all:

local:
	npm start

build:
	npm run build

run:
	npx serve -s build

release:
	-rm -rf ./docs
	cp -R ./build ./docs
