// Edit this file to update every piece of content on the site.
// No build step needed — just save and refresh.

const profile = {
  name: "Yashwardhan Pareek",
  role: "Full-Stack MERN Developer",
  tagline: "I build web apps that don't fall over.",
  location: "Rajasthan, India",
  bio: `College student (2024–2028) building full-stack projects with the MERN stack.
  Most recently shipped ShopEase, a complete e-commerce platform with authentication,
  an admin dashboard, and live payments — the kind of project that forces you to learn
  the parts of web dev that don't show up in tutorials.`,
  goals: `Looking for a frontend or full-stack internship where I can work on production
  code, learn from people better than me, and keep shipping projects like ShopEase.`,
  email: "Yashpareek766@gmail.com",
  github: "https://github.com/yash001246",
  linkedin: "https://www.linkedin.com/in/yashwardhan-pareek",
  resumeUrl: "Resume.pdf",
};

const skills = [
  {
    category: "Frontend",
    color: "var(--blue)",
    items: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive UI"],
  },
  {
    category: "Backend",
    color: "var(--green)",
    items: ["Node.js", "Express", "REST APIs", "JWT"],
  },
  {
    category: "Database",
    color: "var(--orange)",
    items: ["MongoDB", "Mongoose"],
  },
  {
    category: "Payments & Tools",
    color: "var(--purple)",
    items: ["Razorpay", "Git & GitHub", "Postman", "VS Code"],
  },
];

// Fallback projects, used only if the API is unreachable or the DB is empty.
// GitHub/demo links below point at your profile as a placeholder — swap in the
// actual repo and live URLs for ShopEase once you have them handy.
const fallbackProjects = [
  {
    title: "ShopEase",
    description:
      "Built a live MERN e-commerce website with authentication, cart, wishlist, admin panel, and Razorpay payment integration. Designed a responsive UI for desktop and mobile users. 🚀",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Razorpay", "Responsive UI"],
    status: "Live",
    github: "https://github.com/yash001246",
    demo: "https://ecommerce-webpage-bnw7.onrender.com/",
  },
];

const experience = [
  {
    period: "2024 — 2028",
    title: "B.Tech, Computer Science",
    org: "Bhartiya institue of engineering and technology [BIET]",
    detail: "Coursework in data structures, DBMS, and web development, alongside self-taught full-stack projects like ShopEase.",
  },
];