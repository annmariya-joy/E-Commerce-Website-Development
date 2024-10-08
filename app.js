require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { sequelize } = require('./models');

const cors = require('cors');

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Enable CORS for all routes
// app.use(cors());
app.use('/api/users', require('./routes/signupRoutes'))
app.use('/api/users', require('./routes/loginRoutes'))

app.use('/api/products', require('./routes/productRoutes'))

app.use('/api/carts', require('./routes/cartRoutes'))

 app.use('/api/orders', require('./routes/orderRoutes'))



app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const port = 8080;
const localIpAddress = getLocalIpAddress();


sequelize.sync()
  .then(() => {
    app.listen(port, localIpAddress, () => {
      console.log(`Server running at http://${localIpAddress}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });



function getLocalIpAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    for (const address of networkInterface) {
      if (address.family === 'IPv4' && !address.internal) {
        return address.address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no IP address is found
}
