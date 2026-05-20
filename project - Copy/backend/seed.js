const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/scholarshipDB')
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

const scholarshipSchema = new mongoose.Schema({
  fullName: String,
  gender: String,
  age: Number,
  level: String,
  grade: Number,
  region: String,
  field: String,
  category: String,
  income: Number,
  course: String,
  college: String,
  interests: String,
  deadline: String,
  applyLink: String
});

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

async function seedScholarships() {
  const scholarships = [
    { fullName: "National Merit Scholarship", gender: "Any", age: 20, level: "UG", grade: 70, region: "Any", field: "Science", category: "General", income: 500000, course: "Any", college: "Any", interests: "Any", deadline: "2026-07-15", applyLink: "https://scholarships.gov.in" },
    { fullName: "Sports Excellence Scholarship", gender: "Any", age: 19, level: "UG", grade: 60, region: "Any", field: "Any", category: "Any", income: 800000, course: "Any", college: "Any", interests: "Sports", deadline: "2026-08-01", applyLink: "https://sportsscholarship.ongc.co.in" },
    { fullName: "Girls in STEM Scholarship", gender: "Female", age: 20, level: "UG", grade: 70, region: "Any", field: "Science", category: "Women", income: 600000, course: "Any", college: "Any", interests: "Any", deadline: "2026-09-10", applyLink: "https://vigyanjyoti.dst.gov.in" },
    { fullName: "SC/ST Empowerment Scholarship", gender: "Any", age: 21, level: "UG", grade: 65, region: "Any", field: "Any", category: "SC/ST", income: 400000, course: "Any", college: "Any", interests: "Any", deadline: "2026-06-30", applyLink: "https://scholarships.gov.in" },
    { fullName: "Postgraduate Research Fellowship", gender: "Any", age: 25, level: "PG", grade: 75, region: "Any", field: "Research", category: "Any", income: 700000, course: "Any", college: "Any", interests: "Any", deadline: "2026-10-15", applyLink: "https://icmr.nic.in/content/fellowships" },
    { fullName: "Engineering Excellence Award", gender: "Any", age: 22, level: "UG", grade: 80, region: "Any", field: "Engineering", category: "Any", income: 600000, course: "Any", college: "Any", interests: "Any", deadline: "2026-07-01", applyLink: "https://aicte-india.org/scholarships" },
    { fullName: "Medical Studies Scholarship", gender: "Any", age: 23, level: "UG", grade: 75, region: "Any", field: "Medicine", category: "Any", income: 700000, course: "Any", college: "Any", interests: "Any", deadline: "2026-08-15", applyLink: "https://www.nhp.gov.in/scholarships" },
    { fullName: "Arts & Culture Grant", gender: "Any", age: 19, level: "UG", grade: 60, region: "Any", field: "Arts", category: "Any", income: 500000, course: "Any", college: "Any", interests: "Any", deadline: "2026-09-01", applyLink: "https://sahitya-akademi.gov.in/scholarships" },
    { fullName: "Women Leadership Scholarship", gender: "Female", age: 26, level: "PG", grade: 70, region: "Any", field: "Management", category: "Women", income: 600000, course: "Any", college: "Any", interests: "Leadership", deadline: "2026-11-01", applyLink: "https://www.britishcouncil.in/study-uk/scholarships/women-in-stem" },
    { fullName: "Science Olympiad Scholarship", gender: "Any", age: 18, level: "UG", grade: 85, region: "Any", field: "Science", category: "Any", income: 700000, course: "Any", college: "Any", interests: "Olympiad", deadline: "2026-07-25", applyLink: "https://sofworld.org/scholarships" },
    { fullName: "Commerce Achievers Award", gender: "Any", age: 20, level: "UG", grade: 75, region: "Any", field: "Commerce", category: "Any", income: 600000, course: "Any", college: "Any", interests: "Any", deadline: "2026-08-05", applyLink: "https://www.icai.org/post/scholarships" },
    { fullName: "Law Scholars Program", gender: "Any", age: 27, level: "PG", grade: 80, region: "Any", field: "Law", category: "Any", income: 700000, course: "Any", college: "Any", interests: "Any", deadline: "2026-09-20", applyLink: "https://nludelhi.ac.in/scholarships" },
    { fullName: "Creative Writing Fellowship", gender: "Any", age: 19, level: "UG", grade: 65, region: "Any", field: "Literature", category: "Any", income: 500000, course: "Any", college: "Any", interests: "Writing", deadline: "2026-10-01", applyLink: "https://sahitya-akademi.gov.in/scholarships" },
    { fullName: "Tech Innovators Grant", gender: "Any", age: 28, level: "PG", grade: 85, region: "Any", field: "Technology", category: "Any", income: 800000, course: "Any", college: "Any", interests: "Innovation", deadline: "2026-11-15", applyLink: "https://www.startupindia.gov.in" },
    { fullName: "Minority Student Scholarship", gender: "Any", age: 21, level: "UG", grade: 70, region: "Any", field: "Any", category: "Minority", income: 400000, course: "Any", college: "Any", interests: "Any", deadline: "2026-11-15", applyLink: "https://scholarships.gov.in" },
    { fullName: "International Exchange Grant", gender: "Any", age: 24, level: "PG", grade: 75, region: "Any", field: "Any", category: "Any", income: 900000, course: "Any", college: "Any", interests: "Exchange", deadline: "2026-12-01", applyLink: "https://www.fulbright.org.in" },
    { fullName: "Vocational Training Support", gender: "Any", age: 18, level: "Diploma", grade: 60, region: "Any", field: "Vocational", category: "Any", income: 400000, course: "Any", college: "Any", interests: "Any", deadline: "2026-06-25", applyLink: "https://nsdcindia.org/scholarships" },
    { fullName: "Environmental Studies Scholarship", gender: "Any", age: 22, level: "UG", grade: 70, region: "Any", field: "Environmental Science", category: "Any", income: 600000, course: "Any", college: "Any", interests: "Environment", deadline: "2026-07-30", applyLink: "https://www.cseindia.org/scholarships" },
    { fullName: "Entrepreneurship Development Grant", gender: "Any", age: 27, level: "PG", grade: 75, region: "Any", field: "Business", category: "Any", income: 800000, course: "Any", college: "Any", interests: "Startups", deadline: "2026-11-20", applyLink: "https://www.startupindia.gov.in" },
    { fullName: "Innovation in Agriculture Grant", gender: "Any", age: 22, level: "UG", grade: 65, region: "Any", field: "Agriculture", category: "Any", income: 500000, course: "Any", college: "Any", interests: "Farming", deadline: "2026-08-20", applyLink: "https://icar.org.in/scholarships" },
    { fullName: "Digital Skills Scholarship", gender: "Any", age: 19, level: "UG", grade: 70, region: "Any", field: "Computer Science", category: "Any", income: 600000, course: "Any", college: "Any", interests: "Coding", deadline: "2026-09-05", applyLink: "https://www.nasscomfoundation.org/scholarships" },
    { fullName: "Teacher Training Fellowship", gender: "Any", age: 28, level: "PG", grade: 70, region: "Any", field: "Education", category: "Any", income: 500000, course: "Any", college: "Any", interests: "Teaching", deadline: "2026-10-10", applyLink: "https://www.teachforindia.org/fellowship" }
  ];

  await Scholarship.insertMany(scholarships);
  console.log("✅ 20 scholarships inserted successfully");
  mongoose.connection.close();
}

seedScholarships();
