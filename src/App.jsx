import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { data, Route, Router, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Post from './components/pages/Post'
import About from './components/pages/About'
import Profile from './components/pages/Profile'
import api from './api/post'
import EditPost from './components/pages/EditPost'
import DeletePost from './components/pages/DeletePost'
import Missing from './components/pages/Missing'

const App = () => {
  const [loding, setLoding] = useState(true)
  const [search, setSearch] = useState('')
  const [searchResults,setSearchResults] = useState('')
  const [posts, setPosts] = useState([
    {
      id:1,
      title:"My First Post",
      img:"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=300&fit=crop",
      body:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime aut eveniet ut earum at voluptas alias. Ipsam est commodi molestias repellat similique animi, soluta, ex dolor esse rerum tempora ab.",
      date:"May 9" ,
      heartcount:10000,
      heart:true,
      commends:[]       
    },
    {
      id:2,
      title:"My Second Post",
      img:"https://picsum.photos/seed/picsum/450/300",
      body:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime aut eveniet ut earum at voluptas alias. Ipsam est commodi molestias repellat similique animi, soluta, ex dolor esse rerum tempora ab.",
      date:"May 9" ,
      heartcount:0,
      heart:false,
      commends:[]       
    },
    {
      id:3,
      title:"My Third Post",
      img:"https://picsum.photos/seed/picsum/450/300",
      body:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime aut eveniet ut earum at voluptas alias. Ipsam est commodi molestias repellat similique animi, soluta, ex dolor esse rerum tempora ab.",
      date:"May 9" ,
      heartcount:0,
      heart:false,
      commends:[]       
    }
  ])
  
  useEffect(() => {
    const fetchData = async () =>{
      try{
        const response = await api.get('/api/data')        
        const dataValue = (response.data)

        const data = dataValue.map((row) => {
          return {
            id: row[0],
            title: row[1],
            img: row[2],
            body: row[3],
            date: row[4],
            heartcount: parseInt(row[5]), // Ensure heartcount is a number
            heart: row[6] === 'TRUE'? true : false, // Convert "TRUE"/"FALSE" to boolean
            commends: row[7] || [] // Ensure commends is an array (default empty if undefined)
          };
        });
        setPosts(data)
        
      }
      catch(err){
        console.log(err)
      }
      finally{
        setLoding(false)
      }
    }
    fetchData()
  },[])

  useEffect(()=> {
    const filterResult = posts.filter((post)=> 
      ((post.title).toLowerCase()).includes(search.toLowerCase()) || ((post.body).toLowerCase()).includes(search.toLowerCase()) )
      setSearchResults(filterResult)
    },[posts, search])

  return (
    <div className='App'>
      <Navbar search={search} setSearch={setSearch} />
      <Routes>
        <Route path='/' element={<Home posts={searchResults} setPosts={setPosts} loding={loding} />} />
        <Route path='/post' element={<Post posts={posts} setPosts={setPosts}/>} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/edit/:id' element={<EditPost posts={posts} setPosts={setPosts}/>} />
        <Route path='/delete/:id' element={<DeletePost posts={posts} setPosts={setPosts}/>} />
        <Route path='*' element={<Missing />} />
      </Routes>
    </div>
  )
}

export default App