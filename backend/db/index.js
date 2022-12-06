const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017/review_app')
.then(() => {
    console.log('Database connected Successfully');
})
.catch((ex) => {
    console.log('Database connection Failed: ', ex);
})