const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ejs = require("ejs");
const session = require("express-session");
const app = express();
const video = require("./models/video");
const fs = require("fs");
let numb = 0;
const path = require("path");


app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  })
);


function isValidCat(cat, rout) {
  let catagorys = new Array();
  if (rout === "catagory") {
    catagorys = ["review", "best_deals", "latest_tech"];
  } else if (rout === "tutorials") {
    catagorys = ["basic_guide", "pc_building_guide"];
  }
  for (i = 0; i < catagorys.length; i++) {
    if (catagorys[i] === cat) {
      return true;
    }
  }
  return false;
}


app.use((req, res, next) => {
  console.log(`Its index ${numb}`);
  console.log(`IP: ${req.connection.remoteAddress}`);
  numb++;
  next();
});


app.use(passport.initialize());
app.use(passport.session());
//Connecting to dtabase

mongoose.connect("mongodb://localhost/msk");

// Model.deleteMany()
// Model.deleteOne()
// Model.find()
// Model.findById()
// Model.findByIdAndDelete()
// Model.findByIdAndRemove()
// Model.findByIdAndUpdate()
// Model.findOne()
// Model.findOneAndDelete()
// Model.findOneAndRemove()
// Model.findOneAndUpdate()
// Model.replaceOne()
// Model.updateMany()
// Model.updateOne()
//Schemas

const User = require("./models/Users");
const Featured = require("./models/featured");
// console.log(Featured)
// let link = new Featured();
// link.order = 3;
// link.linked_id = "5e6ee0c7f1af502bacb5d44c";
// link.save((err)=>{
//   if(err){console.log(err)}
// })
// let user =  new User({username: "msk" , password: 'mskcoc123' , fullName: "Mr. Shakil Khan"})
// console.log(user);

// user.save((err)=>{
//     if(!err){ console.log('insert success')}else{
//         consolel.log(err)
//     }
// })

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

