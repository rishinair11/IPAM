const mongoose = require('mongoose');

//defined schema of mongoDB object
const Schema = mongoose.Schema;

const ipList = new Schema({
    ipaddress: String,
    network_id: String,
    subnet_mask: String,
    gateway: String,
    dns: String,
    domain: String,
    cidr: String
});

const UserSchema = new Schema({
    owner: String,
    pool: [ipList]
});



const user = module.exports = mongoose.model('user', UserSchema);