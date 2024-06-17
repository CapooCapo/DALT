from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS
import logging
import base64

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.secret_key = 'IKA@MCt14$243*&r2da#'

logging.basicConfig(level=logging.DEBUG)
# Thiết lập kết nối SQL Server
connection_string = 'DRIVER={SQL Server};SERVER=LAPTOP-IA1SF1L6\\HUANPC;DATABASE=Bakery'
connection = pyodbc.connect(connection_string)

@app.route('/data', methods=['GET'])
def get_data():
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Account')
        rows = cursor.fetchall()
        data = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
        return jsonify(data)
    except Exception as e:
        return str(e)

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data['username']
        password = data['password']
        
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM Account WHERE username = ? AND password = ?', (username, password))
        account = cursor.fetchone()
        
        if account:
            return jsonify({'status': 'success', 'message': 'Login successful', 'user': username})
        else:
            return jsonify({'status': 'failure', 'message': 'Invalid credentials'})
    except Exception as e:
        return str(e)
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

        product_type = request.form.get('product_type')
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
        cursor = connection.cursor()
        cursor.execute('SELECT Product_code, Product_Type, Product_Name, Price, Description, Image FROM Product')
        rows = cursor.fetchall()
        
        data = []
        for row in rows:
            product = dict(zip([column[0] for column in cursor.description], row))
            if product['Image']:
                product['Image'] = base64.b64encode(product['Image']).decode('utf-8')
            data.append(product)

        return jsonify(data)
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
                # Thêm người dùng mới
                cursor.execute('INSERT INTO Account (username, password, phoneNumber, email) VALUES (?, ?, ?, ?)', (username, password, phoneNumber, email))
                connection.commit()
                return jsonify({'status': 'success', 'message': 'User registered successfully'})
        else:
            return jsonify({'status': 'failure', 'message': 'Request must be JSON type'})
    except Exception as e:
        return str(e)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
