# Airports API Documentation

**Base URL:** `http://127.0.0.1:5000/api/`

**Endpoints:**

1. **GET /airports**
    - Returns a list of all airports in the database.
    - Example: `http://127.0.0.1:5000/api/airports`

2. **GET /airports/{IATA_code}**
    - Returns the airport with the given IATA code.
    - Example: `http://127.0.0.1:5000/api/airports/HEL`

3. **GET /airports/city/{city_name}**
    - Returns a list of all airports in the given city.
    - Example: `http://127.0.0.1:5000/api/airports/city/Helsinki`

4. **GET /airports/city/{city_name}/country/{country_name}**
    - Returns the first airport in the given city and country that has a Skyscanner ID.
    - Example: `http://127.0.0.1:5000/api/airports/city/helsinki/country/finland`
