const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MongoURL='mongodb://127.0.0.1/wanderlust';

async function main() {
    await mongoose.connect(MongoURL);  
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:'686453a5c0f6c82a68f76efd'}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with data");
};

initDB();