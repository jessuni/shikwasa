publish:
	@rm -fr dist
	@npm run build
	@cat package.json | grep version
	@npm publish

deploy:
	npm run build:demo
	@cp ./pages/public/assets ./public/assets
	@cp ./pages/public/CNAME ./public
	@node gh.js
	@rm -fr ./public
