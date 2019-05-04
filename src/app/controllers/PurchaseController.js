const Ad = require("../models/Ad");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseMail = require("../jobs/PurchaseMail");
const Queue = require("../services/Queue");

class PurchaseController {
  async index(req, res) {
    const purchases = await Purchase.paginate(
      {},
      {
        page: req.query.page || 1, // procura parametros get na URL
        limit: 20,
        //populate: ["ad"],
        sort: "-createdAt" // o menos significa ordem decrescente
      }
    );
    return res.json(purchases);
  }

  async store(req, res) {
    const { ad, content } = req.body;

    const purchaseAd = await Ad.findById(ad).populate("author");
    const user = await User.findById(req.userId);

    if (purchaseAd.purchasedBy) {
      return res.json({ error: "Product is no longer available." });
    }

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save();

    const purchase = await Purchase.create({ ad, content });
    purchaseAd.sold = true;
    await purchaseAd.save();
    return res.json(purchase);
  }

  async destroy(req, res) {
    await Purchase.findByIdAndDelete(req.params.id);
    return res.send();
  }
}

module.exports = new PurchaseController();
