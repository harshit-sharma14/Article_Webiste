const express=require('express');
const mongoose=require('mongoose');
const { ObjectId } = require('mongodb');
const transliterate = require('transliteration').transliterate; // Install first

const cors=require('cors');
const bodyParser=require('body-parser');
const multer=require('multer');
const OTP=require('./models/OTP')
import { fileURLToPath } from "url";
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
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "build", "index.html"));
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//models import
const User=require('./models/Users');
const UserSuggestions=require('./models/UserSuggestion')



app.use(cors({
    credentials:true,
    // origin:'https://article-webiste-frontend.onrender.com'
    origin:'https://www.satyasaarthi.com'
    // origin:'http://localhost:5173'
}))
//Website02
//moingoose connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database Connection Error:", err));

  const bcryptSalt=bcrypt.genSaltSync(10);

//register and login routes


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
app.post('/setProfileImage',auth,upload.single("coverImage"),async (req,res)=>{
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get the authenticated user's ID from the request
    const userId = req.user.id;

    // Construct the file path or URL
    const filePath = req.file.path; // Local file path
    // If using cloud storage (e.g., AWS S3), you would upload the file here and get the URL

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: filePath }, // Save the file path or URL to the user's profile
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send success response
    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error" });
  }

})
app.post("/postArticle",auth, upload.single("coverImage"), async (req, res) => {
  try {

    const { title, content, excerpt, category, tags, published } = req.body;
    console.log('User',req.body.title)
    
    const transliteratedTitle = transliterate(title); // "पर्यावरण" → "Paryavaran"
    let slugBase = slugify(transliteratedTitle, { lower: true, strict: true }) || "untitled";
    let slug = slugBase;
    while (await Post.findOne({ slug })) {
      slug = `${slugBase}-${counter}`;
      counter++;
    }
    // Create new post object
    const post = new Post({
      title,
      slug,
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
  app.get("/getarticle/:slug", async (req, res) => {
    try {
      console.log(req.params.slug)
      const article = await Post.findOne({ slug: req.params.slug }).populate("author", "_id name email").populate("comments.user", "name email");
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
  const sendOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

  
// let otpStore = {}; 
// app.post('/api/register/send-otp', async (req, res) => {
//   const { email } = req.body;

//   // Check if email already exists
//   let user = await User.findOne({ email });
//   if (user) return res.status(400).json({ message: 'User already exists' });

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

//   await sendOtp(email, otp);
//   res.json({ message: 'OTP sent to email' });
// });

// // Register - Step 2: Verify OTP and Create Account
// app.post('/register/verify-otp', async (req, res) => {
//   const { name, email, password, role, avatar,otp } = req.body;

//   // Check if OTP is valid
//   if (!otpStore[email] || otpStore[email].otp !== parseInt(otp) || otpStore[email].expires < Date.now()) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//   }

//   // Remove OTP after use
//   delete otpStore[email];

//   // Hash password and save user
  

//       let user = await User.findOne({ email });
//       if (user) return res.status(400).json({ msg: "User already exists" });
      
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
      
//       user = new User({ name, email, password: hashedPassword, role, avatar });
//       await user.save();
      
//       res.status(201).json({ msg: "User registered successfully" });
// });
// app.post("/api/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });
//       if (!user) return res.status(400).json({ msg: "Invalid credentials" });
      
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      
//       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
//       res.json({ token,user });
//     } catch (err) {
//       res.status(500).json({ msg: "Server error" });
//     }
//   });
  // Verify OTP
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
  
