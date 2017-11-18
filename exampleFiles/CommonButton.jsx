const { PropTypes: types } = React;

class CommonButton extends Scribd.Shared.BaseComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    className: types.string,
    children: types.oneOfType([types.arrayOf(types.element), types.element]),
    disabled: types.bool,
    text: types.string,
    onClick: types.func,
    type: types.string,
    data_props: types.object,
    aria_props: types.object,

    // provided either href or target will return an <a> instead of a <button>
    href: types.string,
    target: types.string,
    is_facebook_button: types.bool,
    is_google_button: types.bool
  };

  static defaultProps = {
    type: 'button',
    is_facebook_button: false,
    is_google_button: false,
    data_props: {},
    aria_props: {}
  };

  // Overriding render because we don't want a wrapping div
  render() {
    let Tag = this.get_tag();
    let className = classNames(
      this.props.className,
      'flat_btn',
      this.enclosing_class,
      { disabled: this.props.disabled }
    );

    return (
      <Tag
        className={className}
        onClick={this.props.onClick}
        aria-disabled={this.props.disabled ? 'true' : null}
        role={this.props.role}
        type={Tag === 'button' ? this.props.type : null}
        target={this.props.target}
        data-tooltip={this.props['data-tooltip'] || null}
        href={this.props.href}
        {...this.get_data_props()}
        {...this.get_aria_props()}
      >
        {this.render_content()}
        {this.render_spinner()}
        {this.props.text}
      </Tag>
    );
  }

  render_spinner() {
    return (
      <div
        key="spinner"
        aria-hidden="true"
        className="scribd_spinner"
        data-size={30}
      />
    );
  }

  // by maintaining the render_content signature, CommonButton
  // can be extended to make more complex buttons, more easily
  render_content() {
    let children = this.props.children || [];

    // TODO: find where className is used to dictate facebook &
    // google buttons and update so it's not a secret feature
    //
    // create <FacebookCommonButton> and <GoogleCommonButton>
    // to achieve this?
    if (
      this.props.is_facebook_button ||
      /\bfacebook\b/.test(this.props.className)
    ) {
      children.unshift(this.render_facebook_icon());
    } else if (
      this.props.is_google_button ||
      /\bgoogle\b/.test(this.props.className)
    ) {
      children.unshift(this.render_google_icon());
    }

    return children;
  }

  render_facebook_icon() {
    return (
      <span key="icon" aria-hidden="true" className="icon icon-ic_facebook" />
    );
  }

  render_google_icon() {
    return <span key="icon" aria-hidden="true" className="icon icon-google" />;
  }

  get_tag() {
    let tag = 'button';

    if (
      typeof this.props.href !== 'undefined' ||
      typeof this.props.target !== 'undefined'
    ) {
      tag = 'a';
      if (typeof this.props.disabled !== 'undefined') {
        console.error("You can't disable anchors");
      }
    }

    return tag;
  }

  get_data_props() {
    let data_props = {};

    if (this.props.data_props) {
      Object.keys(this.props.data_props).forEach(key => {
        const val = this.props.data_props[key];
        data_props[`data-${key}`] = val;
      });
    }

    return data_props;
  }

  get_aria_props() {
    let aria_props = {};

    if (this.props.aria_props) {
      Object.keys(this.props.aria_props).forEach(key => {
        const val = this.props.aria_props[key];
        aria_props[`aria-${key}`] = val;
      });
    }

    return aria_props;
  }
}

Scribd.addComponent('Shared.React.CommonButton', CommonButton);
