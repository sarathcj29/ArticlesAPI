const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('Article', articleSchema);

// Articles API Routes
app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.status(200).send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.status(201).send('Success adding new Article');
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.status(204).send('Successfully deleted all Articles');
      } else {
        res.send(err);
      }
    });
  });

// Article Data sepecific API Route
app
  .route('/article/:aritcleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.aritcleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.status(200).send(foundArticle);
      } else {
        res.status(204).send(`No records found with title ${req.params.aritcleTitle}`);
      }
    });
  })
  .put((req, res) => {
    Article.findOneAndReplace(
      { title: req.params.aritcleTitle },
      { title: req.body.title, content: req.body.content },
      { returnDocument: 'after' },
      (err, foundArticle) => {
        if (!err) {
          res.status(202).send(foundArticle);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.aritcleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: false },
      (err, foundArticle) => {
        if (!err) {
          res.status(202).send(foundArticle);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.aritcleTitle }, (err) => {
      if (!err) {
        res.status(202).send('Successfully deleted');
      }
    });
  });

app.listen(port, () => {
  console.log(`Wiki-API Server started at ${port}`);
});
