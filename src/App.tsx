import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginForm from "./components/LoginForm"
import UserList from "./components/UserList"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserList/>}/>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
