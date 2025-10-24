import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="container">
        <strong>EcoTrack</strong>
        <span style={{float:'right'}} className="nav-links">
          {user ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/add">Add Action</Link>
              <a href="#" onClick={(e)=>{e.preventDefault(); logout()}}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
