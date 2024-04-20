
import { AttachInternals, Component, ComponentInterface, h, JSX, Prop } from '@stencil/core';

@Component({
  tag: 'test-button',
  styleUrl: './button.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  }
})
export class TestButton implements ComponentInterface {
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';

  @Prop({ reflect: true }) disabled: boolean = false;

  @Prop() value = void 0;

  @AttachInternals() internals!: ElementInternals;

  handleClick = (): void => {
    if (this.type !== 'button' && this.internals) {
      const form = this.internals.form;
      if (form) {
        form[this.type]();
      }
    }
  };

  render(): JSX.Element {
    const { type, disabled } = this;

    return (
      <button type={type} disabled={disabled} part='base' onClick={this.handleClick}>
        <slot></slot>
      </button>
    );
  }
}
