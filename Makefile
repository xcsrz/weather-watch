
default:
	@echo you must specify a target (action)

clean:
	rm images/*.webp

clean-all: clean
	rm animations/*

run:
	npm start

test:
	LATEST=$$(ls -t animations/*.webp | head -n 1); \
	echo $$LATEST;

daily: run
	LATEST=$$(ls -t animations/*.webp | head -n 1); \
	sed -i '' 's/^\!\[.*$/![Latest US Weather Animation]($$LATEST)/' README.md
	# git add animations README.md && git commit -m  && git push