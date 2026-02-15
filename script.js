// Script to render students dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Sort students by carrots in descending order
    studentsData.sort((a, b) => b.carrots - a.carrots);
    
    renderTopStudents();
    renderGridStudents();
    setupSearch();
});

// Render top 3 students
function renderTopStudents() {
    const topStudentsContainer = document.querySelector('.top-students');
    const topThree = studentsData.slice(0, 3);
    
    // Clear existing content except the featured student
    const existingCards = topStudentsContainer.querySelectorAll('.student-card');
    existingCards.forEach((card, index) => {
        if (index > 0) card.remove();
    });
    
    // Render top students
    topThree.forEach((student, index) => {
        const isFeatured = index === 0;
        const card = createStudentCard(student, isFeatured, index + 1);
        topStudentsContainer.appendChild(card);
    });
}

// Render all other students in grid
function renderGridStudents() {
    const gridContainer = document.querySelector('.students-grid');
    const otherStudents = studentsData.slice(3);
    
    gridContainer.innerHTML = ''; // Clear existing
    
    otherStudents.forEach(student => {
        const gridCard = createGridCard(student);
        gridContainer.appendChild(gridCard);
    });
}

// Create a top student card element
function createStudentCard(student, isFeatured, rank) {
    const card = document.createElement('div');
    card.className = `student-card ${isFeatured ? 'featured' : ''}`;
    
    const initial = student.name.charAt(0).toUpperCase();
    const bgColor = isFeatured ? 'featured-avatar' : 'secondary';
    
    let badgeHTML = '';
    if (isFeatured) {
        badgeHTML = `<div class="featured-badge">⭐ #${rank} top</div>`;
    } else {
        badgeHTML = `<div class="rank">#${rank}</div>`;
    }
    
    card.innerHTML = `
        ${badgeHTML}
        <div class="student-avatar ${isFeatured ? '' : 'secondary'}">${initial}</div>
        <h3>${student.name}</h3>
        <div class="carrot-count">
            <span class="carrot-icon">🥕</span>
            <span>${student.carrots} carrots</span>
        </div>
        <p class="completed">Completed ${student.completed} Pending ${student.pending}</p>
    `;
    
    return card;
}

// Create a grid card element
function createGridCard(student) {
    const card = document.createElement('div');
    card.className = 'grid-card';
    const initial = student.name.charAt(0).toUpperCase();
    
    card.innerHTML = `
        <div class="avatar-small">${initial}</div>
        <h4>${student.name}</h4>
        <div class="carrot-small">
            <span class="carrot-icon">🥕</span> ${student.carrots}
        </div>
        <div class="status">${student.completed} items • ${student.pending} left</div>
    `;
    
    return card;
}

// Search functionality
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm === '') {
            renderTopStudents();
            renderGridStudents();
            return;
        }
        
        const filtered = studentsData.filter(student => 
            student.name.toLowerCase().includes(searchTerm)
        );
        
        // Sort filtered results by carrots
        filtered.sort((a, b) => b.carrots - a.carrots);
        
        // Render filtered results
        const topStudentsContainer = document.querySelector('.top-students');
        topStudentsContainer.innerHTML = '';
        
        const gridContainer = document.querySelector('.students-grid');
        gridContainer.innerHTML = '';
        
        filtered.forEach((student, index) => {
            if (index < 3) {
                const card = createStudentCard(student, index === 0, index + 1);
                topStudentsContainer.appendChild(card);
            }
            const gridCard = createGridCard(student);
            gridContainer.appendChild(gridCard);
        });
    });
}

// Sort functionality
function setupSortDropdown() {
    const sortDropdown = document.querySelector('.sort-dropdown select');
    
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function(e) {
            const sortType = e.target.value;
            let sorted = [...studentsData];
            
            if (sortType === 'highest') {
                sorted.sort((a, b) => b.carrots - a.carrots);
            } else if (sortType === 'lowest') {
                sorted.sort((a, b) => a.carrots - b.carrots);
            } else if (sortType === 'alphabetical') {
                sorted.sort((a, b) => a.name.localeCompare(b.name));
            }
            
            // Update global data
            studentsData.length = 0;
            studentsData.push(...sorted);
            
            renderTopStudents();
            renderGridStudents();
        });
    }
}

// Call sort setup after page load
document.addEventListener('DOMContentLoaded', setupSortDropdown);
