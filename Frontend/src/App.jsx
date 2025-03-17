import React from 'react'
import { UserContextProvider } from './UserContext'
import {HashRouter as Route,Router,Routes} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import CreatePost from './Pages/CreatePost'
import axios from 'axios'
import ArticleList from './Pages/ArticleList'
import {getDatabase} from 'firebase/database'
import {app} from './FireBase'
import ArticlePage from './Pages/ArticlePage'
import Footer from './Pages/Footer'
import ArticleEdit from './Pages/ArticleEdit'
import ArticleCategory from './Pages/ArticleCategory'
import EditPost from './Pages/EditPost'
import UserArticles from './Pages/UserArticles'
import AboutUs from './Pages/AboutUs'
import ContactPage from './Pages/Contact'
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const {user, isAuthenticated} = useAuth0();
  const {loginWithRedirect} = useAuth0();
  return (
    <div>
      <UserContextProvider>
      
     
        <Routes>
          
           
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/articles' element={<ArticleList />} />
          <Route path='/articles/:id' element={<ArticlePage />} />
          <Route path='/footer' element={<Footer />} />
          <Route path='/articles/:id/edit' element={<EditPost />} />
          <Route path='/category/:categoryname' element={<ArticleCategory />} />
          <Route path='/yourarticles/:id' element={<UserArticles />} />
          <Route path='/aboutus' element={<AboutUs/>}/>
          <Route path='/contact' element={<ContactPage/>}/>
          
        </Routes>
      </UserContextProvider>
    </div>
  )
}

export default App