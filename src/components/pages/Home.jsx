import React, { useState } from 'react'
import { FaRegHeart  } from "react-icons/fa";
import { FaHeart  } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import './Home.css';
import api from "../../api/post";
import EditMenuLayout from './EditMenuLayout';



const Home = ({posts, setPosts, loding}) => {

    const [editMenu, setEditMenu] = useState({})
    const [showFullContent, setShowFullContent] = useState(false)
    const [showFullContentId, setShowFullContentId] = useState({}) 

    const handleLike = async (id, heart) =>{

            const updatedRow = posts.find(post => post.id === id);
            if (!updatedRow) {
            console.error("Error: Post not found");
            return;
            }

            // Send only the updated post's values
            const heartcount = heart ? updatedRow.heartcount - 1 : updatedRow.heartcount + 1
            setPosts(posts.map((post)=> post.id === id ? {...post, heart:!heart, heartcount:heartcount} : post))

            try{
                const response = await api.put(`/api/data/${id}`, {
                    values: [updatedRow.id, updatedRow.title, updatedRow.img, updatedRow.body,updatedRow.date, heartcount, !updatedRow.heart ],
                });
                console.log(response)
            }
            catch(err){
                console.log(err)
            }                
    }

    const handleEditMenu = (PostId) =>{
        setEditMenu((prev)=>(
            {...prev, [PostId]:!prev[PostId]}
        ));

    }
    const handleShowFullContent = (PostId) =>{
        setShowFullContentId((prev) =>(
            {...prev, [PostId]:!prev[PostId]}
        ));
    }
    

  return (
    <div className='Home'>
        
        {loding && <h2 className='loding'>is Loding...</h2> }
        {!loding && posts.length ? 
            posts.map((post) =>
                <div className='post' key={post.id}>
                    <div className='postheader'>
                        <h2>{post.title}</h2>
                        <BsThreeDotsVertical 
                            role='button'
                            onClick={()=>handleEditMenu(post.id)}
                        />
                        {editMenu[post.id]  && <EditMenuLayout id={post.id} />}
                    </div>
                    <img src={post.img} alt="No Image" />
                    <div className='like-comment' >
                    <div className={`heart ${post.heart === true ? 'red':'black'}`}  onClick={()=>handleLike(post.id, post.heart)} >
                        {post.heart === true ? <FaHeart /> : <FaRegHeart />} <p className='black'>{post.heartcount}</p>
                    </div>
                    <div className='comment'>
                        <FaRegCommentDots />
                    </div>                   
                </div>
                 <p>
                    {showFullContentId[post.id]  
                        ? post.body 
                        : post.body.length <= 50 
                        ? post.body 
                        : `${post.body.slice(0, 50)}...`
                    }
                    <span onClick={() => handleShowFullContent(post.id)}>
                        {showFullContentId[post.id] ? " Less" : " More"}
                    </span>
                </p>


            </div>
        ) 
        : <p>No Post Avaliable</p>    
    }
    </div>
  )
}

export default Home