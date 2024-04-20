/* eslint-disable @typescript-eslint/ban-ts-comment */
import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';
import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { inlineSvg } from 'stencil-inline-svg';

import pkg from './package.json';

export const outputDir = '../../dist/packages/sc';
export const targetPackagesDir = '../../packages';
export const angularValueAccessorBindings: ValueAccessorConfig[] = [];

export const config: Config = {
  namespace: 'Test',
  sourceMap: false,
  enableCache: true,
  tsconfig: './tsconfig.lib.json',
  transformAliasedImportPaths: true,
  buildEs5: 'prod',
  plugins: [
    inlineSvg(),
    sass({
      includePaths: ['./src/styles'],
    }),
  ],
  extras: {
    enableImportInjection: true,
    experimentalSlotFixes: true,
  },
  testing: {
    testRegex: '(/__tests__/.*|\\.?(spec))\\.(ts|js)$',
    setupFilesAfterEnv: ['<rootDir>/testing/jest.setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/*.tsx',
      '!**/*.stories.{ts,tsx}',
      '!**/*.spec.{ts,tsx}',
      '!**/*.e2e.{ts,tsx}',
      '!**/node_modules/**',
    ],
    coverageDirectory: './coverage',
    // @ts-ignore
    coverageProvider: 'v8',
    coverageReporters: ['clover', 'cobertura', 'html-spa', 'lcov'],
    transform: {
      '^.+\\.(ts|tsx|js|jsx|css)$': '@stencil/core/testing/jest-preprocessor',
      // Jest doesn't use webpack and it doesn't know how to load files with extensions other than (js/jsx).
      // We have to add support for svg file with custom transformer so that it is able to build packages.
      '^.+\\.svg$': '<rootDir>/utils/svg-transform.mjs',
    },
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  globalStyle: './src/styles/global.scss',
  validatePrimaryPackageOutputTarget: true,
  outputTargets: [
    {
      type: 'dist',
      isPrimaryPackageOutputTarget: true,
      dir: `${outputDir}/dist`,
      empty: true,
      esmLoaderPath: '../loader',
      collectionDir: 'collection',
      typesDir: `types`,
    },
    {
      type: 'dist-custom-elements',
      isPrimaryPackageOutputTarget: false,
      dir: `${outputDir}/components`,
      empty: true,
      generateTypeDeclarations: false,
      customElementsExportBehavior: 'single-export-module',
      copy: [
        {
          src: '../scripts/custom-elements',
          dest: `${outputDir}/components`,
          warn: true,
        },
      ],
      includeGlobalScripts: false,
    },
    {
      type: 'dist-hydrate-script',
      dir: `${outputDir}/hydrate`,
    },
    {
      type: 'docs-vscode',
      file: `${outputDir}/vscode.json`,
    },
    angularOutputTarget({
      componentCorePackage: pkg.name,
      directivesProxyFile: `${targetPackagesDir}/core-angular/src/generated/directives/proxies.ts`,
      directivesArrayFile: `${targetPackagesDir}/core-angular/src/generated/directives/index.ts`,
      valueAccessorConfigs: angularValueAccessorBindings,
      outputType: 'standalone',
      excludeComponents: [],
    }),
    reactOutputTarget({
      componentCorePackage: pkg.name,
      includeDefineCustomElements: false,
      includeImportCustomElements: true,
      customElementsDir: `components`,
      proxiesFile: `${targetPackagesDir}/core-react/src/generated/components/proxies.ts`,
      excludeComponents: [],
    }),
  ],
};
