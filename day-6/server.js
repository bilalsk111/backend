const ConnectToDatabase = require('./config/connect');
const app = require('./src/app');

const PORT = 3000;

ConnectToDatabase();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});