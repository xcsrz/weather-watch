
default:
	@echo you must specify a target (action)

clean:
	rm images/*.webp

clean-all: clean
	rm animations/*

run:
	npm start

daily: run
	LATEST=$$(ls -t animations/*.webp | head -n 1); \
	sed -i '' "s~^\!\[Latest.*$$~![Latest US Weather Animation]\(`ls -t animations/*.webp | head -n 1`\)~" README.md
	sed -i '' "s~^### Image Updated: .*$$~### Image Updated: `date`~" README.md
	git add animations README.md && git commit -m "daily update `date`" && git push