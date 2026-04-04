
const STORAGE_KEY = "jobportal_jobs";

const initialJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    description:
      "Looking for an experienced React developer to lead frontend architecture and build amazing user experiences.",
    postedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $110k",
    description:
      "Join our design team to create intuitive and beautiful interfaces for web and mobile applications.",
    postedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Backend Engineer (Node.js)",
    company: "ScaleUp Inc",
    location: "San Francisco, CA",
    type: "Remote",
    salary: "$130k - $160k",
    description:
      "Build scalable APIs and microservices using Node.js and cloud technologies.",
    postedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$110k - $140k",
    description:
      "Lead product development from ideation to launch, working with cross-functional teams.",
    postedAt: new Date().toISOString(),
  },
];

// LOCALSTORAGE UTILS 
function loadJobsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJobs));
    return [...initialJobs];
  }
  return JSON.parse(stored);
}

function saveJobsToStorage(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

// Global jobs array
let jobsData = loadJobsFromStorage();

// DOM ELEMENTS & STATE
let currentPage = "home";
let currentAlert = null;

// HELPER FUNCTIONS
function showAlert(message, type = "success") {
  const container = document.getElementById("pageContainer");
  if (currentAlert) currentAlert.remove();
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-triangle"}"></i> ${message}`;
  container.insertBefore(alertDiv, container.firstChild);
  currentAlert = alertDiv;
  setTimeout(() => {
    if (alertDiv) alertDiv.remove();
    if (currentAlert === alertDiv) currentAlert = null;
  }, 3000);
}

function updateActiveNav(pageId) {
  document
    .querySelectorAll(".nav-links a, .footer-col a[data-page]")
    .forEach((link) => {
      if (link.getAttribute("data-page") === pageId) {
        link.classList.add("active");
      } else if (link.classList) {
        link.classList.remove("active");
      }
    });
}

// PAGE RENDERS 
function renderHomePage() {
  const stats = {
    total: jobsData.length,
    fulltime: jobsData.filter((j) => j.type === "Full-time").length,
    remote: jobsData.filter((j) => j.location.toLowerCase().includes("remote"))
      .length,
    recent: jobsData.filter(
      (j) =>
        new Date(j.postedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
  };

  const recentJobs = [...jobsData]
    .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    .slice(0, 3);

  return `
        <div class="page-transition">
            <div class="hero" style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Find Your Dream Job</h1>
                <p style="color: var(--gray-600); max-width: 600px; margin: 0 auto;">Discover thousands of opportunities from top companies</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-number">${stats.total}</div><div class="stat-label">Total Jobs</div></div>
                <div class="stat-card"><div class="stat-number">${stats.fulltime}</div><div class="stat-label">Full-time Roles</div></div>
                <div class="stat-card"><div class="stat-number">${stats.remote}</div><div class="stat-label">Remote Jobs</div></div>
                <div class="stat-card"><div class="stat-number">${stats.recent}</div><div class="stat-label">New This Week</div></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0 1rem;">
                <h2>Latest Opportunities</h2>
                <button class="btn btn-outline" onclick="navigateTo('jobs')">View All Jobs <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="job-grid">
                ${recentJobs.map((job) => renderJobCard(job)).join("")}
                ${recentJobs.length === 0 ? '<div class="empty-state"><i class="fas fa-briefcase"></i><p>No jobs posted yet. Be the first to post!</p></div>' : ""}
            </div>
        </div>
    `;
}

function renderJobCard(job) {
  return `
        <div class="job-card">
            <div class="job-header">
                <div>
                    <div class="job-title">${escapeHtml(job.title)}</div>
                    <div class="job-company"><i class="fas fa-building"></i> ${escapeHtml(job.company)}</div>
                </div>
                <span class="salary-badge">${escapeHtml(job.salary)}</span>
            </div>
            <div class="job-details">
                <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                <span><i class="fas fa-clock"></i> ${escapeHtml(job.type)}</span>
            </div>
            <div class="job-description">${escapeHtml(job.description.substring(0, 120))}...</div>
            <div class="job-footer">
                <small><i class="far fa-calendar-alt"></i> Posted: ${new Date(job.postedAt).toLocaleDateString()}</small>
                <button class="btn btn-primary" onclick="alert('Apply functionality would integrate with backend.')">Apply Now</button>
            </div>
        </div>
    `;
}

function renderJobsPage() {
  return `
        <div class="page-transition">
            <h2 style="margin-bottom: 1rem;">Browse All Jobs</h2>
            <div class="search-section">
                <input type="text" id="searchInput" class="search-input" placeholder="Search by title, company...">
                <select id="typeFilter" class="filter-select">
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                </select>
                <button id="resetFiltersBtn" class="btn btn-outline">Reset</button>
            </div>
            <div id="jobsListContainer" class="job-grid"></div>
        </div>
    `;
}

function renderPostJobPage() {
  return `
        <div class="page-transition">
            <div class="card" style="max-width: 700px; margin: 0 auto; padding: 2rem;">
                <h2 style="margin-bottom: 1.5rem;">Post a New Job</h2>
                <form id="postJobForm">
                    <div class="form-group"><label>Job Title *</label><input type="text" id="jobTitle" required></div>
                    <div class="form-group"><label>Company Name *</label><input type="text" id="companyName" required></div>
                    <div class="form-group"><label>Location *</label><input type="text" id="location" placeholder="e.g., Remote, New York, NY" required></div>
                    <div class="form-group"><label>Job Type *</label><select id="jobType"><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option></select></div>
                    <div class="form-group"><label>Salary Range *</label><input type="text" id="salary" placeholder="e.g., $80k - $100k" required></div>
                    <div class="form-group"><label>Description *</label><textarea id="description" rows="4" placeholder="Job description, requirements..." required></textarea></div>
                    <button type="submit" class="btn btn-primary">Publish Job <i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    `;
}

function renderDashboardPage() {
  const myJobs = jobsData;
  return `
        <div class="page-transition">
            <h2 style="margin-bottom: 1.5rem;">Job Dashboard</h2>
            <div class="stats-grid" style="grid-template-columns: repeat(3,1fr);">
                <div class="stat-card"><div class="stat-number">${myJobs.length}</div><div class="stat-label">Total Listings</div></div>
                <div class="stat-card"><div class="stat-number">${myJobs.filter((j) => j.type === "Full-time").length}</div><div class="stat-label">Full-time</div></div>
                <div class="stat-card"><div class="stat-number">${myJobs.filter((j) => j.location.toLowerCase().includes("remote")).length}</div><div class="stat-label">Remote</div></div>
            </div>
            ${
              myJobs.length === 0
                ? '<div class="empty-state"><i class="fas fa-database"></i><p>No jobs posted yet. Click "Post Job" to get started.</p></div>'
                : `
                <div style="overflow-x: auto;">
                    <table class="job-table">
                        <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Type</th><th>Actions</th></tr></thead>
                        <tbody id="dashboardTableBody">
                            ${myJobs
                              .map(
                                (job) => `
                                <tr data-id="${job.id}">
                                    <td><strong>${escapeHtml(job.title)}</strong></td>
                                    <td>${escapeHtml(job.company)}</td>
                                    <td>${escapeHtml(job.location)}</td>
                                    <td>${escapeHtml(job.type)}</td>
                                    <td class="action-buttons">
                                        <button class="icon-btn edit" onclick="editJob('${job.id}')"><i class="fas fa-edit"></i></button>
                                        <button class="icon-btn delete" onclick="deleteJob('${job.id}')"><i class="fas fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            `
            }
        </div>
    `;
}

// ==================== JOB OPERATIONS ====================
function addJob(jobData) {
  const newJob = {
    id: Date.now().toString(),
    ...jobData,
    postedAt: new Date().toISOString(),
  };
  jobsData.unshift(newJob);
  saveJobsToStorage(jobsData);
  showAlert("Job posted successfully!", "success");
  navigateTo("jobs");
}

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job listing?")) {
    jobsData = jobsData.filter((job) => job.id !== jobId);
    saveJobsToStorage(jobsData);
    showAlert("Job deleted successfully", "success");
    if (currentPage === "dashboard") renderCurrentPage();
    else if (currentPage === "jobs") renderCurrentPage();
    else renderCurrentPage();
  }
}

function editJob(jobId) {
  const job = jobsData.find((j) => j.id === jobId);
  if (!job) return;
  const newTitle = prompt("Edit job title:", job.title);
  if (newTitle && newTitle.trim()) job.title = newTitle.trim();
  const newCompany = prompt("Edit company name:", job.company);
  if (newCompany && newCompany.trim()) job.company = newCompany.trim();
  saveJobsToStorage(jobsData);
  showAlert("Job updated successfully", "success");
  renderCurrentPage();
}

function filterAndRenderJobs() {
  const container = document.getElementById("jobsListContainer");
  if (!container) return;
  const searchTerm =
    document.getElementById("searchInput")?.value.toLowerCase() || "";
  const typeFilter = document.getElementById("typeFilter")?.value || "all";

  let filtered = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm);
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-search"></i><p>No jobs match your criteria.</p></div>';
    return;
  }
  container.innerHTML = filtered.map((job) => renderJobCard(job)).join("");
}

// ==================== PAGE NAVIGATION ====================
function navigateTo(pageId) {
  currentPage = pageId;
  updateActiveNav(pageId);
  renderCurrentPage();
  if (window.innerWidth <= 768) {
    document.getElementById("navLinks")?.classList.remove("active");
  }
}

function renderCurrentPage() {
  const pageContainer = document.getElementById("pageContainer");
  if (!pageContainer) return;

  switch (currentPage) {
    case "home":
      pageContainer.innerHTML = renderHomePage();
      break;
    case "jobs":
      pageContainer.innerHTML = renderJobsPage();
      setTimeout(() => {
        const searchInput = document.getElementById("searchInput");
        const typeFilter = document.getElementById("typeFilter");
        const resetBtn = document.getElementById("resetFiltersBtn");
        if (searchInput)
          searchInput.addEventListener("input", filterAndRenderJobs);
        if (typeFilter)
          typeFilter.addEventListener("change", filterAndRenderJobs);
        if (resetBtn)
          resetBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (typeFilter) typeFilter.value = "all";
            filterAndRenderJobs();
          });
        filterAndRenderJobs();
      }, 20);
      break;
    case "post":
      pageContainer.innerHTML = renderPostJobPage();
      setTimeout(() => {
        const form = document.getElementById("postJobForm");
        if (form) {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("jobTitle").value.trim();
            const company = document.getElementById("companyName").value.trim();
            const location = document.getElementById("location").value.trim();
            const type = document.getElementById("jobType").value;
            const salary = document.getElementById("salary").value.trim();
            const description = document
              .getElementById("description")
              .value.trim();
            if (!title || !company || !location || !salary || !description) {
              showAlert("Please fill all required fields", "error");
              return;
            }
            addJob({ title, company, location, type, salary, description });
            form.reset();
          });
        }
      }, 20);
      break;
    case "dashboard":
      pageContainer.innerHTML = renderDashboardPage();
      break;
    default:
      pageContainer.innerHTML = renderHomePage();
      currentPage = "home";
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    })
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) {
      return c;
    });
}

// ==================== INITIALIZATION & EVENT LISTENERS ====================
document.addEventListener("DOMContentLoaded", () => {
  renderCurrentPage();

  // Navbar links
  document
    .querySelectorAll(".nav-links a, .footer-col a[data-page]")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        if (page) navigateTo(page);
      });
    });

  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Expose global functions for inline handlers
  window.navigateTo = navigateTo;
  window.deleteJob = deleteJob;
  window.editJob = editJob;
  window.filterAndRenderJobs = filterAndRenderJobs;
});

// Sync storage if external update
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    jobsData = loadJobsFromStorage();
    renderCurrentPage();
  }
});
