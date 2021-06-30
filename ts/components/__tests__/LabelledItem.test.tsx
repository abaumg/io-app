import { fireEvent, render } from "@testing-library/react-native";
import { isString } from "lodash";
import React from "react";
import { LabelledItem, Props } from "../LabelledItem";
import { InputProps } from "../LabelledItem/Input";

jest.mock("react-navigation", () => ({
  NavigationEvents: "mockNavigationEvents"
}));

const textInputProps: InputProps = {
  type: "text",
  inputProps: { value: "value" }
};
const textInputMaskProps: InputProps = {
  type: "masked",
  inputMaskProps: {
    value: "value",
    type: "custom",
    options: {
      mask: "9999 9999 9999 9999 999"
    }
  }
};
const onPress = jest.fn();
const icon = "io-place";
const iconPosition = "left";
const testID = "Text";

describe("Test LabelledItem", () => {
  it("should be not null", () => {
    const component = renderComponent(textInputProps);

    expect(component).not.toBeNull();
  });
  it("should render label if is defined", () => {
    const component = renderComponent({ ...textInputProps, label: "label" });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("label")).not.toBeNull();
  });
  it("should render NavigationEvents if hasNavigationEvents is true and onPress is defined", () => {
    const component = renderComponent({
      ...textInputProps,
      hasNavigationEvents: true,
      onPress
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("NavigationEvents")).not.toBeNull();
  });
  it("should render Icon if iconPosition is left and icon is defined", () => {
    const component = renderComponent({
      ...textInputProps,
      iconPosition,
      icon
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("Icon")).not.toBeNull();
  });
  it("should render Icon if iconPosition is right and icon is defined", () => {
    const component = renderComponent({
      ...textInputProps,
      iconPosition: "right",
      icon
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("Icon")).not.toBeNull();
  });
  it("should render description if is defined", () => {
    const component = renderComponent({
      ...textInputProps,
      description: "description"
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("description")).not.toBeNull();
  });
  it("should render TextInputMask if type is equal to masked", () => {
    const component = renderComponent({
      ...textInputMaskProps,
      testID
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId(`${testID}InputMask`)).not.toBeNull();
  });
  it("should render InputNativeBase if type is equal to text", () => {
    const component = renderComponent({
      ...textInputProps,
      testID
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId(`${testID}Input`)).not.toBeNull();
  });
  it("should render IconFont if icon is a string", () => {
    const component = renderComponent({
      ...textInputProps,
      iconPosition,
      icon
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("Icon")).not.toBeNull();
    expect(isString(icon)).toBeTruthy();
    expect(component.queryByTestId("IconFont")).not.toBeNull();
  });
  it("should render Image if icon is not a string", () => {
    const iconImage = 1;
    const component = renderComponent({
      ...textInputProps,
      iconPosition,
      icon: iconImage
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("Icon")).not.toBeNull();
    expect(isString(iconImage)).toBeFalsy();
    expect(component.queryByTestId("Image")).not.toBeNull();
  });
  it("should call onPress if is defined and icon is pressed", () => {
    const component = renderComponent({
      ...textInputProps,
      iconPosition,
      icon,
      onPress
    });

    expect(component).not.toBeNull();
    expect(component.queryByTestId("Icon")).not.toBeNull();
    expect(isString(icon)).toBeTruthy();
    const iconFontComponent = component.getByTestId("IconFont");
    expect(iconFontComponent).not.toBeNull();
    fireEvent.press(iconFontComponent);
    expect(onPress).toHaveBeenCalled();
  });
});

const renderComponent = (props: Props) => render(<LabelledItem {...props} />);
