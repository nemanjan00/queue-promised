#!/bin/bash

mkdocs () {
	echo "# $1 \\[[Home](https://github.com/nemanjan00/queue-promised)\\]" > docs/wrapper.md
	./node_modules/.bin/jsdoc2md $2 >> docs/wrapper.md 
}

mkdocs wrapper ./src/wrapper/index.js

