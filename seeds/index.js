// Ovo je zaseban fajl kojim popunjavam bazu podataka sa fake podatcima...svaki put regenerise random
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descrotors, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

//zato sto ovo zasebno pokrenemo u nodu zato se i zasebno povezujemo sa bazom...
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", ()=>{
    console.log("Database connected");
});
//
//pravimo funkciju koja uzima array i popunjava ga odredjeni broj puta u zavisnosti od duzine arraya
const sample = array => array[Math.floor(Math.random() * array.length)];
//funkcija koja brise iz baze i popunjava je novim podatcima
const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()* 1000);
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})
//zatvaramo konekciju nakon sto se zavrsi radnja