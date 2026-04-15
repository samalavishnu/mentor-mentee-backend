const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect('mongodb://mentor_Mentee:mentor-mente-db@ac-mgjt3ud-shard-00-00.cnzm2ds.mongodb.net:27017,ac-mgjt3ud-shard-00-01.cnzm2ds.mongodb.net:27017,ac-mgjt3ud-shard-00-02.cnzm2ds.mongodb.net:27017/?ssl=true&replicaSet=atlas-kkzjm9-shard-0&authSource=admin&appName=Cluster0')
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = connectDB;
