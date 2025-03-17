const express=require('express');
const mongoose=require('mongoose');
const { ObjectId } = require('mongodb');

const cors=require('cors');
const bodyParser=require('body-parser');
const multer=require('multer');
const OTP=require('./models/OTP')
// const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
// const expressValidator=require('express-validator');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Post = require("./models/Posts");
const slugify = require("slugify");
const jwt = require('jsonwebtoken');
const path = require("path");
const crypto=require('crypto')
const { verifyToken, isAdmin, isEditor } = require("./Middleware");
const nodemailer=require('nodemailer');
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//models import
const User=require('./models/Users');
const UserSuggestions=require('./models/UserSuggestion')
app.use(cors({
    credentials:true,
    origin:'https://article-webiste-frontend.onrender.com/'
}))
//Website02
//moingoose connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database Connection Error:", err));

  const bcryptSalt=bcrypt.genSaltSync(10);

//register and login routes
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };
  
  app.post("/api/register", async (req, res) => {
    try {
      const { name, email, password, role, avatar } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({ name, email, password: hashedPassword, role, avatar });
      await user.save();
      
      res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ token,user });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });
  const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
    console.log(token)
    const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token; // Extract token

    try {
      const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ msg: "Invalid token" });
    }
  };
  app.get("/api/user", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });

//posting and multer
const cloudinary=require('cloudinary').v2;
//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})
const {CloudinaryStorage}=require('multer-storage-cloudinary'); 
const { error } = require('console');
const Posts = require('./models/Posts');
const storage=new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
    folder:'news_articles',
    allowed_formats:['jpeg','png','jpg']
  },
});
const upload=multer({storage:storage});

