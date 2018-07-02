const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = Schema({
    origen: String,
    destino: String,
    idn: String,
    tipo: String,
});

module.exports = mongoose.model('routes', RouteSchema);