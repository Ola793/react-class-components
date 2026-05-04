import { Component } from 'react';

interface ErrorButtonState {
  hasError: boolean;
}

export class ErrorButton extends Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  handleClick = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('Test application error');
    }

    return (
      <button className="error-button" type="button" onClick={this.handleClick}>
        Simulate error
      </button>
    );
  }
}