app.post("/postArticle",auth, upload.single("coverImage"), async (req, res) => {
  try {

    const { title, content, excerpt, category, tags, published } = req.body;
    console.log('User',req.user)
    // Create new post object
    const post = new Post({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      content,
      excerpt,
      category,
      author: req.user.id, // From token middleware
      tags: tags ? tags.split(",") : [],
      published: published || false, // Default to false if not provided
    });

    // Check if an image was uploaded and store the Cloudinary URL
    if (req.file) {
      post.coverImage = req.file.path; // Cloudinary automatically provides a URL in req.file.path
    }

    // Save post to database
    await post.save();

    res.status(201).json({ success: true, message: "Article created successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});






  app.get("/getallarticles", async (req, res) => {
    try {
      const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get("/:slug", async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate("author", "name email");
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.put("/postArticle/:id", auth, upload.single("coverImage"), async (req, res) => {
    try {
      const { title, content, excerpt, category, tags, published } = req.body;
      console.log(req.params.id)
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // Upload new image if provided
      if (req.file) {
        post.coverImage = await req.file.path;
      }
  
      post.title = title || post.title;
      post.slug = slugify(title || post.title, { lower: true, strict: true });
      post.content = content || post.content;
      post.excerpt = excerpt || post.excerpt;
      post.category = category || post.category;
      post.tags = tags ? tags.split(",") : post.tags;
      post.published = published !== undefined ? published : post.published;
  
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.delete("/:id", auth, isAdmin, async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get("/getarticle/:id", async (req, res) => {
    try {
      const article = await Post.findById(req.params.id).populate("author", "_id name email").populate("comments.user", "name email");
      if (!article) return res.status(404).json({ message: "Article not found" });
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  app.post("/articles/:id/like", async (req, res) => {
    try {
      const article = await Post.findById(req.params.id);
      if (!article) return res.status(404).json({ message: "Article not found" });
      const userId = req.body.userId;
       // Get user ID from request
       
       const index = article.likes.findIndex(like => like._id.toString() === userId);
       if (index === -1) {
         // If user hasn't liked, add like
         article.likes.push({ _id: (userId) });
       } else {
     
         // If user already liked, remove their existing like
         article.likes.splice(index, 1);
       }
  
      await article.save();
      res.json({ success: true, likes: article.likes.length });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  app.post("/articles/:id/comment", async (req, res) => {
    try {
      const { userId, text } = req.body;
      console.log(req.body);
      const article = await Post.findById(req.params.id);
      
      if (!article) return res.status(404).json({ message: "Article not found" });
  
      const newComment = {
        user: userId,
        text,
        createdAt: new Date(),
      };

      const userDetail=await User.findById(userId);
      console.log(userDetail);
      article.comments.push(newComment);
      await article.save();
      const commentwithuser={
        comments:article.comments,
        user:userDetail.name
      }
      res.json({ success: true, commentwithuser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  // app.get("/getallarticles", async (req, res) => {
  //   try {
  //     const articles = await Post.find({ published: true })
  //       // Populating author details
  //        // Sorting by newest first
  //     console.log(articles);
  //     res.status(200).json({ success: true, articles });
  //   } catch (error) {
  //     res.status(500).json({ success: false, message: "Server Error", error });
  //   }
  // });
  app.get('/api/articles/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const articles = await Posts.find({ author: userId });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles', error });
    }
})
  app.get("/getarticles/category", async (req, res) => {
    try {
      const { category } = req.query;
      console.log("Received category:", category);
  
      if (!category) {
        return res.status(400).json({ error: "Category not provided" });
      }
  
      const articles = await Posts.find({ category });
  
      if (articles.length === 0) {
        return res.status(404).json({ error: "Articles not found" });
      }
  
      res.json({ articles });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  });
  app.post('/usersuggestion',async (req,res)=>{
    try{
      const message = req.body;
      if (!message) return res.status(404).json({ message: "message not found" });
      const userId = req.body.userId;
      const published_message=new UserSuggestions({user:userId,text:message});
      await UserSuggestions.save();
      res.status(200).json(published_message);

    }catch(e){
      res.status(500).json(e);
    }
  })

  app.delete("/articles/:id",auth, async (req, res) => {
    try {
      const deletedItem = await Posts.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
      res.status(500).json({ message: "Error deleting item", error });
    }
  });


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'harshit14922@gmail.com',
      pass: 'Harshit1408@',
    },
  });
  app.post("/send-otp", async (req, res) => {
    const { email } = req.body;
  
    if (!email) return res.status(400).json({ message: "Email is required" });
  
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
  
    // Store OTP in DB
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await OTP.create({ email, otp, expiresAt });
  
    // Send OTP via email
    const mailOptions = {
      from: "harshit14922@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };
  
    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).json({ message: error });
      res.status(200).json({ message: "OTP sent successfully" });
    });
  });
  
  // Verify OTP
  app.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
  
    const otpRecord = await OTP.findOne({ email, otp });
  
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
  
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
  
    await OTP.deleteOne({ email });
  
    res.status(200).json({ message: "OTP verified successfully" });
  });
  
  app.listen(process.env.PORT||5000,  () => console.log('Server running...'));

//multer
  // const storage = multer.memoryStorage();
  // const upload = multer({ storage });
  
  // // Cloudinary configuration
  // cloudinary.config({
  //   cloud_name: process.env.CLOUD_NAME,
  //   api_key: process.env.CLOUD_API_KEY,
  //   api_secret: process.env.CLOUD_API_S,
  // });
  // const uploadImage = async (file) => {
  //   try {
  //     const result = await cloudinary.uploader.upload(file, {
  //       folder: "news_articles",
  //       use_filename: true,
  //       unique_filename: false,
  //     });
  //     return result.secure_url;
  //   } catch (error) {
  //     throw new Error("Image upload failed");
  //   }
  // };
  // app.post("/postArticle", auth, isEditor, upload.single("coverImage"), async (req, res) => {
  //   try {
  //     const { title, content, excerpt, category, tags, published } = req.body;
  
  //     // Upload Image to Cloudinary
  //     const imageUrl = req.file ? await uploadImage(req.file.path) : null;
  
  //     const post = new Post({
  //       title,
  //       slug: slugify(title, { lower: true, strict: true }),
  //       content,
  //       excerpt,
  //       category,
  //       tags: tags ? tags.split(",") : [],
  //       author: req.user.id, // From token middleware
  //       coverImage: imageUrl,
  //       published,
  //     });
  
  //     await post.save();
  //     res.status(201).json(post);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // });
  
