    const express = require('express');
    const router = express.Router();
    const crypto = require('crypto');
    const axios = require('axios');
    const config = require('../config/moomo');

    router.post('/payment', async (req, res) => {
        const { amount } = req.body;
        const orderId = config.partnerCode + new Date().getTime();
        const requestId = orderId;

        const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${config.extraData}&ipnUrl=${config.ipnUrl}&orderId=${orderId}&orderInfo=${config.orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${requestId}&requestType=${config.requestType}`;
        const signature = crypto.createHmac('sha256', config.secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode: config.partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: config.orderInfo,
            redirectUrl: config.redirectUrl,
            ipnUrl: config.ipnUrl,
            lang: config.lang,
            requestType: config.requestType,
            autoCapture: config.autoCapture,
            extraData: config.extraData,
            orderGroupId: config.orderGroupId,
            signature: signature
        };

        try {
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    router.post('/callback', (req, res) => {
        console.log('callback:', req.body);
        res.status(204).json(req.body);
    });

    router.post('/check-status-transaction', async (req, res) => {
        const { orderId } = req.body;
        const rawSignature = `accessKey=${config.accessKey}&orderId=${orderId}&partnerCode=${config.partnerCode}&requestId=${orderId}`;
        const signature = crypto.createHmac('sha256', config.secretKey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode: config.partnerCode,
            requestId: orderId,
            orderId: orderId,
            signature: signature,
            lang: 'vi'
        };

        try {
            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    module.exports = router;
