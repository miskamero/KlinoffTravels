# Klinoff Travels

## Table of Contents

- [Features](#features)
- [APIs Used](#apis-used)
    - [External APIs](#external-apis)
    - [Own APIs](#own-apis)
- [Trip Database](#trip-database)
- [Services](#services)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Step-by-Step Implementation](#step-by-step-implementation)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
    - [User Authentication](#user-authentication)
    - [Flight Search](#flight-search)
    - [Itinerary Services](#itinerary-services)
- [External Documentation](#external-documentation)
- [Getting Started](#getting-started)
- [Supported Scripts](#supported-scripts)
- [Contributing](#contributing)
- [License](LICENSE)

## Features

- User Authentication
    - Users can sign up, log in, and manage their profiles using Firebase Authentication.

- Flight Search
    - Users can search for flights between two destinations using the Airlabs API and if the date is in the future, the SkyScanner API.

- Hotel Search
    - Users can search for hotels in their destination city using the TripAdvisor API.

- Weather Information
    - Users can get the weather information for their travel dates using Open Meteo API.
    **Note:** Due to the limitations of the Open Meteo API, the weather information is only available for 16 days in the future from the current date.

- Local Attractions
    - Users can get find popular attractions in their destination city using the Geoapify API.

- Itinerary Management
    - Users can save and manage their travel itineraries, including flights, hotels, and attractions.

## APIs Used

### External APIs

- [Airlabs API](https://developers.airlabs.co/docs/airports-api)
- [SkyScanner API](https://rapidapi.com/skyscanner/api/skyscanner-flight-search)
- [TripAdvisor API](https://rapidapi.com/apidojo/api/tripadvisor)
- [Open Meteo API](https://open-meteo.com/)
- [Geoapify API](https://www.geoapify.com/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

### Own APIs

#### The application uses self-hosted APIs made in Python using Flask for the following:

- Airports API
Endpoints are available in the [Flights API Documentation](backend/airportDB/airportsAPI_documentation.md)

The airports API is used to get the list of airports and their details. It has a `.json` file with the list of airports and their details.

- Cities API
Endpoints are available in the [Cities API Documentation](backend/cityAPI/citiesAPI_documentation.md)

The cities API is used to get the list of cities and their details. It has a `.csv` file with the list of cities and their details.

## Trip Database

The application uses a SQLite database to information about different users' trips.

- Base URL: http://127.0.0.1:5001/api/
- Endpoints:
    - `POST /trips`: Adds a new trip.
    - `GET /trips/{user_id}`: Returns all trips for the given user ID.
    - `DELETE /trips/{id}`: Deletes the trip with the given ID.

## Services

The application uses services to interact with the APIs and the database. This is done to separate the business logic from the API routes.

There are four services:

- `AttractionSearchService.js`: Handles the search for attractions in a city.
- `FetchHotelsService.js`: Handles the search for hotels in a city.
- `FlightSearchService.js`: Handles the search for flights between two destinations.
- `WeatherService.js`: Handles the search for weather information for a city.

## Tech Stack

- Frontend: React, Material-UI
- Styling: SCSS/Sass preprocessor
- Backend: Python, Flask, SQLite, Firebase Authentication & Firebase Functions
    - Database: SQLite
    - Self-Hosted APIs: Flask
- 3rd party APIs: Airlabs, SkyScanner, TripAdvisor, Open Meteo, Geoapify

## Project Structure

```
Klinoff-Travels/
├── .gitignore
├── backend/
│   ├── airportDB/
│   │   ├── airports.py
│   │   ├── airportsAPI_documentation.md
│   │   ├── airport_data/
|   |   |   ├── airports.json
│   ├── cityAPI/
│   │   ├── converterAPI.py
│   │   ├── citiesAPI_documentation.md
│   │   ├── city_data/
|   |   |   ├── citylist.csv
│   ├── tripsDB/
│   │   ├── database.py
│   │   ├── UserTrips_documentation.md
│   │   ├── userTripsDB.py
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── FlightSearch.jsx
│   │   ├── Footer.jsx
│   │   ├── ...
|   |   ├── styles/
|   |   |   ├── FlightSearch.scss
|   |   |   ├── Footer.scss
|   |   |   ├── ...
│   ├── services
│   │   ├── AttractionSearchService.js
│   │   ├── ...
│   ├── App.jsx
│   ├── App.scss
│   ├── firebase.js
│   ├── main.jsx
├── .gitignore
├── README.md
├── index.html
├── package.json
├── ProjectStart.md
├── vite.config.js
```

## Step-by-Step Implementation

1. **Frontend Setup**
    - Create a new React app using Vite.
    - Install Material-UI for styling.
    - Set up the project structure with components and styles folders.
    - Create the main components: FlightSearch, HotelSearch, WeatherInfo, Attractions, and Itinerary.

2. **Backend Setup**
    - Create the Flask apps.
    - Set up the database using SQLite.
    - Create the airports API to get the list of airports.
    - Create the cities API to get the list of cities.
    - Create the user trips database to store user trip information.

3. **User Authentication**
    - Set up Firebase Authentication.
    - Create the sign-up, log-in, and profile management pages.

4. **Flight Search**
    - Implement the flight search functionality using the Airlabs API.
    - Add the SkyScanner API for future dates.

5. **Itinerary Services**
    - Implement the hotel search functionality using the TripAdvisor API.
    - Implement the weather information functionality using the Open Meteo API.
    - Implement the local attractions functionality using the Geoapify API.
    - Implement the itinerary management functionality to save and manage travel itineraries.

## External Documentation

- [User Trips DB Documentation](backend/tripsDB/UserTrips_documentation.md)
- [Airports API Documentation](backend/airportDB/airportsAPI_documentation.md)
- [Cities API Documentation](backend/cityAPI/citiesAPI_documentation.md)

## Getting Started

### Prerequisites

**Note:** The Python packages can be installed using:

```bash
pip install -r requirements.txt
```

- Node.js
- Python
    **With the following packages:**
    - Flask
    - Flask-Cors
    - geopy

### Installation

1. Clone the repo:

```bash
git clone https://github.com/miskamero/KlinoffTravels.git
cd KlinoffTravels
```

2. Install the dependencies:

```bash
npm install
pip install -r requirements.txt
```

3. Start the frontend and backend servers:

```bash
npm run dev
python backend/airportDB/airports.py
python backend/cityAPI/converterAPI.py
python backend/tripsDB/userTripsDB.py
```

4. Open the browser and go to `http://localhost:5173`.

**Note:** You can use `npm run klinoff` to concurrently run the frontend and backend servers.

## Supported Scripts

- `npm run dev`: Starts the frontend server.
- `npm run klinoff`: Concurrently starts the frontend and backend servers.

