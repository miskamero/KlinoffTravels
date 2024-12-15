import sqlite3

def init_db():
    conn = sqlite3.connect('userTrips.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            trip_name TEXT NOT NULL,
            departure_city TEXT NOT NULL,
            arrival_city TEXT NOT NULL,
            departure_date TEXT NOT NULL,
            return_date TEXT,
            details TEXT
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect('userTrips.db')
    conn.row_factory = sqlite3.Row
    return conn