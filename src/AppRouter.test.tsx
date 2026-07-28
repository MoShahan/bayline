import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { store } from "@/src/app/store";
import { AppRouter } from "@/src/AppRouter";

const renderAt = (path: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  );

describe("AppRouter", () => {
  it("renders the home page at /", () => {
    renderAt("/");

    expect(
      screen.getByRole("heading", { name: "Parking deck control" }),
    ).toBeInTheDocument();
  });

  it("redirects unknown routes to the home page", () => {
    renderAt("/random/path");

    expect(
      screen.getByRole("heading", { name: "Parking deck control" }),
    ).toBeInTheDocument();
  });
});
