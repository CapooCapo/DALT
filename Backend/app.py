from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS , cross_origin
import logging
import base64
import random
import smtplib
from email.mime.text import MIMEText
import os
import time
import hmac
import hashlib
import json
import requests
import jwt
import datetime


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Cho phép tất cả các nguồn gốc

app.secret_key = 'IKA@MCt14$243*&r2da#'

logging.basicConfig(level=logging.DEBUG)
# Thiết lập kết nối SQL Server

momo_partner_code = 'MOMO'
momo_access_key = 'F8BBA842ECF85'
momo_secret_key = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
momo_ipn_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/callback'
momo_redirect_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/payment'
momo_request_type = 'payWithMethod'

connection_string = 'DRIVER={SQL Server};SERVER=LAPTOP-IA1SF1L6\\HUANPC;DATABASE=Bakery'
connection = pyodbc.connect(connection_string)

@app.route('/data', methods=['GET'])
@cross_origin()  # CORS cho phép tất cả các nguồn gốc
def get_data():
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Account') 
        rows = cursor.fetchall()
        data = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
        return jsonify(data)
    except Exception as e:
        return str(e)

import requests

def generate_token(username):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({'username': username, 'exp': expiration}, app.config['SECRET_KEY'], algorithm='HS256')
    return token

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    try:
        data = request.json
        username = data['username']
        password = data['password']

        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Account WHERE username = ? AND password = ?', (username, password))
        row = cursor.fetchone()

        if row:
            account = dict(zip([column[0] for column in cursor.description], row))
            if account['is_active']:
                token = generate_token(account['username'])
                return jsonify({'status': 'success' ,'user': account['username'], 'email': account['email'], 'is_Admin': account['is_Admin'], 'message': 'Login successful', 'accessToken': token, 'user': account['username']})
            else:
                verification_request = {'username': account['username']}
                verification_response = requests.post('https://4jjl5xvc-5000.asse.devtunnels.ms/request_verification', json=verification_request)

                if verification_response.status_code == 200:
                    return jsonify({'status': 'failure', 'message': 'Account not activated. Verification email sent.', 'user': account['username'], 'email': account['email']})
                else:
                    return jsonify({'status': 'failure', 'message': 'Failed to send verification email.'}), 500
        else:
            return jsonify({'status': 'failure', 'message': 'Invalid credentials'})
    except Exception as e:
        return jsonify({'status': 'failure', 'message': str(e)}), 500




def generate_product_id(product_type):
    prefix_map = {
        'Bánh kem': 'BK',
        'Bánh ngọt': 'BN',
        'Bánh mặn': 'BM'
    }
    prefix = prefix_map.get(product_type, 'PR')
    
    cursor = connection.cursor()
    cursor.execute(f"SELECT COUNT(*) FROM Product WHERE Product_code LIKE '{prefix}%'")
    count = cursor.fetchone()[0]
    return f"{prefix}{count + 1:04d}"

