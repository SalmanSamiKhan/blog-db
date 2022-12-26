const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash') // lodash module
const dotenv = require("dotenv");
dotenv.config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// const posts = [] // posts array for storing title and content


app.set('view engine', 'ejs'); // setting view engine as ejs

app.use(bodyParser.urlencoded({ extended: true })); // for accessing nested object - {extended:true}
app.use(express.static("public")); // use local files from public directory

// mongoose set up 
const mongoose = require('mongoose') // require mongoose
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err.message);
    });

app.use(express.urlencoded({extended:true}))
// Schema
const postSchema = (
  {
    title: String,
    content: String
  }
)
// Model
const Post = mongoose.model('Post', postSchema)

// Rendering homepage
app.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    res.render('home', { homeContent: homeStartingContent, posts: posts }) //rendering homepage, passing data to homeContent in home.ejs
  })
})

// Rendering about page
app.get('/about', function (req, res) {
  res.render('about', { aboutContent: aboutContent })
})

// Rendering contact page
app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent })
})

// Rendering compose page
app.get('/compose', function (req, res) {
  res.render('compose')
})

// Rendering delete page
app.get('/delete', function (req, res) {
  Post.find({}, function (err, posts) {
    if(posts.length===0){
      res.redirect('/')
    }else{
    res.render('delete', { homeContent: homeStartingContent, posts: posts }) //rendering homepage, passing data to homeContent in home.ejs
    }
  })
})

// compose post req coming from browser
app.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.title, // see html form, title input name parameter is set to title
    content: req.body.content // content is named as content
  })
  post.save(function (err) {
    if (!err) {
      res.redirect('/') // after composing and submitting go back to homepage
    }
  })
})

app.post('/delete', function (req, res) {
  let id = (req.body.id).trim()
  Post.findByIdAndRemove(id, function (err) { // method name says it all
    if (!err) {
      console.log('deleted items success');
      res.redirect('/');
    }
  })
})

// post.ejs get request , dynamic url - for example, https://bbc.com/posts/sprots-news
app.get('/posts/:_id', function (req, res) {
  Post.findOne({ _id: req.params._id }, function (err, post) {
    res.render('post', { title: post.title, content: post.content })
  })
  // Post.find({}, function(err,posts){ //Read posts collection
  //   posts.forEach(function (post) { // iterating over posts array
  //     if (post._id === req.params.topic) { //using lodash checking if post title and topic in url is same
  //       res.render('post', { title:post.title, content:post.content }) // if same render post.ejs
  //     }
  //   })
  // })
})
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
