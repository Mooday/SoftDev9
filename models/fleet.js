const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = Schema({
    code: String,
    plate: String,
    type: String,
    status: {
        type: String,
        default: "Available",
    },
    tracking: {
        type: String,
        default: "Garage",
    },
});

module.exports = mongoose.model('fleet', TaskSchema);
