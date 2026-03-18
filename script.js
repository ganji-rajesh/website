// script.js

// ===== DETERMINE CORRECT PATHS BASED ON CURRENT LOCATION =====
function getComponentPath(componentFileName) {
    const currentPath = window.location.pathname;
    const depth = (currentPath.match(/\//g) || []).length - 1; // Count slashes to determine depth
    let basePath = '';

    for (let i = 0; i < depth; i++) {
        basePath += '../';
    }

    return basePath + componentFileName;
}

// ===== LOAD AND INJECT HEADER =====
function loadHeader() {
    const headerPlaceholder = document.querySelector('header');
    if (headerPlaceholder) {
        const headerPath = getComponentPath('header.html');
        
        fetch(headerPath)
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.outerHTML = data;
                // Re-attach mobile nav listeners after header loads
                attachHeaderEventListeners();
                // Highlight active nav link after header is loaded
                highlightActiveNavLink();
            })
            .catch(error => {
                console.log('Using existing header HTML');
                attachHeaderEventListeners();
                highlightActiveNavLink();
            });
    }
}

// ===== LOAD AND INJECT FOOTER =====
function loadFooter() {
    const footerPlaceholder = document.querySelector('footer');
    if (footerPlaceholder) {
        const footerPath = getComponentPath('footer.html');
        
        fetch(footerPath)
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.outerHTML = data;
            })
            .catch(error => {
                console.log('Using existing footer HTML');
            });
    }
}

// ===== ATTACH HEADER EVENT LISTENERS =====
function attachHeaderEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close the menu when any link is clicked (better mobile UX)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ===== HIGHLIGHT ACTIVE NAV LINK =====
function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.toLowerCase();
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').toLowerCase();
        
        // Get the base filename from the current page
        let currentFile = currentPage.split('/').pop() || 'index.html';
        if (!currentFile) currentFile = 'index.html';
        
        // Get the base filename from the link href
        let linkFile = href.split('/').pop() || 'index.html';
        
        // Handle index.html and empty cases
        if ((currentFile === 'index.html' || currentFile === '' || currentFile === 'website') && 
            (linkFile === 'index.html' || href === '../index.html' || href === 'index.html' || href === './')) {
            link.classList.add('active');
        } else if (currentFile === linkFile) {
            link.classList.add('active');
        } else if (href.includes(currentFile)) {
            link.classList.add('active');
        }
    });
}

// ===== INITIALIZE PAGE COMPONENTS =====
document.addEventListener('DOMContentLoaded', function () {
    // Load and inject header and footer
    loadHeader();
    loadFooter();
});

// Fetch Live LeetCode Stats
async function loadLeetCodeStats() {
    const container = document.getElementById("leetcode-stats");
    try {
        const response = await fetch("https://leetcode-stats-api.herokuapp.com/Ruchith1018j");
        const data = await response.json();

        if (data.status === "success" || data.totalSolved !== undefined) {
            container.innerHTML = `
                <p><strong>Total Solved:</strong> ${data.totalSolved}</p>
                <p><strong>Easy:</strong> ${data.easySolved}</p>
                <p><strong>Medium:</strong> ${data.mediumSolved}</p>
                <p><strong>Hard:</strong> ${data.hardSolved}</p>
                <p><strong>Ranking:</strong> ${data.ranking}</p>
            `;
        } else {
            container.innerHTML = `<p style="color:#f55;">⚠️ Unable to load LeetCode data.</p>`;
        }
    } catch (err) {
        console.error("LeetCode API error:", err);
        container.innerHTML = `<p style="color:#f55;">⚠️ Unable to load LeetCode data right now.</p>`;
    }
}

// Load stats when page loads
document.addEventListener("DOMContentLoaded", loadLeetCodeStats);

// ===== MOBILE NAVIGATION TOGGLE =====
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Toggle menu when hamburger is clicked
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close the menu when any link is clicked (better mobile UX)
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
});