//   var upload = multer({ storage: storage })

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './thumbnails/')
//   },
//   filename: function (req, file, cb) {
//     let fName = new Date().toISOString() + Math.round(Math.random()*1000)+".img";
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     console.log(file)
//     cb(null, fName)
//   }
// })
const storage = multer.diskStorage({
  destination: "./thumbnails/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// let upload = multer({storage: storage});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("thumbnail");
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
app.set("view engine", "ejs");
app.get("/thumbnails/:id", (req, res) => {
  // console.log(req.params.id)
  fs.readFile("thumbnails/" + req.params.id, (err, file) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(file);
    }
  });
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// app.configure(function() {
// app.use(express.cookieParser());
// app.use(express.bodyParser());
// app.use(app.router);
// });
let videoOne = new video({
  location: "/thumbnails/header.jpg",
  title: "sfasdfasdfasdfasfs",
  discription:
    "In this video we will build a responsive Grid CSS layout using grid te...",
  catagory: "review",
  iframe: `<iframe width=<iframe width="560" height="315" src="https:\/\/www.youtube.com/embed/moBhzSC455o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
  time: "15 Mar 2020"
});
// videoOne.save((err)=>{
//   if(err){console.error(err)}else{
//     console.log('insert success')
//   }
// });
video.find({}, (err, videos) => {
  if (err) {
    console.error(err);
  } else {
    // console.log(videos)
  }
});
//using local statagy
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (password !== user.password) {
        return done(null, false, { message: "Incorrect password." });
      }
      // console.log(user)
      return done(null, user);
    });
  })
);
//serialize and deserealize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
  // console.log(user.id + 'this is ')
});

passport.deserializeUser(function(id, done) {
  // console.log(id + 'it is')
  User.findById(id, function(err, user) {
    if (err) {
      console.log(err);
    }
    done(err, user);
  });
});

app.get("/", async (req, res) => {
  let featured;
  Featured.find({}, async (err, featuredlink) => {
    if (err) {
      res.send(err);
    } else {
      if (featuredlink) {
        featured = [];
      }
      try {
        for (i = 0; i < featuredlink.length; i++) {
          // console.log(featuredlink)
          featured[i] = await video.findById(featuredlink[i].linked_id);
          // video.find({id: featuredlink[i].linked_id} , (errorr , feas)=>{if(!errorr){featured[i]=feas}else{res.send(errorr)}});
        }
        let latest;
        latest = await video
          .find({})
          .sort({ time: -1 })
          .limit(6);
        // console.log(res);
        // console.log(featured)
        res.render("index", {
          featured: featured,
          latest: latest
        });
      } catch (err) {
        console.log(err);
      }
    }
  }).sort({ time: -1 });
});

// }
// this will not return last three videos to do that pass in a querry of {$lt:4}
// console.log(latest)

app.get("/video/:id", (req, res) => {
  let id = req.params.id;
  video.findById(id, (err, video) => {
    res.render("video", {
      video: video
    });
  });
});
app.get("/all", async (req, res) => {
  let videos = [];
  try {
    videos = await video.find().sort({ time: -1 });
    res.render("videos", {
      catagory: "All Videos",
      videos: videos
    });
  } catch (errs) {
    if (errs) {
      console.log(errs);
    }
  }
});
app.get("/tutorials/:cat", async (req, res) => {
  let cat = req.params.cat;
  let videos;
  if (isValidCat(cat, "tutorials")) {
    try {
      videos = await video.find({ catagory: cat }).sort({ time: -1 });
      res.render("videos", {
        catagory: cat,
        videos: videos
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send("It is not a valid catagory");
  }
});
app.get("/catagory/:cat", (req, res) => {
  let cat = req.params.cat;
  if (isValidCat(cat, "catagory")) {
    // console.log(req.params.cat)
    video
      .find({ catagory: cat }, (err, videos) => {
        if (err) console.log(err);
        res.render("videos", {
          catagory: cat,
          videos: videos
        });
      })
      .sort({ time: -1 });
  }
});
app.get("/admin", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/admin/login");
  } else {
    res.render("admin");
  }
});
app.get("/admin/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("login");
  }
});
// passport.authenticate('local', {successRedirect: '/'})
app.post("/admin/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/admin");
    res.send("req.user.id");
  } else {
    // console.log('rt')
    passport.authenticate("local")(req, res, () => {
      // res.redirect('/admin/success')
      res.redirect("/admin");
    });
  }
});
app.get("/admin/featured", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/admin/login");
  } else {
    res.render("featured");
  }
});
app.post("/admin/featured", (req, res) => {
  if (req.isAuthenticated) {
    // console.log('req reacieved:253')
    let link = {};
    link.order = Number(req.body.order);
    link.linked_id = req.body.linked_id;
    Featured.updateOne({ order: req.body.order }, link, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.redirect("/admin");
        // console.log('success')
      }
    });
  } else {
    res.redirect("/admin/login");
  }
});
app.get("/admin/upload", (req, res) => {
  if (req.isAuthenticated() === true) {
    // console.log('auth')
    res.render("upload");
  } else if (req.isAuthenticated() === false) {
    res.redirect("/admin/login");
    // console.log('no auth:276')
  }
});
// let uploadImage =
app.post("/admin/upload", (req, res) => {
  if (req.isAuthenticated()) {
    upload(req, res, err => {
      if (err) {
        res.render("index", {
          msg: err
        });
      } else {
        if (err) {
          console.log(err + ":299");
        }
        let post = new video();
        post.title = req.body.title;
        post.discription = req.body.discription;
        post.catagory = req.body.catagory;
        post.location = req.file.path;
        // post.location = '/thumbnails/download.jpg'
        // console.log(req.file + 'err:296')
        post.iframe = req.body.iframe;
        post.save(err => {
          if (err) {
            console.log(err, "shiut");
          } else {
            res.redirect("/admin");
          }
        });
      }
    });
  } else {
    console.log("unauthinticated:295");
    res.redirect("/admin/login");
  }
});
app.get("/admin/delete", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("delete");
  } else {
    res.redirect("/admin/login");
  }
});
app.post("/admin/delete", (req, res) => {
  // console.log(req.body.id+':358')
  if (req.isAuthenticated()) {
    video.remove({ _id: req.body.id }, err => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/admin");
      }
    });
  } else {
    res.redirect("/admin/login");
  }
});
// console.log(mongoose.ObjectID)
app.get("/admin/forgot", (req, res) => {
  res.send("call: 01867968894");
});
app.use(express.static("static"));

app.listen(3000, err => {
  if (!err) {
    console.log("Server started at port 3000");
  }
});
