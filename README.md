# Klinoff Travels

Klinoff Travels is a travel planning application that allows users to search for flights, hotels, weather information, and local attractions for their travel destinations. Users can sign up, log in, and manage their profiles. They can search for flights between two destinations, find hotels in their destination city, get weather forecasts for their travel dates, and discover popular attractions in their destination city. Users can save and manage their travel itineraries, including flights, hotels, and attractions.

## Table of Contents

- [Features](#features)
- [APIs Used](#apis-used)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [License](#license)

## Features

- **User Authentication**: Users can sign up, log in, and manage their profiles.
- **Flight Search**: Users can search for flights between two destinations.
- **Hotel Search**: Users can search for hotels in their destination city.
- **Weather Information**: Users can get weather forecasts for their travel dates.
- **Local Attractions**: Users can find popular attractions in their destination city.
- **Itinerary Management**: Users can save and manage their travel itineraries.

## APIs Used

- **Flight Search API**: Skyscanner API or Amadeus API
- **Hotel Search API**: Booking.com API or Hotels.com API
- **Weather Information API**: OpenWeatherMap API
- **Local Attractions API**: Google Places API or TripAdvisor API
- **User Authentication**: Firebase Authentication

## Tech Stack

- **Frontend**: React.js
- **Backend**: Firebase Functions or Node.js
- **Database**: Firebase Firestore or MongoDB
- **Authentication**: Firebase Authentication
- **Styling**: SCSS/Sass preprocessor

## Project Structure

<!-- .gitignore AirportsAPI_test.html backend/ airportDB/ airport_data/ airports.py airportsAPI_documentation.md cityAPI/ citiesAPI_documentation.md city_data/ converterAPI.py tripsDB/ database.py UserTrips_documentation.md userTripsDB.py eslint.config.js index.html package.json ProjectStart.md README.md src/ App.jsx App.scss assets/ components/ FlightSearch.jsx Footer.jsx HotelSearch.jsx LandingPage.jsx ... firebase.js main.jsx proxy.js styles/ vite.config.js -->

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

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:

```bash
git clone
cd KlinoffTravels
```

2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```
