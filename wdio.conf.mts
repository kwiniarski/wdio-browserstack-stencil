import { dirname, resolve } from 'node:path';
import { env } from 'node:process';

import type { Options } from '@wdio/types';

const __dirname = dirname(new URL(import.meta.url).pathname);
const workspaceRoot = resolve(__dirname);

function bsOptions(options) {
  const bsDefaultOptions = {
    projectName: env.BROWSERSTACK_PROJECT_NAME,
    buildName: env.BROWSERSTACK_BUILD_NAME ?? 'Local',
    consoleLogs: 'verbose',
    networkLogs: true,
    local: true,
    debug: true,
  };

  return {...bsDefaultOptions, ...options};
}

export const config: Options.Testrunner = {
  maxInstances: 1,
  maxInstancesPerCapability: 1,
  user: env.BROWSERSTACK_USERNAME,
  key: env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  logLevel: 'info',
  framework: 'mocha',
  specs: [`./packages/*/src/**/*.test.tsx`],
  exclude: [],
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000
  },
  reporters: [
    [
      'spec',
      {
        showPreface: false,
      },
    ]
  ],
  runner: [
    'browser',
    {
      preset: 'stencil'
    },
  ],
  services: [
    [
      'visual',
      {
        screenshotPath: resolve(workspaceRoot, 'tmp/screenshots'),
        savePerInstance: true,
      },
    ],
    [
      'browserstack',
      {
        browserstackLocal: true,
        // @see https://github.com/webdriverio/webdriverio/issues/12672
        buildIdentifier: '${BUILD_NUMBER}',
        testObservability: true,
        sessionNameFormat(config, capabilities, suiteTitle, testTitle) {
            return suiteTitle;
        },
        opts: {
          forceLocal: false,
          onlyAutomate: true,
        },
      },
    ],
  ],
  capabilities: [
    {

      browserName: 'Chrome',
      'bstack:options': bsOptions({
        buildTag: 'desktop',
        browserVersion: '123.0',
        os: 'Windows',
        osVersion: '11',
      }),
    },
  ],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.test.json',
      transpileOnly: true,
    },
  },
};
