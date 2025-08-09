import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [list, setList] = useState([]);

  useEffect(()=>{
    api.get('/sessions').then(r => setList(r.data)).catch(()=>{});
  },[]);

  return (
    <div>
      <h2>Published Sessions</h2>
      {list.length === 0 && <p>No sessions yet.</p>}
      <ul>
        {list.map(s => (
          <li key={s._id}>
            <strong>{s.title}</strong> — {s.tags?.join(', ')}
            {s.json_file_url && <a href={s.json_file_url} target="_blank" rel="noreferrer"> JSON</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
