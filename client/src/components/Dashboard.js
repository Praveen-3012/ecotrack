import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import Footer from './Footer';

// Custom color palette for charts - chose these to match eco theme
const COLORS = ['#3ba55d', '#5ec778', '#7dd897', '#a8e6b8', '#d1f5da', '#2d8a4c', '#246b3a', '#1a5229'];

// Badge system - I designed this to motivate users with progressive levels
function badgeFor(score){
  if (score === 0) return { name: 'Getting Started', icon: '🌱', color: '#8b9da8', level: 0 };
  if (score <= 50) return { name: 'Eco Beginner', icon: '🌱', color: '#3ba55d', level: 1 };
  if (score <= 100) return { name: 'Green Warrior', icon: '🌿', color: '#2d8a4c', level: 2 };
  if (score <= 200) return { name: 'Eco Champion', icon: '🌳', color: '#246b3a', level: 3 };
  if (score <= 350) return { name: 'Climate Hero', icon: '🌍', color: '#1a5229', level: 4 };
  return { name: 'Planet Protector', icon: '🌎', color: '#3ba55d', level: 5 };
}

// Helper function to calculate next badge target
function getNextBadge(score) {
  if (score < 50) return { target: 50, name: 'Green Warrior' };
  if (score < 100) return { target: 100, name: 'Eco Champion' };
  if (score < 200) return { target: 200, name: 'Climate Hero' };
  if (score < 350) return { target: 350, name: 'Planet Protector' };
  return { target: score, name: 'Max Level!' };
}

export default function Dashboard(){
  const { user } = useContext(AuthContext);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState({ counts: {}, weekly: [] });
  const [total, setTotal] = useState(user?.totalScore || 0);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchData() }, []);

  // Fetch user's actions and statistics from backend
  const fetchData = async ()=>{
    try{
      setLoading(true);
      const res = await api.get('/actions');
      if (res.data){
        setActions(res.data.actions || []);
        setTotal(res.data.totalScore || 0);
      }
      // Get aggregated statistics for charts
      const s = await api.get('/actions/stats');
      setStats(s.data || {});
    }catch(e){ 
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const badge = badgeFor(total);
  const nextBadge = getNextBadge(total);
  const progress = nextBadge.target > 0 ? (total / nextBadge.target) * 100 : 0;

  // Transform data for charts
  const barData = Object.keys(stats.counts||{}).map(k=>({ name:k, count: stats.counts[k] }));
  const lineData = (stats.weekly||[]).map(w=>({ name: w.week, points: w.points }));
  const pieData = Object.keys(stats.counts||{}).map((k,i)=>({ name:k, value: stats.counts[k] }));

  // Calculate some interesting statistics to display
  const totalActions = actions.length;
  const thisWeekActions = actions.filter(a => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(a.date) > weekAgo;
  }).length;
  const avgPointsPerAction = totalActions > 0 ? Math.round(total / totalActions) : 0;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your eco journey...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Hero Section - Score & Badge */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="badge-display">
            <span className="badge-icon">{badge.icon}</span>
            <div className="badge-info">
              <span className="badge-name">{badge.name}</span>
              <span className="badge-level">Level {badge.level}</span>
            </div>
          </div>
          
          <div className="score-display">
            <span className="score-label">Total Impact Points</span>
            <span className="score-value">{total}</span>
          </div>
        </div>

        {/* Progress Bar to Next Badge */}
        {nextBadge.target > total && (
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Next: {nextBadge.name}</span>
              <span className="progress-value">{total} / {nextBadge.target}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}>
                <div className="progress-glow"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{totalActions}</span>
            <span className="stat-label">Total Actions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-value">{thisWeekActions}</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <span className="stat-value">{avgPointsPerAction}</span>
            <span className="stat-label">Avg Points/Action</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <span className="stat-value">{Object.keys(stats.counts || {}).length}</span>
            <span className="stat-label">Action Types</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h4>📊 Actions by Category</h4>
            <span className="chart-subtitle">Your eco-activities breakdown</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  color: '#f8fafc'
                }} 
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>📈 Weekly Progress</h4>
            <span className="chart-subtitle">Points earned over time</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  color: '#f8fafc'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {pieData.length > 0 && (
          <div className="chart-card chart-card-full">
            <div className="chart-header">
              <h4>🥧 Action Distribution</h4>
              <span className="chart-subtitle">Proportion of different eco-actions</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Actions */}
      <div className="recent-actions-section">
        <div className="section-header">
          <h4>🕒 Recent Actions</h4>
          <span className="actions-count">{actions.length} total</span>
        </div>
        
        {actions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌱</span>
            <h3>No actions yet!</h3>
            <p>Start your eco-journey by adding your first action.</p>
          </div>
        ) : (
          <div className="actions-timeline">
            {actions.slice(0, 10).map(a => {
              const actionDate = new Date(a.date);
              const isToday = actionDate.toDateString() === new Date().toDateString();
              
              return (
                <div key={a._id} className="action-item">
                  <div className="action-icon">✓</div>
                  <div className="action-content">
                    <div className="action-header">
                      <span className="action-category">{a.category}</span>
                      <span className="action-points">+{a.points} pts</span>
                    </div>
                    {a.note && <p className="action-note">{a.note}</p>}
                    <span className="action-date">
                      {isToday ? '🕐 Today' : actionDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
