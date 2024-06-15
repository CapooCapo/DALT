from flask import Flask, request, jsonify
import pyodbc
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.secret_key = 'IKA@MCt14$243*&r2da#'

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
