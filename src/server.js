const app = require('./app');
const { MODE, PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`SecPro Workshop [${MODE.toUpperCase()}] http://localhost:${PORT}`);
});
