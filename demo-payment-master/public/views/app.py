from flask import Flask, render_template, request, redirect, session, jsonify
import pyodbc
import hmac
import requests
import hashlib
import json
import time
import random

app = Flask(__name__)
app.secret_key = 'IKA@MCt14$243*&r2da#'  # (Change this to suitable)
conn = pyodbc.connect('DRIVER={SQL Server};SERVER=LAPTOP-IA1SF1L6\HUANPC;DATABASE=Bakery')

@app.route('/')
def home():
    if 'username' in session:
        return render_template('loggedin_home.html')
    else:
        return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        phoneNumber = request.form['phoneNumber']
        email = request.form['email']
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Account (phoneNumber, email, username, password) VALUES (?, ?, ?, ?)", (phoneNumber, email, username, password))
        conn.commit()
        return redirect('/login')
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Account WHERE username=? AND password=?", (username, password))
        user = cursor.fetchone()
        if user:
            session['username'] = username
            return redirect('/')
        else:
            return 'Login failed. Invalid username or password.'
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')

@app.route('/payment', methods=['POST'])
def payment():
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



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
