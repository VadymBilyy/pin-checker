import React from "react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import tjson from "enzyme-to-json";
import mockAxios from "jest-mock-axios";
import App, { getTextForInput } from "./App";
import { shallow, mount } from "enzyme";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
/*
jest.mock("./Requests/passCheck", () => () =>
  Promise.resolve({
    data: {
      pin: 1234
    }
  })
);
*/
configure({ adapter: new Adapter() });

describe("Pin-check app tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const mock = new MockAdapter(axios);
    mock.onGet("https://mock-endpoints.herokuapp.com/passcode").reply(200, {
      pin: 1234
    });
  });

  test("Render App correctly", done => {
    const component = mount(<App />);

    setImmediate(() => {
      expect(component.instance().state.validPin).toEqual(1234);
      done();
    });
  });

  test("Check if pin is wrong", () => {
    const component = shallow(<App />);

    component.instance().checkPinHandler("2345");
    expect(component.instance().state).toEqual({
      enteredPin: "",
      errorCounter: 1,
      feedbackMessage: "wrong password"
    });
  });

  test("Check if pin is right", done => {
    const component = shallow(<App />);

    setImmediate(() => {
      component.instance().checkPinHandler("1234");
      expect(component.instance().state).toEqual({
        enteredPin: "",
        errorCounter: 0,
        feedbackMessage: "OK",
        validPin: 1234
      });
      done();
    });
  });

  test("Lock checker if number of errors > 3", () => {
    const component = shallow(<App />);

    component.instance().setState({ errorCounter: 3 });
    component.instance().checkPinHandler("2345");
    expect(component.instance().state).toEqual({
      enteredPin: "",
      errorCounter: 3,
      feedbackMessage: "LOCKED"
    });
  });

  test("Format pin to dispaly with *", () => {
    expect(getTextForInput("123")).toEqual("**3");
  });

  test("Format pin to dispaly without *", () => {
    expect(getTextForInput("1")).toEqual("1");
  });
});
