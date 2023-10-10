# Flygram: Telegram mini app bot example

## Description

This application is a flight booking app specifically designed for the Telegram Mini App platform. With this app, users can easily search for cities or airports and select various flight parameters such as departure location, arrival location, departure date, return date, number of travelers, cabin class, and more. Once the search criteria are set, the user can initiate the search and the app will display the available flights based on their preferences.

The user is presented with a list of flight options and can choose any desired flight. Upon selecting a flight, the app will navigate to the invoice screen, where the user can review the booking details and proceed to confirm the booking by clicking on the "Book Now" button.

The invoice screen provides a summary of the selected flight, including the flight details, passenger information, and pricing details. This screen allows users to review their booking before finalizing it. Once the booking is confirmed, the necessary payment and confirmation processes will be initiated.

## Features

- Search for flights based on departure location, arrival location, departure date, return date, number of travelers, and cabin class

- View available flights based on search criteria

- Select a flight and proceed to the invoice screen

## How it works

When the application launches, the user is presented with the loading screen. This screen is displayed while the application is initializing and validating data received via the Mini App by sending the WebApp.InitData to the server. [Telegram Mini App Init Data validation](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
.

Once the loading process is complete, the user is presented with the home screen with the themeparams that is received using the telegram js interface.

The app will watch any changes to the theme params and update the theme accordingly. By listening to the themeChanged event, the same for colorScheme.

The user can then search for flights by entering the departure location, arrival location, departure date, return date, number of travelers, and cabin class. Once the search criteria are set, the user can initiate the search and the app will display the available flights based on their preferences. The app will send the search params to the server and the server will send the search results back to the client.

When sending any request to the server the client adds the user's telegram webApp InitData to the request header, this is used to validate the request on the server side.

The user is presented with a list of flight options and can choose any desired flight. Upon selecting a flight, the app will navigate to the invoice screen, where the user can review the booking details and proceed to confirm the booking by clicking on the "Book Now" button.

The server will create a invoice link and send it to the client, the client then displays the invoice link using openInvoice method.

## Screenshots

<!-- ![Screenshot 1]( -->

## Setup

### Prerequisites

Node.js and npm are required to run this application. If you do not have them installed, you can download them from [here](https://nodejs.org/en/download/).

### Installation

1. Clone the repository
2. Install NPM packages

For Client

```sh
cd client
npm install or yarn install
cp .env.example .env
// add Server API URL to .env file
VITE_SERVER_API=
```

For Server

```sh
cd server
npm install or yarn install
cp .env.example .env
// add your API keys and Telegram to .env file
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=
TELEGRAM_BOT_TOKEN=
```

To get AMADEUS credentials, you need to create an account on [Amadeus](https://developers.amadeus.com/). Once you have created an account, you can create a new application and get the API key and secret.

To get TELEGRAM_BOT_TOKEN, you need to create a bot on [Telegram](https://core.telegram.org/bots#6-botfather). Once you have created a bot, you can get the bot token.

3. Run the application

For Client

```sh
cd client
npm run dev --host or yarn dev --host
```

The `--host` flag is required to run the application on a local server with https. This is necessary for the Telegram Mini App platform to be able to access the application.

For Server

```sh
cd server
node index.js or nodemon index.js
```

Note: nodemon is a dev dependency, so you will need to install it if you do not already have it installed.

## Usage

1. Open the Telegram app
2. Search for the [@flygram_bot](https://t.me/flygram_bot) bot and start a chat with it
3. Click on the "Start" button to start the bot
4. Click on the "Book Flight" button to start the booking process
5. The application will launch and you will be presented with the loading screen where the application will initialize and validate the data received via the Mini App
6. Once the loading process is complete, you will be presented with the home screen
7. Enter the departure location, arrival location. You can can also select the arrival location from popular destination list at the bottom
8. Select the departure date and return date
9. Select the number of travelers and cabin class
10. Click on the "Search" button to initiate the search
11. The application will display the available flights based on your search criteria
12. Select a flight
13. Review the booking details and click on the "Book Now" button to confirm the booking
