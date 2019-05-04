require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const validate = require("express-validation");
const Youch = require("youch");
const databaseConfig = require("./config/database");
const sentryConfig = require("./config/sentry");
const Sentry = require("@sentry/node");

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== "production";

    //this.sentry();
    this.database();
    this.middlewares();
    this.routes();
    this.exception();
  }

  database() {
    // nao precisei criar o banco dentro do mongo no docker
    mongoose.connect(databaseConfig.uri, {
      // essas configurações é pq é versão mais recente do node
      useCreateIndex: true,
      useNewUrlParser: true
    });
  }

  middlewares() {
    this.express.use(Sentry.Handlers.requestHandler());
    this.express.use(express.json());
  }

  routes() {
    this.express.use(require("./routes"));
  }

  exception() {
    if (process.env.NODE_ENV === "production") {
      this.express.use(Sentry.Handlers.errorHandler());
    }

    this.express.use(async (err, req, res, next) => {
      // se for erro de validação
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err);
      }

      if (process.env.NODE_ENV !== "production") {
        const youch = new Youch(err, req);
        //return res.json(await youch.toJSON());
        return res.send(await youch.toHTML());
      }

      // se for qualquer outro erro sem ser de validação
      return res
        .status(err.status || 500)
        .json({ error: "Internal Server Error" });
    });
  }

  sentry() {
    Sentry.init(sentryConfig);
  }
}

module.exports = new App().express;
