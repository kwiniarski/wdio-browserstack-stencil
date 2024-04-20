# WebdriverIO + BrowserStack + Stencil

1. Copy `.env.local` as `.env`
2. Setup variables in `.env` - `BROWSERSTACK_USERNAME` & `BROWSERSTACK_ACCESS_KEY`
3. Run `pnpm i`
4. Run `pnpm test` - in BrowserStack test build should be named "Local" without build number
5. Remove `BROWSERSTACK_BUILD_NAME` from `.env` (hardcoded default from `wdio.conf.mts` will be used)
6. Run `pnpm test` again - in BrowserStack test build should be named "Local 1" - as expected