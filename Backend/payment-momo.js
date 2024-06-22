const axios = require('axios');
const crypto = require('crypto');
const config = require('./config/moomo'); // Đường dẫn đến file cấu hình

// Function to generate signature
function generateSignature(params) {
  const rawSignature = `accessKey=${config.accessKey}&amount=${params.amount}&extraData=${config.extraData}&ipnUrl=${config.ipnUrl}&orderId=${params.orderId}&orderInfo=${config.orderInfo}&partnerCode=${config.partnerCode}&redirectUrl=${config.redirectUrl}&requestId=${params.requestId}&requestType=${config.requestType}`;
  
  const signature = crypto.createHmac('sha256', config.secretKey)
                          .update(rawSignature)
                          .digest('hex');
  
  return signature;
}

// Function to initiate MoMo payment
async function initiatePayment(amount) {
  try {
    const orderId = config.partnerCode + Date.now();
    const requestId = orderId;

    const signature = generateSignature({ amount, orderId, requestId });

    const requestBody = {
      partnerCode: config.partnerCode,
      partnerName: 'MoMo Payment',
      storeId: '',
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

    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200 && response.data && response.data.payUrl) {
      return response.data.payUrl;
    } else {
      console.error('Error from MoMo:', response.data);
      throw new Error('Payment initiation failed');
    }
  } catch (error) {
    console.error('Error during payment initiation:', error.message);
    throw error;
  }
}

module.exports = {
  initiatePayment
};
