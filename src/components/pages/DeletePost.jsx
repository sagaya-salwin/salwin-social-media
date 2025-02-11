import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './DeletePost.css'
import api from '../../api/post'

const DeletePost = ({posts, setPosts}) => {

  const navigate = useNavigate()
  const {id} = useParams()
  const post = posts.find((post) => (post.id).toString() === id)


  const handleDelete = async () =>{
    try {
      const response = await api.delete(`/api/data/${id}`);
      console.log(response.data);
  
     /* // Update state to remove the deleted post
      setPosts(posts.filter((post) => post.id !== id)); 
      navigate('/')*/

    } catch (error) {
      console.error("Error deleting post:", error);
    }
    finally{
      setPosts(posts.filter((post) => (post.id).toString() !== id));
      navigate('/')
    }
  }
  return (
    <div className='DeletePost'>
      <div className='DeletePost-post'>
        <h2>{post.title}</h2>
        <img src={post.img} alt="No Image" />
        <p>{post.body}</p>
        <button onClick={()=>handleDelete(post.id)}>Delete</button>
      </div>
    </div>
  )
}

export default DeletePost