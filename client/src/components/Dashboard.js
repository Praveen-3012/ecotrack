import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function badgeFor(score){
  if (score <= 50) return 'Eco Beginner 🌱';
  if (score <= 100) return 'Eco Hero 🌿';
  return 'Planet Protector 🌎';
}

export default function Dashboard(){
  const { user } = useContext(AuthContext);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState({ counts: {}, weekly: [] });
  const [total, setTotal] = useState(user?.totalScore || 0);

  useEffect(()=>{ fetchData() }, []);

  const fetchData = async ()=>{
    try{
      const res = await api.get('/actions');
      if (res.data){
        setActions(res.data.actions || []);
        setTotal(res.data.totalScore || 0);
      }
      const s = await api.get('/actions/stats');
      setStats(s.data || {});
    }catch(e){ console.error(e) }
  }

  const barData = Object.keys(stats.counts||{}).map(k=>({ name:k, count: stats.counts[k] }));
  const lineData = (stats.weekly||[]).map(w=>({ name: w.week, points: w.points }));
  const pieData = Object.keys(stats.counts||{}).map((k,i)=>({ name:k, value: stats.counts[k], color: COLORS[i%COLORS.length] }));

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Points: <strong>{total}</strong> — {badgeFor(total)}</p>

      <div className="chart-row">
        <div className="chart-card">
          <h4>Actions per category</h4>
          <BarChart width={350} height={250} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h4>Weekly score growth</h4>
          <LineChart width={350} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="points" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>

      <div style={{marginTop:16}}>
        <h4>Recent Actions</h4>
        <ul className="actions-list">
          {actions.map(a=> (
            <li key={a._id}>{new Date(a.date).toLocaleString()} — {a.category} (+{a.points}) {a.note ? ` — ${a.note}` : ''}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
