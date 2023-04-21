
default:
	@echo you must specify a target (action)

clean:
	rm images/*.webp

clean-all: clean
	rm animations/*

run:
	npm start

test:
	# echo ">> `ls -t animations/*.webp | head -n 1` <<"
	# echo ">>$$LATEST<<"; \ 
	# LATEST=$$(ls -t animations/*.webp | head -n 1); echo ">>$$LATEST<<"; \
	# sed -i '' "s~^\!\[.*$$~![Latest US Weather Animation]\(`ls -t animations/*.webp | head -n 1`\)~" README.md
	# sed -i '' "s/^\!\[.*$$/![Latest US Weather Animation]\(`ls -t animations/*.webp | head -n 1`\)/" README.md

	# sed -i '' "s~^### Updated: .*$$~### Updated: `date`~" README.md

daily: run
	LATEST=$$(ls -t animations/*.webp | head -n 1); \
	sed -i '' "s~^\!\[Latest.*$$~![Latest US Weather Animation]\(`ls -t animations/*.webp | head -n 1`\)~" README.md
	sed -i '' "s~^### Updated: .*$$~### Updated: `date`~" README.md
	git add animations README.md && git commit -m "daily update `date`" && git push