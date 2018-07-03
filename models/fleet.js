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
    tracking: String,
});

module.exports = mongoose.model('fleet', TaskSchema);
