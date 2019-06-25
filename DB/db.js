
/**
 *@file Use Mongo DB. Defines schemas of collections.
 */
const mongoose = require("mongoose");
require('./connect');


// define the schema of heart signal
const heartRate = new mongoose.Schema({
    userId: String,
    signal: String,
}, {timestamps: true});

// define the schema of muscle signal
const muscleStrength = new mongoose.Schema({
    userId: String,
    signal: String,
    
}, {timestamps: true});


// initiate models
const ecgModel = mongoose.model('ecg', heartRate);
const emgModel = mongoose.model('emg', muscleStrength);


module.exports = {
    ecgModel,
    emgModel,
};