
import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';
import { $, expect } from '@wdio/globals';

import { TestButton } from './button';

describe('TestButton', () => {
  it('should render properly with text', async () => {
    render({
      components: [TestButton],
      template: () => (
        <test-button>Button</test-button>
      ),
    });

    const button = await $('test-button');

    await expect(button).toHaveText('Button');

    await expect(button).toMatchElementSnapshot('test-button');
  });

});
