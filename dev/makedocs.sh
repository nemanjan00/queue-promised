#!/bin/bash

echo "# docs" > docs/README.md
echo "This folder contains full API docs for these functions: " >> docs/README.md

mkdocs () {
	echo "# $1" > docs/wrapper.md
	./node_modules/.bin/jsdoc2md $2 >> docs/wrapper.md 

	echo "* [$1](https://github.com/nemanjan00/queue-promised/blob/master/docs/$1.md)" >> docs/README.md
}

mkdocs wrapper ./src/wrapper/index.js

