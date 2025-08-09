import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import MySessions from './components/MySessions';
import SessionEditor from './components/SessionEditor';
import ProtectedRoute from './components/ProtectedRoute';

function App(){
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app">
      <header>
        <h1>Arvyax Wellness</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          {token && <Link to="/my-sessions">My Sessions</Link>}
          {!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/login" element={<AuthForm/>} />
          <Route path="/my-sessions" element={
            <ProtectedRoute><MySessions/></ProtectedRoute>
          } />
          <Route path="/my-sessions/new" element={
            <ProtectedRoute><SessionEditor/></ProtectedRoute>
          } />
          <Route path="/my-sessions/edit/:id" element={
            <ProtectedRoute><SessionEditor/></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
