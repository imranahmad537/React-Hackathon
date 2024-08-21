import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Signup from './Components/Signup'
import {Signin} from './Components/Signin'
import Main from './Components/Main'


//import {StudentList} from './Students/StudentList.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'

// import {StudentList} from './Students/StudentList.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    //element: {user ? <Navigate to="/dashboard" : <Login/>}
    element: <Signin/>
  },
  {
    path:'/signup',
   element: <Signup/>
  },
  {
    path:'/signin',
    element:<Signin/>
  },

  {
    path:'/main',
    element:<Main/>
  },
  // {
  //   path:'/studentList',
  //   element:<StudentList/>
  // }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <RouterProvider router={router}></RouterProvider>
    <ToastContainer/>
  </React.StrictMode>,

)
