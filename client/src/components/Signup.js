import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../App';

export default function Signup(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) =>{
    e.preventDefault();
    const res = await api.post('/auth/signup', { name, email, password });
    if (res && res.data){
      localStorage.setItem('token', res.data.token);
      login(res.data.user);
      navigate('/');
    } else alert('Signup failed');
  }

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <div className="form-row">
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <button className="btn" type="submit">Signup</button>
    </form>
  )
}
