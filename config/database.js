const mongoose = require('mongoose')

exports.connectDatabase = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then((con) => {
            console.log(
                `=> mongo data base connected with host:${con.connection.host}`
            )
        })
        .catch((ex) => {
            console.error(ex)
            process.exit(1)
        })
}
