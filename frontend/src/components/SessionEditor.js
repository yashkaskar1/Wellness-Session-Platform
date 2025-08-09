import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function SessionEditor(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const timerRef = useRef(null);
  const lastSavedRef = useRef(null);
  const sessionIdRef = useRef(id || null);

  useEffect(() => {
    if (id) {
      api.get(`/my-sessions/${id}`).then(r=>{
        const s = r.data;
        setTitle(s.title);
        setTags((s.tags || []).join(', '));
        setJsonFileUrl(s.json_file_url || '');
      }).catch(err => {
        setMsg('Unable to load');
      });
    }
  }, [id]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleAutoSave();
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, tags, jsonFileUrl]);

  const handleAutoSave = async () => {
    setSaving(true);
    try {
      const payload = { id: sessionIdRef.current, title, tags, json_file_url: jsonFileUrl };
      const res = await api.post('/my-sessions/save-draft', payload);
      sessionIdRef.current = res.data._id;
      lastSavedRef.current = new Date();
      setMsg('Auto-saved at ' + lastSavedRef.current.toLocaleTimeString());
    } catch (err) {
      setMsg('Auto-save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNow = async () => {
    setSaving(true);
    try {
      const payload = { id: sessionIdRef.current, title, tags, json_file_url: jsonFileUrl };
      const res = await api.post('/my-sessions/save-draft', payload);
      sessionIdRef.current = res.data._id;
      setMsg('Saved');
    } catch (err) {
      setMsg('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const payload = { id: sessionIdRef.current, title, tags, json_file_url: jsonFileUrl };
      const res = await api.post('/my-sessions/publish', payload);
      sessionIdRef.current = res.data._id;
      setMsg('Published');
      navigate('/my-sessions');
    } catch (err) {
      setMsg('Publish failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Session' : 'New Session'}</h2>
      <div className="editor">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <input value={jsonFileUrl} onChange={e=>setJsonFileUrl(e.target.value)} placeholder="JSON file URL" />
        <div className="buttons">
          <button onClick={handleSaveNow} disabled={saving}>Save Draft</button>
          <button onClick={handlePublish} disabled={saving}>Publish</button>
        </div>
        <div className="status">
          {saving ? <em>Saving...</em> : <span>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
