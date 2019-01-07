import React, { Component } from "react";
import { bindAll, get } from "lodash";
import "./App.css";
import PassRequest from "./Requests/passCheck";

export const getTextForInput = (pin: string) =>
  pin.length > 1
    ? pin.slice(0, -1).replace(/[0-9]/g, "*") + pin[pin.length - 1]
    : pin;

class App extends Component {
  constructor() {
    super();

    this.state = {
      enteredPin: "",
      feedbackMessage: "",
      errorCounter: 0
    };

    this.buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    bindAll(this, ["renderButtons", "displayPinHandler", "checkPinHandler"]);
  }

  buttons: Array<number>;

  componentDidMount() {
    PassRequest().then(response =>
      this.setState({
        validPin: get(response, "data.pin")
      })
    );
  }

  checkPinHandler(pin: string): void {
    if (parseInt(pin, 10) === this.state.validPin) {
      this.setState({
        enteredPin: "",
        feedbackMessage: "OK"
      });
    } else if (this.state.errorCounter < 3) {
      this.setState({
        enteredPin: "",
        feedbackMessage: "wrong password",
        errorCounter: this.state.errorCounter + 1
      });
    } else {
      this.setState({
        enteredPin: "",
        feedbackMessage: "LOCKED"
      });
      setTimeout(() => {
        this.setState({
          feedbackMessage: "",
          errorCounter: 0,
          enteredPin: ""
        });
      }, 5000);
    }
  }

  displayPinHandler(pin: string): void {
    const value = this.state.enteredPin + pin;
    value.length < 4
      ? this.setState({
          enteredPin: value,
          feedbackMessage: ""
        })
      : this.checkPinHandler(value);
  }

  renderButtons(buttons: Array<number>): Array<Element> {
    return buttons.map((buttonVal: number) => (
      <button
        key={buttonVal}
        className="numberButton"
        onClick={() => this.displayPinHandler(buttonVal.toString())}
      >
        {buttonVal}
      </button>
    ));
  }

  render() {
    const appStyles =
      this.state.feedbackMessage.toLowerCase() === "locked"
        ? "app appLocked"
        : "app";
    return (
      <div className={appStyles}>
        <div className="pinCheckContainer">
          <div className="pinContainer">
            <input
              type="text"
              className="pinInput"
              value={
                this.state.feedbackMessage !== ""
                  ? this.state.feedbackMessage
                  : getTextForInput(this.state.enteredPin)
              }
            />
          </div>
          <div className="buttonContainer">
            {this.renderButtons(this.buttons)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
