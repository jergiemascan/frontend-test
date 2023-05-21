import axios from "axios"
import "@testing-library/jest-dom"
import { act, fireEvent, render, screen } from "@testing-library/react"
import LoginForm from "../components/LoginForm"
import userEvent from "@testing-library/user-event"

jest.mock("axios", () => ({
  post: jest.fn(),
}))
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("LoginForm", () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockedAxios.post.mockRestore()
  })

  it("should render login form with default settings", () => {
    render(<LoginForm />)
    expect(screen.getByLabelText("Username:")).toBeInTheDocument()
    expect(screen.getByLabelText("Password:")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("should submit form with user input correctly", async () => {
    const inputData = {
      title: "username_value",
      body: "password_value",
      userId: 20,
    }
    const response = { status: 201, data: inputData }
    mockedAxios.post.mockResolvedValue(response)
    render(<LoginForm />)

    await act(async () => {
      userEvent.type(screen.getByLabelText("Username:"), inputData.title)
      userEvent.type(screen.getByLabelText("Password:"), inputData.body)
    })
    await act(async () => {
      fireEvent.click(screen.getByRole("button"), { name: /submit/i })
    })
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      inputData
    )
  })
})
