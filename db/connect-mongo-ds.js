const mongoose = require('mongoose');

const getConection = async () => {
    try {
        const url = process.env.MONGO_URI || 'mongodb+srv://Cfvs95:Cfvs1995**@cluster0.o9eppko.mongodb.net/Peliculas?retryWrites=true&w=majority&appName=Cluster0';

        await mongoose.connect(url);

        console.log('Connected to MongoDB');
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = { 
    getConection 
};