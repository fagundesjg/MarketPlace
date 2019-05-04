const express = require("express");
const validate = require("express-validation");
const handle = require("express-async-handler");
const routes = express.Router();

const authMiddleware = require("./app/middlewares/auth");

const controllers = require("./app/controllers");
const validators = require("./app/validators");

routes.get("/", (req, res) => {
  return res.json({ message: "Olá mundo" });
});

routes.post(
  "/users",
  validate(validators.User),
  handle(controllers.UserController.store)
);
routes.post(
  "/sessions",
  validate(validators.Session),
  handle(controllers.SessionController.store)
);

// apenas as rotas daqui pra baixo usam o authMiddleware!!!
routes.use(authMiddleware);

// Rotas do Ads
routes.get("/ads", handle(controllers.AdController.index));
routes.get("/ads/:id", handle(controllers.AdController.show));
routes.post(
  "/ads",
  validate(validators.Ad),
  handle(controllers.AdController.store)
);
routes.put(
  "/ads/:id",
  validate(validators.Ad),
  handle(controllers.AdController.update)
);
routes.delete("/ads/:id", handle(controllers.AdController.destroy));
routes.put("/ads/sell/:id", controllers.AdController.sell);

// Rotas do Purchases
routes.delete("/purchases/:id", handle(controllers.PurchaseController.destroy));
routes.get("/purchases", controllers.PurchaseController.index);
routes.post(
  "/purchases",
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
);

module.exports = routes;
