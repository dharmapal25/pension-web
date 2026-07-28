require("dotenv").config();
const app = require("./src/app");
const mongoDBConnection = require("./src/config/mongodb")

const PORT = process.env.PORT

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required to start the server");
}

mongoDBConnection();

app.listen(PORT,()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
