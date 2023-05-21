export interface Input {
  title: string
  body: string
  userId: number
}

export interface Status {
  isError: boolean
  message: string
}

export interface User {
  id: number
  name: string
  email: string
}
