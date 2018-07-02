const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubrouteSchema = Schema({
    origen: String,
    destino: String,
    idn: String,
});

module.exports = mongoose.model('subroutes', SubrouteSchema);