/* ==========================================================================
   SkillBridge 2026 - Master Script (Course Mapper Integration)
   ========================================================================== */

const STORAGE_KEY = "SkillBridge_2026_Data";

const ROLE_KEYWORDS = {
    fullstack: ["html", "css", "javascript", "git", "github", "api", "sql", "react", "node", "database", "frontend", "backend"],
    ai_engineer: ["python", "machine learning", "sql", "git", "api", "pandas", "numpy", "deep learning", "neural", "tensorflow"],
    cybersecurity: ["networking", "linux", "python", "sql", "security", "vulnerability", "tcp/ip", "bash", "firewall", "encryption"]
};

const COURSE_MAPPING_DATA = {
    dbms: {
        academic: ["Basic SQL Queries (SELECT, INSERT)", "ER Diagrams & Normalization (1NF to 3NF)", "Relational Algebra"],
        industry: ["PostgreSQL & MySQL Optimization", "ORMs (Prisma, Sequelize, SQLAlchemy)", "Database Indexing & NoSQL (MongoDB/Redis)"],
        gapSolution: "Build a REST API backed by PostgreSQL/MySQL using an ORM like Prisma or SQLAlchemy."
    },
    oop: {
        academic: ["Classes & Objects", "Inheritance & Polymorphism", "Basic C++ / Java syntax"],
        industry: ["Design Patterns (Factory, Singleton, Observer)", "SOLID Architecture Principles", "Clean Code & Unit Testing"],
        gapSolution: "Refactor a monolithic script into a clean, modular OOP project applying SOLID principles."
    },
    dsa: {
        academic: ["Arrays, Linked Lists, Stacks, Queues", "Sorting Algorithms (Bubble, Merge, Quick)", "Tree Traversals"],
        industry: ["Time/Space Complexity Trade-offs (Big-O)", "Graph Algorithms & Hash Tables in Web Systems", "LeetCode-style Problem Solving"],
        gapSolution: "Implement a custom caching mechanism using Hash Maps and Doubly Linked Lists (LRU Cache)."
    },
    web: {
        academic: ["Static HTML Forms", "Basic CSS Styling", "Simple Client-side JavaScript"],
        industry: ["React.js / Next.js Component Architecture", "Async/Await REST API Integration", "State Management & Deployment"],
        gapSolution: "Build a Full-Stack React dashboard that fetches dynamic data from a backend REST API."
    }
};

// 1. Navigation Switcher
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.nav-btn');

    tabs.forEach(tab => {
        tab.classList.add('hidden-tab');
        tab.classList.remove('active-tab');
    });

    buttons.forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) {
        activeTab.classList.remove('hidden-tab');
        activeTab.classList.add('active-tab');
    }

    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (tabId === 'course-mapper') {
        mapCourseToIndustry();
    }
}

// 2. Main Assessment Setup
document.addEventListener("DOMContentLoaded", function () {
    console.log("SkillBridge Engine Loaded Successfully");

    const form = document.getElementById("assessment-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("student-name").value || "Student";
            const degree = document.getElementById("degree-program").value || "";
            const semester = document.getElementById("semester").value || "";
            const careerRadio = document.querySelector('input[name="careerPath"]:checked');
            const targetPath = careerRadio ? careerRadio.value : "fullstack";

            const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
                                         .map(cb => cb.value);

            const userProfile = { name, degree, semester, targetPath, selectedSkills };
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
            renderDashboardResults(userProfile);
        });
    }

    const resetBtn = document.getElementById("reset-data-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", function() {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        });
    }

    loadFromStorage();
});

function renderDashboardResults(profile) {
    const dashboard = document.getElementById("dashboard");
    const requiredSkills = ROLE_KEYWORDS[profile.targetPath] || ROLE_KEYWORDS.fullstack;

    const acquiredLower = profile.selectedSkills.map(s => s.toLowerCase());
    const matched = requiredSkills.filter(skill => acquiredLower.includes(skill));
    const missing = requiredSkills.filter(skill => !acquiredLower.includes(skill));

    const score = Math.round((matched.length / requiredSkills.length) * 100);

    document.getElementById("display-user-name").textContent = profile.name;
    document.getElementById("display-target-path").textContent = profile.targetPath.toUpperCase();
    document.getElementById("readiness-percentage").textContent = `${score}%`;
    document.getElementById("readiness-progress-fill").style.width = `${score}%`;

    renderTags("available-skills-list", profile.selectedSkills, "tag-available");
    renderTags("missing-skills-list", missing, "tag-missing");

    document.getElementById("count-available").textContent = profile.selectedSkills.length;
    document.getElementById("count-missing").textContent = missing.length;

    const statusBadge = document.getElementById("status-badge");
    if (score > 70) {
        statusBadge.textContent = "Industry Ready";
        statusBadge.className = "status-badge badge-ready";
    } else if (score >= 40) {
        statusBadge.textContent = "Intermediate";
        statusBadge.className = "status-badge badge-intermediate";
    } else {
        statusBadge.textContent = "Beginner";
        statusBadge.className = "status-badge badge-beginner";
    }

    const timeline = document.getElementById("roadmap-timeline-container");
    timeline.innerHTML = missing.map((skill, index) => `
        <div class="timeline-item">
            <div class="timeline-month">Month ${index + 1}</div>
            <div class="timeline-content">
                <h4>Master ${skill.toUpperCase()}</h4>
                <p>Focus on core theoretical foundations and build 1 practical project using ${skill}.</p>
            </div>
        </div>
    `).join("");

    dashboard.classList.remove("hidden");
    dashboard.scrollIntoView({ behavior: "smooth" });
}

