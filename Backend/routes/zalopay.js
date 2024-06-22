const express = require('express');
const router = express.Router();
const hmac = require('crypto').createHmac;
const axios = require('axios');
const config = require('../config/zalopay');
const random = require('crypto').randomInt;

router.post('/payment', async (req, res) => {
    const { amount } = req.body;
    const transID = random(100000, 999999);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${new Date().toISOString().slice(2, 10).replace(/-/g, '')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: '[]',
        embed_data: JSON.stringify({ redirecturl: config.callback_url }),
        amount: amount,
        callback_url: config.callback_url,
        description: `Payment for the order #${transID}`,
        bank_code: ''
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = hmac('sha256', config.key1).update(data).digest('hex');

    try {
        const response = await axios.post(config.endpoint, order);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/callback', (req, res) => {
    const { data, mac } = req.body;
    const macCheck = hmac('sha256', config.key2).update(data).digest('hex');

    if (mac !== macCheck) {
        return res.json({ return_code: -1, return_message: 'mac not equal' });
    }

    const dataJson = JSON.parse(data);
    console.log(`Update order status to success for order ${dataJson.app_trans_id}`);
    res.json({ return_code: 1, return_message: 'success' });
});

module.exports = router;
