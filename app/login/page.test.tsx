import "@testing-library/jest-dom";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LoginPage from "./page";

const mockPush = jest.fn();
const mockLogin = jest.fn();
const mockRegister = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("показывает форму входа", () => {
    render(<LoginPage />);

    expect(
      screen.getByPlaceholderText("Эл. почта"),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Пароль"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Войти",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Зарегистрироваться",
      }),
    ).toBeInTheDocument();
  });

  it("переключается на форму регистрации", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Зарегистрироваться",
      }),
    );

    expect(
      screen.getByPlaceholderText(
        "Повторите пароль",
      ),
    ).toBeInTheDocument();
  });

  it("показывает ошибку для некорректного email", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.type(
      screen.getByPlaceholderText("Эл. почта"),
      "wrong@email",
       );

    await user.type(
      screen.getByPlaceholderText("Пароль"),
      "Password!!",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Войти",
      }),
    );

    expect(
      screen.getByText("Введите корректный Email"),
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("показывает ошибку, если пароли не совпадают", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Зарегистрироваться",
      }),
    );

    await user.type(
      screen.getByPlaceholderText("Эл. почта"),
      "test@example.com",
    );

    await user.type(
      screen.getByPlaceholderText("Пароль"),
      "Password!!",
    );

    await user.type(
      screen.getByPlaceholderText(
        "Повторите пароль",
      ),
      "Password!1",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Зарегистрироваться",
      }),
    );

    expect(
      screen.getByText("Пароли не совпадают"),
    ).toBeInTheDocument();

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("выполняет вход и переходит в профиль", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />);

    await user.type(
      screen.getByPlaceholderText("Эл. почта"),
      "test@example.com",
    );

    await user.type(
      screen.getByPlaceholderText("Пароль"),
      "Password!!",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Войти",
      }),
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password!!",
      });
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/profile",
    );
  });
});
