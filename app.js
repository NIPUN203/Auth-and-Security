
require("dotenv").config();
const express=require("express");
const body_parser=require("body-parser");
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,family:4});

const app=express();
app.use(body_parser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));

const userSchema=new mongoose.Schema(
  {
    Email:String,
    Password:String
  });

userSchema.plugin(encrypt,{secret: process.env.HASH_STRING,encryptedFields:['Password']})
const User=mongoose.model('user',userSchema);

app.route("/")
.get((req,res)=>{
  res.render("home");
});

app.route("/register")
.get((req,res)=>{
  res.render("register");
})
.post((req,res)=>
{
  const user=new User({
    Email:req.body.username,
    Password:req.body.password
  });
  user.save();
  res.render("login");
});

app.route("/login")
.get((req,res)=>{
  res.render("login");
})
.post((req,res)=>{
  User.findOne({Email:req.body.username},(err,found)=>
  {
      if(found.Password===req.body.password)
      {
        console.log("Welcome user.");
        res.render("secrets");
      }
      else if(err)
      {
        console.log("Error Occurred.");
        res.render("home");
      }
      else
      {
        console.log("You're not a user, register to become one.")
        res.render("register");
      }
  })
})

app.listen(3000,()=>{
  console.log("Server started at port 3000");
});
