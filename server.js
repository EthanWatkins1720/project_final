const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");


const upload = multer({ dest: __dirname + "/images" });

mongoose.connect("mongodb+srv://ethanwatkins1720:projectFinal@cluster0.t7nmysm.mongodb.net/")
    .then(() => console.log("Connected to mongodb"))
    .catch((error) => console.log("Couldn't connect to mongodb", error));

const articleSchema = new mongoose.Schema({
    // _id: mongoose.SchemaTypes.ObjectId,
    title: String,
    author: String,
    date: String,
    image: String,
    text: String,
});

const Article = mongoose.model("Article", articleSchema);

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/data", (req, res) => {
    getArticles(res);
});

const getArticles = async(res) => {
    const articles = await Article.find();
    res.send(articles);
};

app.get("api/data/:id", (req, res) => {
    getArticle(res, req.params.id);
});

const getArticle = async(res, id) => {
    const article = await Article.findOne({_id:id});
    res.send(article);
};

app.post("/api/data", upload.single("image"), (req, res) => {
    const result = validateArticle(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const article = new Article({
        title: req.body.title,
        author: req.body.author,
        date: req.body.date,
        year: req.body.year,
        text: req.body.text
    })

    if (req.file) {
        article.image = "images/" + req.file.filename;
    }

    createArticle(res, article);
});

const createArticle = async(res, article) => {
    const result = await article.save();
    res.send(article);
};

app.put("/api/data/:id", upload.single("image"), (req, res) => {
    const result = validateArticle(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateArticle(req, res);
});

const updateArticle = async(req, res) => {
    let fieldsToUpdate = {
        title:req.body.title,
        author:req.body.author,
        date:req.body.date,
        text:req.body.text,
    }

    if (req.file) {
        fieldsToUpdate.image = "images/" + req.file.filename;
    }

    const results = await Article.updateOne({_id:req.params.id}, fieldsToUpdate);
    res.send(results);
}

app.delete("/api/data/:id", (req, res) => {
    removeArticle(res, req.params.id);
});

const removeArticle = async(res, id) => {
    const article = await Article.findByIdAndDelete(id);
    res.send(article);
}

const validateArticle = (article) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        title: Joi.string().min(1).required(),
        author: Joi.string().min(1).required(),
        date: Joi.string().min(3).required(),
        text: Joi.string().min(3).required(),
    });
    return schema.validate(article);
};

app.listen(3000, () => {
    console.log("How can I help you?")
});