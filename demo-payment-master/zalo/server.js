const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const qs = require('qs');

const app = express();

// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/payment', async (req, res) => {
    const amount = req.body.amount; // Lấy số tiền từ request body
    console.log('Received amount:', amount); 

    const embed_data = {
        redirecturl: 'http://192.168.1.51:5000/', // Đổi URL này thành URL thật của bạn
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(), // milliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        callback_url: 'http://192.168.1.51:5000/callback', // Đổi URL này thành URL thật của bạn
        description: `Payment for the order #${transID}`,
        bank_code: '',
    };

    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/callback', (req, res) => {
    let result = {};
    console.log(req.body);
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id'],
            );

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
});

app.post('/check-status-order', async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id,
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
    } catch (error) {
        console.log('lỗi');
        console.log(error);
    }
});

app.listen(5000, function () {
    console.log('Server is listening at port 5000');
});
