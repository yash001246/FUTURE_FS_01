// ===========================================================
// Portfolio front-end logic — vanilla JS, no framework.
// Reads static content from data.js, dynamic content (projects,
// blog posts) from the backend API, and submits the contact form.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  renderStaticContent();
  initNavbar();
  runTerminalAnimation();
  loadProjects();
  loadBlogPosts();
  initContactForm();
});

// ---------- Static content (from data.js) ----------

function renderStaticContent() {
  document.getElementById("brandName").textContent = profile.name.split(" ")[0].toLowerCase();
  document.getElementById("footerName").textContent = `© ${new Date().getFullYear()} ${profile.name}`;

  document.getElementById("heroTitle").textContent = profile.tagline;
  document.getElementById("heroDesc").textContent =
    `I'm ${profile.name}, a ${profile.role.toLowerCase()} based in ${profile.location}. ` +
    `I turn specs into working software — frontend, backend, and the database underneath it.`;

  // About
  const aboutText = document.getElementById("aboutText");
  const bioP = document.createElement("p");
  bioP.textContent = profile.bio.replace(/\s+/g, " ").trim();
  const goalsP = document.createElement("p");
  goalsP.textContent = profile.goals.replace(/\s+/g, " ").trim();
  aboutText.prepend(goalsP);
  aboutText.prepend(bioP);
  document.getElementById("resumeLink").href = profile.resumeUrl;

  // Timeline
  const timeline = document.getElementById("timeline");
  experience.forEach((e) => {
    const item = document.createElement("div");
    item.className = "timeline__item";
    item.innerHTML = `
      <div class="timeline__marker"></div>
      <div>
        <div class="timeline__period mono">${escapeHtml(e.period)}</div>
        <h3 class="timeline__title">${escapeHtml(e.title)}</h3>
        <div class="timeline__org mono">${escapeHtml(e.org)}</div>
        <p class="timeline__detail">${escapeHtml(e.detail)}</p>
      </div>
    `;
    timeline.appendChild(item);
  });

  // Skills
  const skillsGrid = document.getElementById("skillsGrid");
  skills.forEach((group) => {
    const card = document.createElement("div");
    card.className = "skill-card";
    card.innerHTML = `
      <div class="skill-card__head">
        <span class="skill-card__dot" style="background:${group.color}; color:${group.color}"></span>
        <h3 class="skill-card__title">${escapeHtml(group.category)}</h3>
      </div>
      <div class="skill-card__items">
        ${group.items.map((i) => `<span class="tag">${escapeHtml(i)}</span>`).join("")}
      </div>
    `;
    skillsGrid.appendChild(card);
  });

  // Contact info
  const contactInfo = document.getElementById("contactInfo");
  contactInfo.innerHTML = `
    <a href="mailto:${profile.email}" class="contact__row">
      <span class="contact__label mono">email</span>
      <span class="contact__value">${escapeHtml(profile.email)}</span>
    </a>
    <a href="${profile.github}" target="_blank" rel="noreferrer" class="contact__row">
      <span class="contact__label mono">github</span>
      <span class="contact__value">${escapeHtml(profile.github.replace("https://", ""))}</span>
    </a>
    <a href="${profile.linkedin}" target="_blank" rel="noreferrer" class="contact__row">
      <span class="contact__label mono">linkedin</span>
      <span class="contact__value">${escapeHtml(profile.linkedin.replace("https://", ""))}</span>
    </a>
    <div class="contact__row static">
      <span class="contact__label mono">location</span>
      <span class="contact__value">${escapeHtml(profile.location)}</span>
    </div>
  `;
}

