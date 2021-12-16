import React, { useEffect, useState } from 'react'
import emailjs from 'emailjs-com'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import { shuffleArray } from './utils'

function App() {
  const [userList, setUserList] = useState([])
  useEffect(() => {
    setUserList([emptyUser()])
  }, [])

  const emptyUser = () => ({ id: uuidv4(), name: '', email: '' })

  const addUser = () => {
    setUserList([...userList, emptyUser()])
  }

  const removeUser = () => {
    setUserList([...userList.slice(0, userList.length - 1)])
  }

  const editUser = (index, payload) => {
    const userListCopy = [...userList]
    userListCopy[index] = {
      id: userListCopy[index].id,
      name: payload.name || userListCopy[index].name,
      email: payload.email || userListCopy[index].email,
    }
    setUserList(userListCopy)
  }

  const submit = async () => {
    alert('enviando os emails')
    const shuffledUserList = shuffleArray(userList)
    await shuffledUserList.forEach(async (user, index) => {
      await emailjs
        .send(
          'emailjs-secret-santa',
          'template_secret_santa',
          {
            to_name: user.name,
            to_email: user.email,
            secret_santa:
              index === shuffledUserList.length - 1
                ? shuffledUserList[0].name
                : shuffledUserList[index + 1].name,
          },
          'user_0t0jGe9cNkeSFkD9ze7QZ',
        )
        .then(
          (result) => {
            console.log(result.text)
          },
          (error) => {
            console.log(error.text)
          },
        )
    })
    alert('emails enviados')
  }

  return (
    <div className="App">
      {userList.map((user, index) => (
        <div key={user.id}>
          <input
            placeholder="nome"
            value={user.name}
            onChange={(e) => {
              editUser(index, { name: e.target.value })
            }}
          />
          <input
            placeholder="email"
            value={user.email}
            onChange={(e) => {
              editUser(index, { email: e.target.value })
            }}
          />
        </div>
      ))}
      <button onClick={addUser}>Adicionar mais uma pessoa</button>
      <button onClick={removeUser}>Remover ultima pessoa</button>
      <button onClick={submit}>Sortear</button>
    </div>
  )
}

export default App
