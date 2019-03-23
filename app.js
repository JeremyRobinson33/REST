const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

//Request Targeting All Articles

app.route('/articles')
.get(function(req,res) {
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
.post(function(req,res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err) {
      res.send("Successfullly added a new article");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res) {
  Article.deleteMany(function(err) {
    if(!err) {
      res.send('Successfullly deleted all articles');
    } else {
      res.send(err);
    }
  });
});

//Request Targeting a Specific Article

app.route('/articles/:articleTitle').get(function(req,res) {
  Article.findOne({title:req.params.articleTitle}, function(err,foundArticle){
    if(!err) {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    } else {
      res.send(err);
    }
  })
})
.put(function(req,res){
  Article.update({title:req.params.articleTitle},{title:req.body.title, content:req.body.content},
    {overwrite:true}, function(err) {
      if(!err) {
        res.send("Successfullly update article.");
      } else {
        res.send(err);
      }
    });
})
.patch(function(req,res) {
  Article.update({title:req.params.articleTitle}, {$set: req.body},
  function(err){
    if(!err) {
      res.send("Successfullly updated article");
    } else {
      res.send(err);
    }
  })
})
.delete(function(req, res){
  Article.deleteOne({title:req.params.articleTitle}, function(err){
    if(!err) {
      res.send("Deleted " + req.params.articleTitle);
    } else {
      res.send(err);
    }
  })
});

app.listen(3003, function() {
  console.log("Server is up and listening on port 3003")
});
