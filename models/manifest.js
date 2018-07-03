const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManifestSchema = Schema({
    code: String,
    route: String,
    fleet: String,
    date: String,
});

module.exports = mongoose.model('manifest', ManifestSchema);