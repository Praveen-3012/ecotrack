import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const OPTIONS = [
  { value: 'Recycled', label: 'Recycled' },
  { value: 'PublicTransport', label: 'Used Public Transport' },
  { value: 'AvoidedPlastic', label: 'Avoided Plastic' },
  { value: 'PlantedTree', label: 'Planted a Tree' }
];

export default function AddAction(){
  const [category, setCategory] = useState('Recycled');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      await api.post('/actions', { category, note });
      navigate('/');
    }catch(e){ console.error(e); alert('Failed to add') }
  }

  return (
    <form onSubmit={submit}>
      <h2>Add Action</h2>
      <div className="form-row">
        <label>Action</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {OPTIONS.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="form-row">
        <label>Note (optional)</label>
        <input value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <button className="btn" type="submit">Add</button>
    </form>
  )
}
