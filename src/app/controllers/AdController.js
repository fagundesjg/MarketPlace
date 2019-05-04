const Ad = require("../models/Ad");
const Purchase = require("../models/Purchase");

class AdController {
  async index(req, res) {
    const filters = { purchasedBy: null };

    if (req.query.price_min || req.query.price_max) {
      filters.price = {};

      if (req.query.price_min) {
        // gte = greater then equals
        // o $ é do mongoose, ele que interpreta
        filters.price.$gte = req.query.price_min;
      }

      if (req.query.price_max) {
        // lte = lower then equals
        filters.price.$lte = req.query.price_max;
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, "i"); // i = case insensitive
    }

    // se quisesse preencher as informações das relações utilizando find, era so coloca Ad.populate.find
    //const ads = await Ad.find(); // passa nada e ele busca tudo
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1, // procura parametros get na URL
      limit: 20,
      //populate: ["author"],
      sort: "-createdAt" // o menos significa ordem decrescente
    });
    return res.json(ads);
  }

  async show(req, res) {
    const ad = await Ad.findById(req.params.id);
    return res.json(ad);
  }

  async store(req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId });
    return res.json(ad);
  }

  async update(req, res) {
    // id, todas informações que desejamos atualizar, array de configuração
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true // depois de dar update, atualiza a variavel ad para retorna-la
    });
    return res.json(ad);
  }

  async destroy(req, res) {
    await Ad.findByIdAndDelete(req.params.id);
    return res.send();
  }

  async sell(req, res) {
    const purchase = await Purchase.findById(req.params.id);
    const ad = await Ad.findById(purchase.ad);

    if (ad && purchase) {
      ad.purchasedBy = purchase._id;
      await ad.save();
    }

    return res.send();
  }
}

module.exports = new AdController();
