const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SucursalSchema = Schema({
    name: String,
    ubicacion: String,
    horario: String,
    id: String,
});

module.exports = mongoose.model('sucursal', SucursalSchema);