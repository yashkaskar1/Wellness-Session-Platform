import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function MySessions(){
  const [list, setList] = useState([]);

  const fetch = async () => {
    try {
      const r = await api.get('/my-sessions');
      setList(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(()=>{ fetch(); },[]);

  return (
    <div>
      <h2>My Sessions</h2>
      <Link to="/my-sessions/new"><button>New Session</button></Link>
      <ul>
        {list.map(s => (
          <li key={s._id}>
            <Link to={`/my-sessions/edit/${s._id}`}>{s.title || 'Untitled'}</Link>
            <span> — {s.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
