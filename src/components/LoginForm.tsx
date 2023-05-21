import React, { FormEvent, useState } from "react"
import axios from "axios"
import { Input, Status } from "./Interface"
import "./LoginForm.css"

const LoginForm = () => {
  const [inputData, setInputData] = useState<Input>({
    title: "",
    body: "",
    userId: 20,
  })
  const [status, setStatus] = useState<Status>({ isError: false, message: "" })

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputData(prevInputData => ({ ...prevInputData, [name]: value }))
  }

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputData.title || !inputData.body) {
      setStatus({
        isError: true,
        message: "Username and password are required.",
      })
      return
    }
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        inputData
      )
      if (response.status === 201) {
        setStatus({ isError: false, message: "Login successful" })
        setInputData({ title: "", body: "", userId: 20 })
        setTimeout(() => {
          setStatus({ isError: false, message: "" })
        }, 2000)
      }
    } catch (err) {
      setStatus({
        isError: true,
        message: "Something went wrong,please try again later.",
      })
    }
  }
  return (
    <div className="container">
      <form onSubmit={submitFormHandler}>
        <div>
          <label htmlFor="title">Username:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={inputData.title}
            onChange={inputHandler}
          />
        </div>
        <div>
          <label htmlFor="body">Password:</label>
          <input
            type="password"
            name="body"
            id="body"
            value={inputData.body}
            onChange={inputHandler}
          />
        </div>
        <div style={{ color: status.isError === true ? "red" : "green" }}>
          {status.message}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default LoginForm
