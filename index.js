const express = require('express');
const server = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const cors = require('cors');
const multer = require('multer');
 const storage = multer.diskStorage({
    destination : function (req,file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
});
const upload = multer({storage: storage});
mongoose.connect('mongodb://localhost:27017/photogram', {useNewUrlParser: true});
server.use('/uploads',express.static('uploads'));
server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json());
server.use(express.static('build'));
const Schema = mongoose.Schema;
const imageSchema = new Schema({
    title:  {type:String,required:true},
    subtitle:  {type:String,required:true},
    description:  {type:String,required:true},
    image: String,
    user:{type:String,required:true}
  });
  const Image= mongoose.model('Image',imageSchema);
server.post("/add",function(req,res){
     const image = new Image();
     image.title= req.body.title;
     image.description = req.body.description;
     image.subtitle = req.body.subtitle;
     image.image = req.body.image;
     image.user = req.body.user;
     image.save();
     res.json(image);
})  
server.get("/read/:user",function(req,res){
    Image.find({user:req.params.user},function(err,docs){
        res.json(docs);
    })
})
server.post('/addImage',upload.single('file'),function(req,res){
    res.json(req.file.path);

 })
 server.delete('/delete/:id',function(req,res){
     Image.findByIdAndDelete({_id:req.params.id},function(err,docs){
         res.json(docs);
     })
 })
  server.listen(process.env.PORT || 8080,function(){
      console.log("Server Started");
  })