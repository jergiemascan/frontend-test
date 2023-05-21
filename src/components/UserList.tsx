import React, { ChangeEvent, useEffect, useState } from "react"
import axios from "axios"
import { User, Status } from "./Interface"
import { orderBy } from "lodash"
import "./UserList.css"

type SortOption = "name" | "email"
type SortOrder = "asc" | "desc"

const UserList = () => {
  const [sortOption, setSortOption] = useState<SortOption>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [users, setUsers] = useState<User[]>([])
  const [searchInput, setSearchInput] = useState<string>("")
  const [status, setStatus] = useState<Status>({ isError: false, message: "" })

  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      )
      if (response.status !== 200) {
        setStatus({ isError: true, message: response.status.toString() })
      }
      if (response.data.length === 0) {
        setStatus({ isError: true, message: "No users found" })
      } else {
        setUsers(orderBy(response.data, sortOption, sortOrder))
      }
    } catch (err: unknown) {
      setStatus({ isError: true, message: "Something went wrong" })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    setUsers(prevUsers => orderBy([...prevUsers], sortOption, sortOrder))
  }, [sortOption, sortOrder])

  const sortOptionHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption)
  }
  const sortOrderHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as SortOrder)
  }

  const fiterUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email.toLowerCase().includes(searchInput.toLowerCase())
  )

  return (
    <div className="container">
      <div className="inner-container">
        <h1 data-testid="user-list">User List</h1>
        <div className="select-wrapper">
          <div className="sort-wrapper">
            <label htmlFor="sort-by">Sort By:</label>
            <select
              data-testid="sort-by"
              name="sort-by"
              id="sort-by"
              value={sortOption}
              onChange={sortOptionHandler}
            >
              <option value="name" defaultValue="Name">
                Name
              </option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="sort-wrapper">
            <label htmlFor="sort-direction">Sort Direction:</label>
            <select
              data-testid="sort-direction"
              name="sort-direction"
              id="sort-direction"
              value={sortOrder}
              onChange={sortOrderHandler}
            >
              <option value="asc" defaultValue="Asc">
                Asc
              </option>
              <option value="desc">Desc</option>
            </select>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="search for a name or email"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div style={{ color: status.isError === true ? "red" : "green" }}>
          {status.message}
        </div>
        <ul>
          {fiterUsers.map(user => (
            <li key={user.id}>
              {user.name}
              {","} {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default UserList
