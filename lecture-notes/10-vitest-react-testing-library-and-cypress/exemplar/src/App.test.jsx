import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    render(<App />);
    expect(screen.getByText("Pride and Prejudice")).toBeInTheDocument();
  });

  it("should click on the first Add to Cart button", () => {
    render(<App />);
    const button = screen.getByTestId("add-to-cart-1");
    userEvent.click(button);
  });
});
