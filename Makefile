publish:
	@rm -fr dist
	@npm run build
	@cat package.json | grep version
	@npm publish

deploy:
	@rm -fr public
	npm run build:demo
	@node gh.js
	@rm -fr ./public
