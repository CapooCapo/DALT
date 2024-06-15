from flask import Flask, render_template, request, session, jsonify
import pyodbc
import hmac
import requests
import hashlib
import json
import time
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.secret_key = 'IKA@MCt14$243*&r2da#'
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=LAPTOP-IA1SF1L6\HUANPC;DATABASE=Bakery')

@app.route('/')
def home():
    if 'username' in session:
        return render_template('loggedin_home.html')
    else:
        return render_template('index.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.content_type != 'application/json':
        return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 415

    data = request.json
    username = data.get('username')
    password = data.get('password')
    phoneNumber = data.get('phoneNumber')
    email = data.get('email')
    
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM Account WHERE username=?", (username,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({'status': 'error', 'message': 'Username already exists'}), 409

    cursor.execute("INSERT INTO Account (phoneNumber, email, username, password) VALUES (?, ?, ?, ?)", (phoneNumber, email, username, password))
    conn.commit()
    return jsonify({'status': 'success', 'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    if request.content_type != 'application/json':
        return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 415

    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Account WHERE username=? AND password=?", (username, password))
    user = cursor.fetchone()
    
    if user:
        session['username'] = username
        return jsonify({'status': 'success', 'message': 'Login successful'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'status': 'success', 'message': 'Logout successful'}), 200

@app.route('/payment', methods=['POST'])
def payment():
    if request.content_type != 'application/json':
        return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 415

    amount = request.json['amount']
    app_id = '2553'
    key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL'
    key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz'
    endpoint = 'https://sb-openapi.zalopay.vn/v2/create'
    
    embed_data = {
        'redirecturl': 'https://4jjl5xvc-5000.asse.devtunnels.ms/'
    }
    
    items = []
    transID = random.randint(100000, 999999)

    order = {
        'app_id': app_id,
        'app_trans_id': f"{time.strftime('%y%m%d')}_{transID}",
        'app_user': 'user123',
        'app_time': int(time.time() * 1000),  # milliseconds
        'item': json.dumps(items),
        'embed_data': json.dumps(embed_data),
        'amount': amount,
        'callback_url': 'https://4jjl5xvc-5000.asse.devtunnels.ms/callback',
        'description': f'Payment for the order #{transID}',
        'bank_code': ''
    }

    data = f"{app_id}|{order['app_trans_id']}|{order['app_user']}|{order['amount']}|{order['app_time']}|{order['embed_data']}|{order['item']}"
    order['mac'] = hmac.new(key1.encode(), data.encode(), hashlib.sha256).hexdigest()

    try:
        response = requests.post(endpoint, data=order)
        response_data = response.json()
        return jsonify(response_data)
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/callback', methods=['POST'])
def callback():
    key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz'
    result = {}
    try:
        dataStr = request.form['data']
        reqMac = request.form['mac']
        mac = hmac.new(key2.encode(), dataStr.encode(), hashlib.sha256).hexdigest()

        if reqMac != mac:
            result['return_code'] = -1
            result['return_message'] = 'mac not equal'
        else:
            dataJson = json.loads(dataStr)
            print(f"update order's status = success where app_trans_id = {dataJson['app_trans_id']}")
            result['return_code'] = 1
            result['return_message'] = 'success'
    except Exception as ex:
        print(f'lỗi:::{ex}')
        result['return_code'] = 0
        result['return_message'] = str(ex)

    return jsonify(result)

momo_access_key = 'F8BBA842ECF85'
momo_secret_key = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
momo_partner_code = 'MOMO'
momo_redirect_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/'
momo_ipn_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/callback'
momo_request_type = 'payWithMethod'

@app.route('/payment_momo', methods=['POST'])
def payment_momo():
    if request.content_type != 'application/json':
        return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 415

    try:
        amount = request.json['amount']
        print(f"Amount received: {amount}")

        orderId = momo_partner_code + str(int(time.time()))
        requestId = orderId
        orderInfo = 'Payment for the order'
        extraData = ''

        rawSignature = (
            f'accessKey={momo_access_key}&amount={amount}&extraData={extraData}'
            f'&ipnUrl={momo_ipn_url}&orderId={orderId}&orderInfo={orderInfo}'
            f'&partnerCode={momo_partner_code}&redirectUrl={momo_redirect_url}'
            f'&requestId={requestId}&requestType={momo_request_type}'
        )
        print(f"Raw signature string: {rawSignature}")

        signature = hmac.new(
            bytes(momo_secret_key, 'utf-8'), 
            bytes(rawSignature, 'utf-8'), 
            hashlib.sha256
        ).hexdigest()
        print(f"Generated signature: {signature}")

        requestBody = {
            'partnerCode': momo_partner_code,
            'partnerName': 'Test',
            'storeId': 'MomoTestStore',
            'requestId': requestId,
            'amount': amount,
            'orderId': orderId,
            'orderInfo': orderInfo,
            'redirectUrl': momo_redirect_url,
            'ipnUrl': momo_ipn_url,
            'lang': 'en',
            'requestType': momo_request_type,
            'autoCapture': True,
            'extraData': extraData,
            'orderGroupId': '',
            'signature': signature,
        }
        print(f"Request body: {json.dumps(requestBody, indent=2)}")

        response = requests.post(
            'https://test-payment.momo.vn/v2/gateway/api/create',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(requestBody)
        )
        print(f"Response status code: {response.status_code}")
        result = response.json()
        print(f"Response from MoMo: {json.dumps(result, indent=2)}")

        if response.status_code == 200 and 'payUrl' in result:
            return jsonify({'payUrl': result['payUrl']})
        else:
            print(f"Error response from MoMo: {result}")
            return jsonify({'message': 'Payment failed'}), 500
    except Exception as e:
        print(f"Exception during payment: {e}")
        return jsonify({'message': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
