const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const UserSchema = new mongoose.Schema({
  name: {
    type: String, // tipos nativos do javascript
    required: true // obrigatorio
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true // todos e-mails ficam em caixa baixa
  },
  password: {
    type: String, // tipos nativos do javascript
    required: true // obrigatorio
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// antes de salvar um dado (save ou update), é chamado esse 'middleware'
UserSchema.pre("save", async function(next) {
  // não é usado arrow function para ter acesso ao this
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 8); // apenas isso ja encriptografa
});

// aqui posso inserir todos métodos que desejo que cada isntancia de usuario tenha
UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  }
};

UserSchema.statics = {
  generateToken({ id }) {
    // posso passar quantas informações eu quiser no primeiro parametro, é possivel obter de volta as informações
    // segundo parametro é um segredo para a criptografia
    // terceiro parametro é a configuração de expiração do token
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl // em milissegundos
    });
  }
};

module.exports = mongoose.model("User", UserSchema);
