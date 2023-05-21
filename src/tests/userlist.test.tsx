import axios from "axios"
import "@testing-library/jest-dom"
import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UserList from "../components/UserList"

jest.mock("axios", () => ({
  get: jest.fn(),
}))
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("User List", () => {
  const mockUserList = [
    { id: 1, name: "user1", email: "user1@gmail.com" },
    { id: 2, name: "user2", email: "user2@gmail.com" },
    { id: 3, name: "user3", email: "user3@gmail.com" },
  ]
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockUserList, status: 200 })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it("should render the user list with default settings", async () => {
    render(<UserList />)
    const title = screen.getByTestId("user-list")
    expect(title).toHaveTextContent("User List")
    expect(screen.getByText("Sort By:")).toBeInTheDocument()
    expect(screen.getByText("Sort Direction:")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("search for a name or email")
    ).toBeInTheDocument()
    expect(screen.getByTestId("sort-by")).toHaveValue("name")
    expect(screen.getByTestId("sort-direction")).toHaveValue("asc")

    await waitFor(() => {
      mockUserList.forEach(user => {
        expect(
          screen.getByText(`${user.name}, ${user.email}`)
        ).toBeInTheDocument()
      })
    })
  })

  it("should render a list of users with correct name and email", async () => {
    render(<UserList />)
    await waitFor(() => {
      mockUserList.forEach(user => {
        expect(
          screen.getByText(`${user.name}, ${user.email}`)
        ).toBeInTheDocument()
      })
    })
  })

  it("should retrieve data from the API endpoint correctly", async () => {
    render(<UserList />)
    expect(mockedAxios.get).toBeCalledTimes(1)
    await waitFor(() => {
      expect(mockedAxios.get).toBeCalledWith(
        "https://jsonplaceholder.typicode.com/users"
      )
    })
  })

  it("sorts users correctly when sortBy and sortDirection properties are set", async () => {
    render(<UserList />)

    await waitFor(() => {
      expect(screen.getByText("user1, user1@gmail.com")).toBeInTheDocument()
    })

    userEvent.selectOptions(screen.getByTestId("sort-by"), ["email"])
    userEvent.selectOptions(screen.getByTestId("sort-direction"), ["desc"])

    await waitFor(() => {
      const sortedUserList = mockUserList.sort((a, b) =>
        b.email.localeCompare(a.email)
      )
      sortedUserList.forEach((user, i) => {
        const listItem = screen.getAllByRole("listitem")[i]
        expect(listItem).toHaveTextContent(`${user.name}, ${user.email}`)
      })
    })
  })
})
