const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const Collected_DataSchema = new Schema({
    deviceID: {type: String},
    error_communication_error: [],
    error_out_of_range: [],
    null_fields: [],
    created_at: {type: Date, default: Date.now()},
    time: {type: String},
   dateToExpired: {type: String}
}, {
    strict: false
});

Collected_DataSchema.plugin(mongoosePaginate);
Collected_DataSchema.index({deviceID: 1, created_at: -1});

const CollectedData = mongoose.model("CollectedData", Collected_DataSchema);

module.exports = CollectedData;
