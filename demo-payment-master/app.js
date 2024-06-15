const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const zaloPayRoutes = require('./routes/zalopay');
const momoRoutes = require('./routes/momo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/zalopay', zaloPayRoutes);
app.use('/momo', momoRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Payment Integration');
});

app.listen(5000, () => {
    console.log('Server is running at port 5000');
});