@app.route('/upload_product', methods=['POST'])
def upload_product():
    try:
        logging.debug("Received request to upload product")

        # Check if the request contains 'multipart/form-data'
        if not request.content_type.startswith('multipart/form-data'):
            return jsonify({'status': 'failure', 'message': 'Invalid Content-Type'}), 400

        # Check if the image part is in the request
        if 'image' not in request.files:
            return jsonify({'status': 'failure', 'message': 'No image part in the request'}), 400

        product_type = request.form.get('product_type').strip()
        logging.debug(f"Received product_type: '{product_type}'")
        
        product_name = request.form.get('product_name')
        price = request.form.get('price')
        description = request.form.get('description')
        image_file = request.files.get('image')

        logging.debug(f"Product Type: {product_type}, Product Name: {product_name}, Price: {price}, Description: {description}")

        if not image_file or image_file.filename == '':
            return jsonify({'status': 'failure', 'message': 'No selected file'}), 400

        product_code = generate_product_id(product_type)
        image_data = image_file.read()
        logging.debug(f"Image data length: {len(image_data)} bytes")

        cursor = connection.cursor()
        # Use parameterized query to insert binary data
        cursor.execute('''
            INSERT INTO Product (Product_code, Product_Type, Product_Name, Price, Description, Image)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (product_code, product_type, product_name, price, description, pyodbc.Binary(image_data)))
        connection.commit()

        logging.debug("Product uploaded successfully")
        return jsonify({'status': 'success', 'message': 'Product uploaded successfully', 'product_code': product_code})
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({'status': 'failure', 'message': str(e)}), 500

@app.route('/products', methods=['GET'])
def get_products():
    try:
        page = int(request.args.get('page', 1))  # Current page
        per_page = int(request.args.get('per_page', 8))  # Products per page

        cursor = connection.cursor()

        # Get total count of products
        cursor.execute('SELECT COUNT(*) FROM Product')
        total_count = cursor.fetchone()[0]

        # Calculate OFFSET and FETCH for pagination
        offset = (page - 1) * per_page

        # Fetch products for the current page
        cursor.execute('''
            SELECT Product_code, Product_Type, Product_Name, Price, Description, Image
            FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY Product_code) AS RowNum, *
                FROM Product
            ) AS RowConstrainedResult
            WHERE RowNum BETWEEN ? AND ?
        ''', (offset + 1, offset + per_page))

        rows = cursor.fetchall()

        data = []
        for row in rows:
            product = dict(zip([column[0] for column in cursor.description], row))
            if product['Image']:
                product['Image'] = base64.b64encode(product['Image']).decode('utf-8')
            data.append(product)

        return jsonify({'total_count': total_count, 'products': data, 'page': page, 'per_page': per_page})
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({'status': 'failure', 'message': str(e)}), 500


    
@app.route('/register', methods=['POST'])
def register():
    try:
        if request.is_json:
            data = request.get_json()
            username = data['username']
            password = data['password']
            phoneNumber = data['phoneNumber']
            email = data['email']
            cursor = connection.cursor()
            # Kiểm tra xem người dùng đã tồn tại chưa
            cursor.execute('SELECT * FROM Account WHERE username = ?', (username,))
            account = cursor.fetchone()
            
            if account:
                return jsonify({'status': 'failure', 'message': 'Username already exists'})
            else:
                # Thêm người dùng mới với is_active = 0 và is_Admin = 0
                cursor.execute('INSERT INTO Account (username, password, phoneNumber, email, is_active, is_Admin) VALUES (?, ?, ?, ?, 0, 0)', (username, password, phoneNumber, email))
                connection.commit()

                # Gửi mã xác thực
                verification_code = generate_verification_code()
                cursor.execute('UPDATE Account SET verification_code = ? WHERE username = ?', (verification_code, username))
                connection.commit()
                cursor.execute('select email, username from account where username = ?', (username))
                send_email(email, 'Your verification code', f'Your verification code is {verification_code}')
                connection.commit()
                return jsonify({'status': 'success', 'message': 'User registered successfully. Verification code sent to email'})
        else:
            return jsonify({'status': 'failure', 'message': 'Request must be JSON type'})
    except Exception as e:
        return str(e)

SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SMTP_USERNAME = 'hhbakery5@gmail.com'
SMTP_PASSWORD = 'eesu rbtt gddz sznq'

try:
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        print("Successfully connected to SMTP server")
except Exception as e:
    print(f"Failed to connect to SMTP server: {str(e)}")


def send_email(to_email, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_USERNAME
    msg['To'] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, to_email, msg.as_string())
        logging.debug(f"Email sent to {to_email}")
    except Exception as e:
        logging.error(f"Failed to send email: {str(e)}")

def generate_verification_code():
    return ''.join(random.choices('0123456789', k=6))

@app.route('/request_verification', methods=['POST'])
def request_verification():
    try:
        data = request.json
        username = data['username']
        
        cursor = connection.cursor()
        cursor.execute('SELECT email FROM Account WHERE username = ?', (username,))
        account = cursor.fetchone()
        
        if account:
            email = account.email
            verification_code = generate_verification_code()
            
            # Store the verification code in the database or cache (e.g., Redis)
            cursor.execute('UPDATE Account SET verification_code = ? WHERE username = ?', (verification_code, username))
            connection.commit()
            
            send_email(email, 'Your verification code', f'Your verification code is {verification_code}')
            
            return jsonify({'status': 'success', 'message': 'Verification code sent to email'})
        else:
            return jsonify({'status': 'failure', 'message': 'Invalid username'})
    except Exception as e:
        return str(e)

@app.route('/verify_code', methods=['POST'])
def verify_code():
    try:
        data = request.json
        username = data['username']
        verification_code = data['verification_code']
        
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Account WHERE username = ? AND verification_code = ?', (username, verification_code))
        account = cursor.fetchone()
        
        if account:
            cursor = connection.cursor()
            cursor.execute('UPDATE Account SET is_active = ?, verification_code = NULL WHERE username = ?', (1, username))    
            connection.commit()
            return jsonify({'status': 'success', 'message': 'Verification successful'})
        else:
            return jsonify({'status': 'failure', 'message': 'Invalid verification code'})
    except Exception as e:
        return str(e)

@app.route('/reset_password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        username = data['username']
        new_password = data['new_password']
        
        cursor = connection.cursor()
        cursor.execute('UPDATE Account SET password = ?, verification_code = NULL WHERE username = ?', (new_password, username))
        connection.commit()
        
        return jsonify({'status': 'success', 'message': 'Password updated successfully'})
    except Exception as e:
        return str(e)

@app.route('/resend_verification', methods=['POST'])
def resend_verification():
    try:
        data = request.json
        username = data['username']
        
        cursor = connection.cursor()
        cursor.execute('SELECT email FROM Account WHERE username = ?', (username,))
        account = cursor.fetchone()
        
        if account:
            email = account[0]
            verification_code = generate_verification_code()
            
            # Cập nhật mã xác minh trong cơ sở dữ liệu
            cursor.execute('UPDATE Account SET verification_code = ? WHERE username = ?', (verification_code, username))
            connection.commit()
            
            send_email(email, 'Your verification code', f'Your verification code is {verification_code}')
            
            return jsonify({'status': 'success', 'message': 'Verification code resent to email'})
        else:
            return jsonify({'status': 'failure', 'message': 'Invalid username'})
    except Exception as e:
        return jsonify({'status': 'failure', 'message': str(e)}), 500

@app.route('/payment_momo', methods=['POST'])
def payment_momo():
    if request.content_type != 'application/json':
        return jsonify({'status': 'error', 'message': 'Content-Type must be application/json'}), 415

    try:
        momo_access_key = 'F8BBA842ECF85'
        momo_secret_key = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
        momo_partner_code = 'MOMO'
        momo_redirect_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/payment'
        momo_ipn_url = 'https://4jjl5xvc-5000.asse.devtunnels.ms/callback'
        momo_request_type = 'payWithMethod'

        amount = 50000
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

        signature = hmac.new(
            bytes(momo_secret_key, 'utf-8'), 
            bytes(rawSignature, 'utf-8'), 
            hashlib.sha256
        ).hexdigest()

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

        response = requests.post(
            'https://test-payment.momo.vn/v2/gateway/api/create',
            headers={'Content-Type': 'application/json'},
            json=requestBody  # Sử dụng json=requestBody để tự động chuyển đổi thành JSON và gửi đi
        )

        result = response.json()

        if response.status_code == 200 and 'payUrl' in result:
            return jsonify({'payUrl': result['payUrl']})
        else:
            return jsonify({'message': 'Payment failed'}), 500
    except Exception as e:
        return jsonify({'message': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
