from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db_connection

app = Flask(__name__)
CORS(app)

# Initialize the database
init_db()

@app.route('/api/trips', methods=['POST'])
def add_trip():
    data = request.get_json()
    user_id = data['user_id']
    trip_name = data['trip_name']
    departure_city = data['departure_city']
    arrival_city = data['arrival_city']
    departure_date = data['departure_date']
    return_date = data.get('return_date')
    details = data.get('details')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO trips (user_id, trip_name, departure_city, arrival_city, departure_date, return_date, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, trip_name, departure_city, arrival_city, departure_date, return_date, details))
    conn.commit()
    trip_id = cursor.lastrowid
    conn.close()

    return jsonify({'id': trip_id}), 201

@app.route('/api/trips/<user_id>', methods=['GET'])
def get_trips(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM trips WHERE user_id = ?', (user_id,))
    trips = cursor.fetchall()
    conn.close()

    return jsonify([dict(trip) for trip in trips])

@app.route('/api/trips/<int:id>', methods=['DELETE'])
def delete_trip(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM trips WHERE id = ?', (id,))
    conn.commit()
    deleted = cursor.rowcount
    conn.close()

    return jsonify({'deleted': deleted})

if __name__ == '__main__':
    app.run(debug=True, port=5001)