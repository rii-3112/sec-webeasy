const express = require('express');
const path = require('path');
const { MODE, PORT } = require('./config');
const { sessionMiddleware } = require('./middleware/session');
const formsRouter = require('./routes/forms');
const responsesRouter = require('./routes/responses');
const challengesRouter = require('./routes/challenges');
const stampsRouter = require('./routes/stamps');

const app = express();

app.use(express.json());
app.use(sessionMiddleware);

app.get('/admin.html', (req, res) => {
  res.append(
    'Set-Cookie',
    'admin_session=workshop_admin_secret; Path=/; SameSite=Lax'
  );
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  res.json({ mode: MODE, port: PORT });
});

app.use('/api/forms', formsRouter);
app.use('/api/responses', responsesRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/stamps', stampsRouter);

module.exports = app;
