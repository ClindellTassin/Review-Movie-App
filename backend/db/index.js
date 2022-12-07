const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected Successfully');
})
.catch((ex) => {
    console.log('Database connection Failed: ', ex);
})