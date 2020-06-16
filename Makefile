publish:
	@rm -fr dist
	@npm run build
	@cat package.json | grep version
	@npm publish

deploy:
	@rm -fr public
	npm run build:demo
	@cp -r ./pages/public/assets/ ./public/assets
	@cp ./pages/public/CNAME ./public
	@node gh.js
	@rm -fr ./public