function renderTags(elementId, items, className) {
    const container = document.getElementById(elementId);
    if (!container) return;
    if (items.length === 0) {
        container.innerHTML = "<li>None</li>";
        return;
    }
    container.innerHTML = items.map(i => `<li class="skill-tag-item ${className}">${i}</li>`).join("");
}

function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        if (data && data.name) {
            renderDashboardResults(data);
        }
    } catch (e) {
        console.error("Storage parse error", e);
    }
}

// 3. ATS CV Analyzer
function analyzeCV() {
    const cvText = document.getElementById("cv-text-input").value.toLowerCase();
    const targetRole = document.getElementById("cv-target-role").value;
    const requiredKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS.fullstack;

    if (!cvText.trim()) {
        alert("Please paste your CV/Resume text first!");
        return;
    }

    const found = [];
    const missing = [];

    requiredKeywords.forEach(kw => {
        if (cvText.includes(kw.toLowerCase())) {
            found.push(kw);
        } else {
            missing.push(kw);
        }
    });

    const atsScore = Math.round((found.length / requiredKeywords.length) * 100);

    document.getElementById("cv-ats-score").textContent = `${atsScore}%`;
    renderTags("cv-found-keywords", found, "tag-available");
    renderTags("cv-missing-keywords", missing, "tag-missing");

    const feedback = document.getElementById("cv-feedback-message");
    if (atsScore >= 70) {
        feedback.innerHTML = "<strong>Great CV Match!</strong> Your resume contains strong ATS keywords for this role.";
        feedback.style.background = "rgba(52, 211, 153, 0.15)";
    } else {
        feedback.innerHTML = `<strong>ATS Optimization Needed:</strong> Consider incorporating missing keywords like <em>${missing.slice(0, 3).join(", ")}</em> in your project descriptions.`;
        feedback.style.background = "rgba(248, 113, 113, 0.15)";
    }

    document.getElementById("cv-result-box").classList.remove("hidden");
}

// 4. Course-to-Industry Mapping Engine
function mapCourseToIndustry() {
    const selectedCourse = document.getElementById("course-subject-select").value;
    const data = COURSE_MAPPING_DATA[selectedCourse] || COURSE_MAPPING_DATA.dbms;
    const outputContainer = document.getElementById("course-mapper-output");

    outputContainer.innerHTML = `
        <div class="metric-card">
            <h4 style="color: #94a3b8;">📖 What University Teaches</h4>
            <ul style="padding-left: 18px; margin-top: 10px; font-size: 0.9rem; line-height: 1.6;">
                ${data.academic.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>

        <div class="metric-card">
            <h4 style="color: #3b82f6;">💼 What Industry Expects</h4>
            <ul style="padding-left: 18px; margin-top: 10px; font-size: 0.9rem; line-height: 1.6;">
                ${data.industry.map(item => `<li>${item}</li>`).join("")}
            </ul>
        </div>

        <div class="metric-card" style="grid-column: 1 / -1; background: rgba(139, 92, 246, 0.1); border-color: #8b5cf6;">
            <h4 style="color: #c084fc;">💡 Recommended Action Project</h4>
            <p style="margin-top: 8px; font-size: 0.95rem; color: #f8fafc;">${data.gapSolution}</p>
        </div>
    `;
}

// 5. Skill Verification Quiz
function gradeQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');

    if (!q1 || !q2) {
        alert("Please answer all quiz questions!");
        return;
    }

    let score = 0;
    if (q1.value === "correct") score += 50;
    if (q2.value === "correct") score += 50;

    const box = document.getElementById("quiz-score-box");
    box.classList.remove("hidden");

    if (score === 100) {
        box.innerHTML = `🎉 <strong>Score: 100% - Skill Verified!</strong> You earned the <em>Web Architecture Specialist</em> digital badge.`;
        box.style.background = "rgba(52, 211, 153, 0.15)";
    } else {
        box.innerHTML = `<strong>Score: ${score}%</strong> Review core API and Version Control concepts to attempt re-verification.`;
        box.style.background = "rgba(251, 191, 36, 0.15)";
    }
}