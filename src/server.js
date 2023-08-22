require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const initModel = require('./models/initModels');

//La autenticacion de la base de datos
db.authenticate()
  .then(() => console.log('Database authenticated 🐢'))
  .catch((err) => console.log('Error: ' + err));

initModel();

//La sincronizacion de la base de datos
db.sync()
  .then(() => console.log('Database synced! 🦜'))
  .catch((err) => console.log('Error: ' + err));

const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🐣`);
});
