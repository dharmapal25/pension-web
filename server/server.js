require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required to start the server");
}

app.listen(PORT,()=> {
    console.log(`Server is running on PORT ${PORT}`);
});
