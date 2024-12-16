# Cities API Documentation

**Base URL:** `http://127.0.0.1:5002/api/`

**Endpoints:**

1. **GET /cities**
    - Returns a list of all cities in the database.
    - Example: `http://127.0.0.1:5002/api/cities`

2. **GET /cities/{city_name}**
    - Returns information about the city with the given name.
    - Example: `http://127.0.0.1:5002/api/cities/helsinki`

3. **GET /cities/country/{country_name}**
    - Returns a list of all cities in the given country.
    - Example: `http://127.0.0.1:5002/api/cities/country/finland`

4. **GET /coords/{city_name}**
    - Returns the latitude and longitude of the given city.
    - Example: `http://127.0.0.1:5002/api/coods/helsinki`

5. **GET /coords/{country_name}**
    - Returns the latitude and longitude of the given country.
    - Example: `http://127.0.0.1:5002/api/coords/finland`