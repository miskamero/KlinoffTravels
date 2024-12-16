from flask import Flask, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
import csv

app = Flask(__name__)
CORS(app)

with open('./city_data/citylist.csv', encoding='utf-8') as f:
    cities = list(csv.DictReader(f))

for city in cities:
    city['city'] = city['name']
    city['country'] = city['country']

@app.route('/api/cities', methods=['GET'])
def get_cities():
    return jsonify(cities)

@app.route('/api/cities/<city>', methods=['GET'])
def get_city_by_name(city):
    normalized_city = city.lower().strip()
    city = next((city for city in cities if normalized_city in city['name'].lower()), None)
    if city:
        return jsonify(city)
    return jsonify({"error": "City not found"}), 404

@app.route('/api/cities/country/<country>', methods=['GET'])
def get_cities_by_country(country):
    normalized_country = country.lower().strip()
    country_cities = [city for city in cities if normalized_country in city['country'].lower()]
    if country_cities:
        return jsonify(country_cities)
    return jsonify({"error": "No cities found in the specified country"}), 404

@app.route('/api/coords/<city>', methods=['GET'])
def get_coords_by_city(city):
    geolocator = Nominatim(user_agent="cityAPI")
    location = geolocator.geocode(city)
    return jsonify({"latitude": location.latitude, "longitude": location.longitude})

@app.route('/api/coords/<country>', methods=['GET'])
def get_coords_by_country(country):
    geolocator = Nominatim(user_agent="cityAPI")
    location = geolocator.geocode(country)
    return jsonify({"latitude": location.latitude, "longitude": location.longitude})

if __name__ == '__main__':
    app.run(debug=True, port=5002)