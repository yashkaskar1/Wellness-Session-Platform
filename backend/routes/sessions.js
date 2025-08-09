const express = require('express');
const auth = require('../middleware/auth');
const Session = require('../models/Session');

const router = express.Router();

// GET /api/sessions  -> public published sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' }).sort({ updated_at: -1 }).limit(50);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected routes
router.get('/my-sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user.id }).sort({ updated_at: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-sessions/:id', auth, async (req, res) => {
  try {
    const s = await Session.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    if (s.user_id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/my-sessions/save-draft', auth, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;
    const tagArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []);
    if (id) {
      const s = await Session.findById(id);
      if (!s) return res.status(404).json({ error: 'Not found' });
      if (s.user_id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      s.title = title || s.title;
      s.tags = tagArray;
      s.json_file_url = json_file_url || s.json_file_url;
      s.status = 'draft';
      await s.save();
      return res.json(s);
    } else {
      const s = new Session({
        user_id: req.user.id,
        title: title || 'Untitled',
        tags: tagArray,
        json_file_url: json_file_url || '',
        status: 'draft'
      });
      await s.save();
      return res.json(s);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/my-sessions/publish', auth, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;
    const tagArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : []);
    if (id) {
      const s = await Session.findById(id);
      if (!s) return res.status(404).json({ error: 'Not found' });
      if (s.user_id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
      s.title = title || s.title;
      s.tags = tagArray;
      s.json_file_url = json_file_url || s.json_file_url;
      s.status = 'published';
      await s.save();
      return res.json(s);
    } else {
      const s = new Session({
        user_id: req.user.id,
        title: title || 'Untitled',
        tags: tagArray,
        json_file_url: json_file_url || '',
        status: 'published'
      });
      await s.save();
      return res.json(s);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
