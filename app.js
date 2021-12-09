const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const e = require('express');

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = ({
    title: String,
    content: String
});

const Article = new mongoose.model("Article",articleSchema);

app.route("/articles")

.get( function (req, res) {
    Article.find(function(err,foundArticles){
      if(err){
          res.send(err);
      } else {
          res.send(foundArticles);
      }
    })
})

.post(function(req,res){
    console.log(req.body.title)
    console.log(req.body.content)

    const article = new Article({
        title: req.body.title,
        content: req.body.content
    })

    article.save(function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Successfully added article");
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        } else {
            res.send("Successfully deleted all articles");
        }
    })
});

app.route("/articles/:articleTitle")
.get(function(req,res){
    const articleTitle = req.params.articleTitle;
    console.log(articleTitle);

    Article.findOne({title: articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("Couldn't find an article"); 
        }
    });
})
.put(function(req,res){
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content},
        { overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated a document");
            } else {
                console.log(req.params.articleTitle);
                res.send(err);       
            }        
        }
    );   
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated a document");
            } else {
                res.send(err);
            }

        }
    )
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},function(err){
        if(!err){
            res.send("Successfully deleted a document")
        } else {
            res.send(err)
        }
    });
});

app.listen(3000)

