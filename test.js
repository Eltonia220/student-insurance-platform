import express from 'express';
const app = express();
app.get('/api/test', (req, res) => res.json({ working: true }));
app.listen(3001, () => console.log('Test server running'));