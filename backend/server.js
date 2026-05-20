require('dotenv').config()
const cron = require('node-cron');

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const app = express()

app.use(cors())
app.use(express.json())

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// ================= DB =================
mongoose.connect('mongodb://127.0.0.1:27017/scholarshipDB')
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err))

// ================= MODELS =================

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String
})
const User = mongoose.model('User', userSchema)

const profileSchema = new mongoose.Schema({
  fullName: String,
  age: Number,
  gender: String,
  level: String,
  grade: Number,
  income: Number,
  category: String,
  region: String,
  field: String,
  course: String,
  college: String,
  interests: String,
  status: String,
  matchedScholarships: Array,
  reasons: [String],
  createdAt: { type: Date, default: Date.now }
})
const Profile = mongoose.model('Profile', profileSchema)

const notifySchema = new mongoose.Schema({
  email: String,
  scholarshipName: String,
  deadline: String,
  createdAt: { type: Date, default: Date.now }
})
const Notification = mongoose.model('Notification', notifySchema)

const scholarshipSchema = new mongoose.Schema({
  fullName: String,
  gender: String,
  minAge: Number,
  maxAge: Number,
  level: String,
  minGrade: Number,
  region: String,
  field: String,
  category: String,
  maxIncome: Number,
  course: String,
  college: String,
  interests: String,
  deadline: String,
  applyLink: String
})
const Scholarship = mongoose.model('Scholarship', scholarshipSchema)

// ================= ROUTES =================

// REGISTER
app.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body
  const hashed = await bcrypt.hash(password, 10)

  const user = new User({ name, email, mobile, password: hashed })
  await user.save()

  res.send("Registered successfully")
})

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.send("User not found")

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.send("Wrong password")

  res.send("Login successful")
})

//contact
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "pallikavyasri1111@gmail.com", // your receiving email
      subject: "New Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.send("Message sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});


// ADD SCHOLARSHIP
app.post('/add-scholarship', async (req, res) => {
  const exists = await Scholarship.findOne({ fullName: req.body.fullName })
  if (exists) return res.send("Already exists")

  const scholarship = new Scholarship(req.body)
  await scholarship.save()

  res.send("Scholarship added")
})

// ================= NOTIFY + EMAIL =================
app.post('/notify', async (req, res) => {
  try {
    const { email, scholarshipName, deadline } = req.body

    const data = new Notification(req.body)
    await data.save()

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Scholarship Reminder',
      text: `You requested notification for:

${scholarshipName}

Deadline: ${deadline}

Apply before deadline!`
    })

    res.send("Notification saved & email sent")

  } catch (err) {
    console.log(err)
    res.status(500).send("Error sending email")
  }
})

// GET NOTIFICATIONS
app.get('/notifications', async (req, res) => {
  const today = new Date()
  const data = await Notification.find()

  const upcoming = data.filter(n => new Date(n.deadline) >= today)

  res.json(upcoming)
})



// ================= GET SCHOLARSHIPS =================
app.get('/scholarships', async (req, res) => {
  try {
    const data = await Scholarship.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching scholarships");
  }
});
/*
//browser
app.get("/scholarships", async (req, res) => {
  try {
    const data = await db.collection("scholarships").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

// ================= ELIGIBILITY =================
app.post('/check-eligibility', async (req, res) => {
  try {
    const user = req.body
    const scholarships = await Scholarship.find()

    let matched = []
    let failedList = []

    scholarships.forEach(s => {
      let failReasons = []

      if (user.grade < s.minGrade) failReasons.push("CGPA/% too low")
      if (user.income > s.maxIncome) failReasons.push("Income too high")
      if (s.category !== "Any" && user.category !== s.category) failReasons.push("Category mismatch")
      if (user.level !== s.level) failReasons.push("Education level mismatch")
      if (!(s.gender === "Any" || s.gender === user.gender)) failReasons.push("Gender not eligible")
      if (user.age < s.minAge || user.age > s.maxAge) failReasons.push("Age not eligible")
      if (s.region && s.region !== "Any" && user.region !== s.region) failReasons.push("Region mismatch")
      if (s.field && s.field !== "Any" && user.field !== s.field) failReasons.push("Field mismatch")
      if (s.course && s.course !== "Any" && user.course !== s.course) failReasons.push("Course mismatch")
      if (s.college && s.college !== "Any" && user.college !== s.college) failReasons.push("College mismatch")
      if (s.interests && s.interests !== "Any" && !user.interests.includes(s.interests)) failReasons.push("Interest mismatch")

      if (failReasons.length === 0) {
        matched.push({
          fullName: s.fullName,
          link: s.applyLink,
          deadline: s.deadline
        })
      } else {
        failedList.push({
          fullName: s.fullName,
          reasons: failReasons,
          score: failReasons.length
        })
      }
    })

    failedList.sort((a, b) => a.score - b.score)

    const finalMatched = matched.slice(0, 3)
    const finalReasons = failedList.slice(0, 5).map(f =>
      `${f.fullName}: ${f.reasons.join(", ")}`
    )

    const status = finalMatched.length > 0 ? "Eligible" : "Not Eligible"

    const profile = new Profile({
      ...user,
      status,
      matchedScholarships: finalMatched,
      reasons: finalReasons
    })

    await profile.save()

    res.json({
      status,
      matched: finalMatched,
      reasons: finalReasons
    })

  } catch (err) {
  console.error(err)
  res.status(500).json({ error: "Error checking eligibility" })
}

})
console.log("Server file loaded");
cron.schedule('* * * * *', async () => {
  console.log("Cron is running...");  // 👈 add this

  const today = new Date();
  console.log("Current time:", today);

  const notifications = await Notification.find();
  console.log("Notifications found:", notifications.length);

  for (let n of notifications) {
    const deadline = new Date(n.deadline);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log("Checking:", n.email, "Days left:", diffDays);

    if (diffDays === 2) {
      console.log("Sending email to:", n.email);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: n.email,
        subject: '⏰ Deadline Reminder',
        text: `Reminder: ${n.scholarshipName} deadline is in 2 days!`
      });
    }
  }
});
app.listen(5000, () => console.log("Server running on 5000"))
