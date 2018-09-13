const mongoose = require('mongoose');

//defined schema of mongoDB object
const Schema = mongoose.Schema;

const ipPoolSchema = new Schema({
    hostname: String,
    ipaddress: String,
    owner: String,
    assigned: Boolean
});

const ipamSchema = new Schema({
    network_id: String,
    gateway: String,
    subnet_mask: String,
    dns: String,
    domain: String,
    ip_pool : [ipPoolSchema]
});


const ipam = module.exports = mongoose.model('networks', ipamSchema);
