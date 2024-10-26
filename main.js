const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
//app.set("")

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.render("display");
})

app.post("/", (req, res) => {
    
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000");
})