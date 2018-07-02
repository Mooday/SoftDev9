const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PedidoSchema = Schema({
    name: String,
    email: String,
    phone: String,
    desc1: String,
    tipo: String,
    desc2: String,
    receiver: String,
    size: String,
    weight: String,
    origen: String,
    destino: String,
    code: String,
    track: String,
    status:{
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model('pedido', PedidoSchema);