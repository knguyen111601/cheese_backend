/////////////////////////////////////////////
// Import Dependencies
/////////////////////////////////////////////
require("dotenv").config()
const {PORT = 3001, DATABASE_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")

/////////////////////////////////////////////
// Import Middleware
/////////////////////////////////////////////
const cors = require("cors")
const morgan = require("morgan")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true})

// connection events
mongoose.connection
.on("open", ()=>{console.log("Connected to Mongo")})
.on("close", ()=>{console.log("Disconnected to Mongo")})
.on("error", (error)=>{console.log(error)})

/////////////////////////////////////////////
// Model
/////////////////////////////////////////////

const {Schema, model} = mongoose

const CheeseSchema = new Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = model("Cheese", CheeseSchema)

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
// test route
app.get("/", (req, res)=>{
    res.send("hello world")
})

// Index Route
// get request to /cheese, returns json of all cheese
app.get("/cheese", async (req, res)=>{
    try {
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


// Create Route
// post request to /cheese, uses request body to create new cheese
app.post("/cheese", async (req, res)=>{
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Update Route
// put request to /cheese/:id, updates cheese based on id
app.put("/cheese/:id", async (req, res)=>{
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Destroy Route
// delete request to /cheese/:id, deletes cheese specified by id
app.delete("/cheese/:id", async(req,res)=>{
    try {
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})


/////////////////////////////////////////////
// Listener 
/////////////////////////////////////////////
app.listen(PORT, ()=>{console.log(`Listening on PORT ${PORT}`)})