// ---------- Navbar ----------

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  });

  toggle.addEventListener("click", () => {
    const isOpen = mobile.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobile.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Hero terminal typing animation ----------

function runTerminalAnimation() {
  const body = document.getElementById("terminalBody");
  const lines = [
    { cmd: "whoami", out: profile.name },
    { cmd: "cat role.txt", out: profile.role },
    { cmd: "echo $STATUS", out: "open to internships & freelance work" },
  ];

  let lineIdx = 0;

  function typeLine() {
    if (lineIdx >= lines.length) {
      const cursorBlock = document.createElement("div");
      cursorBlock.className = "terminal__block";
      cursorBlock.innerHTML = `<span class="terminal__prompt">$</span><span class="terminal__cursor"></span>`;
      body.appendChild(cursorBlock);
      return;
    }

    const { cmd, out } = lines[lineIdx];
    const block = document.createElement("div");
    block.className = "terminal__block";
    const cmdLine = document.createElement("div");
    cmdLine.innerHTML = `<span class="terminal__prompt">$</span><span class="typed-cmd"></span><span class="terminal__cursor"></span>`;
    block.appendChild(cmdLine);
    body.appendChild(block);

    const typedSpan = cmdLine.querySelector(".typed-cmd");
    const cursor = cmdLine.querySelector(".terminal__cursor");
    let charIdx = 0;

    const typeChar = setInterval(() => {
      typedSpan.textContent = cmd.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx >= cmd.length) {
        clearInterval(typeChar);
        setTimeout(() => {
          const outLine = document.createElement("div");
          outLine.className = "terminal__out";
          outLine.textContent = out;
          cursor.remove();
          block.appendChild(outLine);
          lineIdx++;
          setTimeout(typeLine, 350);
        }, 250);
      }
    }, 45);
  }

  typeLine();
}

// ---------- Projects (fetched from API, falls back to static data) ----------

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");

  let projects = [];
  try {
    const res = await fetch(`${API_URL}/api/projects`);
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    projects = data.length ? data : fallbackProjects;
  } catch {
    // Backend not running or DB empty — show the fallback list so the page
    // still looks complete during local preview.
    projects = fallbackProjects;
  }

  grid.innerHTML = "";
  projects.forEach((p) => grid.appendChild(renderProjectCard(p)));
}

function renderProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  const statusClass = "status--" + project.status.toLowerCase().replace(/\s+/g, "");
  const slug = project.title.toLowerCase().replace(/\s+/g, "-");

  card.innerHTML = `
    <div class="project-card__top">
      <div class="project-card__filebar mono"><span class="project-card__dotIcon">●</span> ${escapeHtml(slug)}.repo</div>
      <span class="status ${statusClass}">${escapeHtml(project.status)}</span>
    </div>
    <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
    <p class="project-card__desc">${escapeHtml(project.description)}</p>
    <div class="project-card__stack">${(project.stack || []).map((s) => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</div>
    <div class="project-card__links">
      ${project.github ? `<a href="${project.github}" target="_blank" rel="noreferrer" class="project-card__link mono">↗ code</a>` : ""}
      ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noreferrer" class="project-card__link mono">↗ live demo</a>` : ""}
    </div>
  `;
  return card;
}

// ---------- Blog (fetched from API) ----------

async function loadBlogPosts() {
  const grid = document.getElementById("blogGrid");

  try {
    const res = await fetch(`${API_URL}/api/blog`);
    if (!res.ok) throw new Error("bad response");
    const posts = await res.json();

    if (!posts.length) {
      grid.innerHTML = `<p class="blog__empty mono"># no posts yet — check back soon</p>`;
      return;
    }

    grid.innerHTML = "";
    posts.forEach((post) => grid.appendChild(renderBlogCard(post)));
  } catch {
    grid.innerHTML = `<p class="blog__empty mono"># couldn't reach the blog API — is the server running?</p>`;
  }
}

function renderBlogCard(post) {
  const card = document.createElement("div");
  card.className = "blog-card";
  const date = new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  card.innerHTML = `
    <div class="blog-card__date mono">${escapeHtml(date)}</div>
    <h3 class="blog-card__title">${escapeHtml(post.title)}</h3>
    <p class="blog-card__excerpt">${escapeHtml(post.excerpt || (post.content || "").slice(0, 120) + "…")}</p>
    <div class="blog-card__tags">${(post.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
  `;
  return card;
}

// ---------- Contact form ----------

function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmit");
  const statusEl = document.getElementById("contactStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "contact-form__status";
    submitBtn.disabled = true;
    submitBtn.textContent = "sending...";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");

      statusEl.textContent = "✓ Message sent — I'll get back to you soon.";
      statusEl.className = "contact-form__status contact-form__status--ok";
      form.reset();
    } catch (err) {
      statusEl.textContent = `✗ ${err.message || "Couldn't reach the server. Try again in a moment."}`;
      statusEl.className = "contact-form__status contact-form__status--err";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "send message →";
    }
  });
}

// ---------- Utility ----------

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}