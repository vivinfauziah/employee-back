const express = require("express")
const bodyParser = require("body-parser")
const employeeRoutes = require("./routes/employee")
const userRoutes = require("./routes/user");
const fileUpload = require("express-fileupload")

const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

const jwt = require("jsonwebtoken");

const app = express()

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(fileUpload())
app.use(express.static("public"))
app.use(passport.initialize());

// app.post("/upload", (req, res) => {
//     if(!req.files.image){
//         return res.status(400).send("No files were uploaded")
//     }
//     let image = req.files.image

//     let date = new Date()
//     let imageName = date.getTime()+".png"
//     image.mv("./public/"+imageName,(error) =>{
//         if (error) return res.status(500).send(error)
//         res.json({ path : "http://localhost:3300/"+imageName })
//     })
// })

passport.use("auth", new BearerStrategy((token, done) => {
    jwt.verify(token, "secretkey", (error, decoded) => {

        if (error) {
            return done("User Not Authorized", null);
        }
        else{
            return done(null, decoded);
        }

    })

}));

app.post("/api/validatetoken", passport.authenticate("auth", {session : false}), (req, res) => {
    res.send(req.user)
})


app.use("/api/employee", employeeRoutes(passport))
app.use("/api/user", userRoutes);

app.listen(3300)