let express = require("express");
let app = express();
let bodyparser = require("body-parser");
let cookieparser = require("cookie-parser");
let session = require("express-session");
// let morgan = require("morgan");
let mongoose = require("mongoose");
let Blog = require("./models/blog");
const { result } = require("lodash");

let dburi = "mongodb://localhost:27017/users";
mongoose
  .connect(dburi)
  .then((result) => app.listen(3040,(req,res)=>{
    console.log('Server created')
  }))
  .catch((err) => console.log(err));

let adminno = 226688;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(
  session({
    key: "usersid",
    secret: "this is the id",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);
app.use(express.static("static"));
// app.use(morgan("dev"));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// User side
app.get("/", (req, res) => {
  if (req.session.email) {
    res.redirect("/log-outt");
  } else if(req.session.admin){
    res.redirect('/admin-log')
  }else {
    res.render("login", { title: "Login Page" });
  }
});

let user;
app.post("/", async (req, res) => {
  const usermail = req.body.email;
  userpsswd = req.body.password;

  try {
    user = await Blog.findOne({ email: usermail });
    if (user) {
      if (usermail === user.email && userpsswd === user.password) {
        req.session.email = user;
        console.log("user session created");
        res.redirect("/log-outt");
      } else {
        console.log("user session fail");
        res.redirect("/");
      }
    } else {
      console.log("user email not valid");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});


app.get("/log-outt", (req, res) => {
  if (req.session.email) {
    res.render("log-out", { title: "log-out" });
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  if (req.session.email) {
    req.session.destroy();  
    console.log('User session destroyed')
  res.redirect("/");
  }else{
    res.redirect('/')
  }
});



// admin side
app.get("/admin-log", (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("admin-log", { title: "admin-log" });
  }
});

//admin login page
app.post("/admin-log", (req, res) => {
  if (adminno == req.body.password) {
    req.session.admin = true;
    console.log("admin session created");
    res.redirect("/admin");
  } else {
    res.redirect("/admin-log");
  }
});

app.get("/admin", (req, res) => {
  if (req.session.admin) {
    Blog.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        res.render("admin", { title: "Admin", blogs: result });
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.render("admin-log", { title: "admin-log" });
  }
});

app.get('/admin-logout', (req, res)=>{
  if(req.session.admin){
    req.session.destroy();
    console.log('Admin sesssion destroyed');
    res.redirect('/admin-log')
  }else{
    res.redirect('/admin-log')
  }
})



app.get("/newblog", (req, res) => {
  if(req.session.admin){
  
    console.log(" this is for new maker page ");
    res.render("new", { title: "NewBlog" });
  
  }else{
    res.redirect('/admin-log')
  }
  })

app.get("/blogs/:id", (req, res) => {
  if(req.session.admin){
  
    console.log(" this is for single an element ");
    let id = req.params.id;
    Blog.findById(id)
      .then((result) => {
        res.render("details", { title: "Blog Detail", blog: result });
      })
      .catch((err) => res.render("404", { title: "Blog not found" }));
  }else{
    res.redirect('/admin-log')
  }
  })




// this is for new update delete form

app.post("/form", (req, res) => {
  console.log(" this is for make an new element ");
  let blog = new Blog(req.body);
  blog.save().then((result) => {
    req.session.user = result;
    res.redirect("/");
  });
});

app.post("/blogs/:id", (req, res) => {
  let id = req.params.id;
  console.log(" this is for update an element ");
  Blog.updateOne(
    { _id: req.body.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
    },
    console.log(req.body)
  )
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => console.log(err));
});

app.delete("/blogs/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);
  console.log(" this is for delete an element ");
  Blog.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      res.json({ redirect: "/admin" });
    })
    .catch((err) => console.log(err));
});
