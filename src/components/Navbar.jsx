import React, { useState } from 'react'
import { IoMenu } from 'react-icons/io5'
import { CgProfile } from "react-icons/cg";
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'


const Navbar = ({search, setSearch}) => {
    const [menu, setMenu] = useState(false)
  return (
    <nav className='Navbar'>
        <div className='profile'>
          <NavLink to='/Profile' >
            <CgProfile />
        </NavLink>
        <p>Profile</p>
        <input 
          type="text" 
          placeholder='Search'
          autoFocus
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        </div>
        <div className='menuicon' onClick={()=>{setMenu(!menu)}}>
            <IoMenu />
        </div>
        <ul className={`Navbar-ul ${menu ? 'open':''}`}>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/post'>Post</NavLink></li>
            <li><NavLink to='/about'>About</NavLink></li>
        </ul>
    </nav>
  )
}

export default Navbar