require("dotenv").config();
const { Level } = require("level");
const express = require("express");
const crypto = require("crypto");
var cors = require("cors");
var Amadeus = require("amadeus");
var bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 3000;

const db = new Level("username_id_map", { valueEncoding: "json" });

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

let TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  // console.log(ctx.chat);
  db.put(ctx.chat.username, ctx.chat.id, function (err) {
    if (err) throw err;

    db.get(ctx.chat.username, function (err, value) {
      console.log(value);
    });
  });

  ctx.reply(ctx.chat);
});

bot.on("pre_checkout_query", (ctx) => ctx.answerPreCheckoutQuery(true)); // response to a preliminary request for payment

bot.on("successful_payment", async (ctx, next) => {
  // reply in case of positive payment
  await ctx.reply("SuccessfulPayment");
});

bot.launch();

function validateTelegramInitData(telegramInitData) {
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(TELEGRAM_BOT_TOKEN);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  return _hash === hash;
}

async function getChatId(telegramInitData) {
  const encoded = decodeURIComponent(telegramInitData);
  const arr = encoded.split("&");
  const username = JSON.parse(arr[1].replace("user=", "")).username;

  return await db.get(username);
}

app.use((req, res, next) => {
  if (req.path === "/") {
    next();
  } else {
    if (req.headers["telegraminitdata"]) {
      if (validateTelegramInitData(req.headers["telegraminitdata"])) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  }
});

app.get("/", (req, res) => {
  res.send({
    message: "It works!",
  });
});

app.get("/validate", async (req, res) => {
  try {
    const value = await getChatId(req.headers["telegraminitdata"]);
    console.log(value);

    res.send({
      isValid: validateTelegramInitData(req.headers["telegraminitdata"]),
      chat_id: value,
    });
  } catch (error) {
    res.send({
      isValid: false,
    });
  }

  // });
});

app.get(`/citySearch`, async (req, res) => {
  console.log(req.query);
  var keywords = req.query.keyword;
  const response = await amadeus.referenceData.locations
    .get({
      keyword: keywords,
      subType: "CITY,AIRPORT",
    })
    .catch((x) => console.log(x));
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

app.post("/flightOffersSearch", (req, res) => {
  let body = req.body;
  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: body.originLocationCode,
      destinationLocationCode: body.destinationLocationCode,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      adults: body.adults,
      children: body.children,
      infants: body.infants,
      travelClass: body.travelClass,
      nonStop: body.nonStop,
      currencyCode: "USD",
      max: "10",
    })
    .then(function (response) {
      res.setHeader("content-type", "application/json");
      res.send(response.body);
    })
    .catch(function (responseError) {
      res.send(responseError);
    });
});

app.post("/flightOfferBook", async (req, res) => {
  let body = req.body;

  console.log(body.flightFrom);
  const invoice = {
    provider_token: "284685063:TEST:YjUyYzZiZWQxNzIz",
    start_parameter: "pay",
    title:
      body.flightFrom.iataCode +
      " to " +
      body.flightTo.iataCode +
      " Flight booking invoice",
    description: "This is a test invoice for flight booking",
    currency: "USD",
    photo_url:
      "https://cdn.dribbble.com/userupload/10652815/file/original-ddc97662e9bd0aede07bfe58ec6b2cd7.jpg?resize=1024x768",
    payload: uuidv4(),
    is_flexible: true,
    prices: [
      {
        label: "Price",
        amount: parseFloat(body.flightOffer.price.total) * 100,
      },
    ],
  };

  // create invoice link
  const invoiceLink = await bot.telegram.createInvoiceLink(invoice);
  res.send({
    invoiceLink: invoiceLink,
  });
});

app.listen(port, () => {
  console.log(`Flygram app server listening on port ${port}`);
});
