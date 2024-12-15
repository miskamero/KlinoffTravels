from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# load the airports
with open('./airport_data/airports.json', encoding='utf-8') as f:
    airports = json.load(f)

# Preprocess the airports to split the city from the country
for airport in airports['airports']:
    if 'location' in airport and ',' in airport['location']:
        airport['city'] = airport['location'].split(',')[0].strip()
        airport['country'] = airport['location'].split(',')[1].strip()

@app.route('/api/airports', methods=['GET'])
def get_airports():
    return jsonify(airports)

@app.route('/api/airports/<iata>', methods=['GET'])
def get_airport_by_iata(iata):
    airport = next((airport for airport in airports['airports'] if airport['iata'] == iata), None)
    if airport:
        return jsonify(airport)
    return jsonify({"error": "Airport not found"}), 404

@app.route('/api/airports/city/<city>/country/<country>', methods=['GET'])
def get_airport_by_city_and_country(city, country):
    normalized_city = city.lower().strip()
    normalized_country = country.lower().strip()
    airport = next((airport for airport in airports['airports'] if normalized_city in airport['location'].lower() and normalized_country in airport['location'].lower() and airport['id'] is not None), None)
    if airport:
        return jsonify({"skyId": airport['skyId']})
    return jsonify({"error": "Airport not found"}), 404

@app.route('/api/airports/city/<city>', methods=['GET'])
def get_airports_by_city(city):
    normalized_city = city.lower().strip()
    city_airports = [airport for airport in airports['airports'] if normalized_city in airport['location'].lower()]
    if city_airports:
        return jsonify(city_airports)
    return jsonify({"error": "No airports found in the specified city"}), 404

if __name__ == '__main__':
    app.run(debug=True)