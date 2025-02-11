import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EditPost.css'
import { format } from 'date-fns';
import api from '../../api/post'

const EditPost = ({posts, setPosts}) => {
  const {id} = useParams()
  const [edittitle, setEditTitle] = useState()
  const [editContent, setEditContent] = useState()
  const navigate = useNavigate()

  const post = posts.find((post) => (post.id).toString() === id)

  useEffect(()=>{
    setEditTitle(post.title)
    setEditContent(post.body)
  },[post])

  const handleEditSubmit = async (id) =>{
      const updatedRow = posts.find(post => post.id === id);
      if (!updatedRow) {
      console.error("Error: Post not found");
      return;
      }
      const datetime = format(new Date(), 'MMMM dd')
      

      try{
        const response = await api.put(`/api/data/${id}`, {
             values: [updatedRow.id, edittitle, updatedRow.img, editContent , datetime, updatedRow.heartcount, updatedRow.heart ],
          });
        console.log(response)
      }
      catch(err){
            console.log(err)
      }  
      finally{
        setPosts(posts.map((post)=> post.id === id ? {...post, title:edittitle,body:editContent, date:datetime} : post))
        navigate('/')
      }         
  }


  return (
    <div className='EditPost'>
      <form className='postform' onSubmit={(e) => e.preventDefault()}>
        <h2>Edit Post</h2>
        <label htmlFor="title">Title:</label>
        <input 
          type="text"
          id='title'
          placeholder='Enter The Title'
          autoFocus
          required
          value={edittitle}
          onChange={(e)=>setEditTitle(e.target.value)}
        />
        <label htmlFor="content">Content:</label>
        <textarea 
          name="textarea" 
          id="content"
          placeholder='Enter The Content Of The Post'
          required
          autoFocus
          value={editContent}
          onChange={(e)=>setEditContent(e.target.value)}
          >
        </textarea>
        <button type='Submit' onClick={(e)=>handleEditSubmit(post.id)}>Post</button>
      </form>
    </div>
  )
}

export default EditPost