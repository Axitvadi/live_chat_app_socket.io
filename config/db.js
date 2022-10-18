const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log(`Database Successfully Connected`)
}).catch(() => {
    console.log(`Database connection Failed`)
});