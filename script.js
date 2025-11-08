// API Configuration
const API_BASE_URL = 'http://localhost:8081';

// DOM Elements
const collaboratorBtn = document.getElementById('collaboratorBtn');
const researcherBtn = document.getElementById('researcherBtn');
const collaboratorSection = document.getElementById('collaboratorSection');
const researcherSection = document.getElementById('researcherSection');

// Collaborator Elements
const collabSigninTab = document.getElementById('collabSigninTab');
const collabRegisterTab = document.getElementById('collabRegisterTab');
const collabSigninForm = document.getElementById('collabSigninForm');
const collabRegisterForm = document.getElementById('collabRegisterForm');
const collabSigninBtn = document.getElementById('collabSigninBtn');
const collabRegisterBtn = document.getElementById('collabRegisterBtn');
const researcherBrowse = document.getElementById('researcherBrowse');
const researcherGrid = document.getElementById('researcherGrid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

// Researcher Elements
const resSigninTab = document.getElementById('resSigninTab');
const resRegisterTab = document.getElementById('resRegisterTab');
const resSigninForm = document.getElementById('resSigninForm');
const resRegisterForm = document.getElementById('resRegisterForm');
const resSigninBtn = document.getElementById('resSigninBtn');
const resRegisterBtn = document.getElementById('resRegisterBtn');
const researcherDashboard = document.getElementById('researcherDashboard');

// Modal Elements
const researcherModal = document.getElementById('researcherModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close-btn');

// Message Elements
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Current User State
let currentUser = null;
let userType = null; // 'collaborator' or 'researcher'

// Event Listeners
collaboratorBtn.addEventListener('click', () => switchMainSection('collaborator'));
researcherBtn.addEventListener('click', () => switchMainSection('researcher'));

// Collaborator Tab Switching
collabSigninTab.addEventListener('click', () => switchCollabTab('signin'));
collabRegisterTab.addEventListener('click', () => switchCollabTab('register'));

// Researcher Tab Switching
resSigninTab.addEventListener('click', () => switchResTab('signin'));
resRegisterTab.addEventListener('click', () => switchResTab('register'));

// Form Submissions
collabSigninBtn.addEventListener('click', collaboratorSignIn);
collabRegisterBtn.addEventListener('click', registerCollaborator);
resSigninBtn.addEventListener('click', researcherSignIn);
resRegisterBtn.addEventListener('click', registerResearcher);

// Search
searchBtn.addEventListener('click', searchResearchers);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchResearchers();
});

// Modal
closeBtn.addEventListener('click', closeModal);
researcherModal.addEventListener('click', (e) => {
    if (e.target === researcherModal) closeModal();
});

// Initialize
loadResearchers();

/**
 * Switch between main sections
 */
function switchMainSection(section) {
    if (section === 'collaborator') {
        collaboratorBtn.classList.add('active');
        researcherBtn.classList.remove('active');
        collaboratorSection.classList.remove('hidden');
        researcherSection.classList.add('hidden');
    } else {
        researcherBtn.classList.add('active');
        collaboratorBtn.classList.remove('active');
        researcherSection.classList.remove('hidden');
        collaboratorSection.classList.add('hidden');
    }
    hideMessages();
}

/**
 * Switch collaborator tabs
 */
function switchCollabTab(tab) {
    if (tab === 'signin') {
        collabSigninTab.classList.add('active');
        collabRegisterTab.classList.remove('active');
        collabSigninForm.classList.remove('hidden');
        collabRegisterForm.classList.add('hidden');
    } else {
        collabRegisterTab.classList.add('active');
        collabSigninTab.classList.remove('active');
        collabRegisterForm.classList.remove('hidden');
        collabSigninForm.classList.add('hidden');
    }
    hideMessages();
}

/**
 * Switch researcher tabs
 */
function switchResTab(tab) {
    if (tab === 'signin') {
        resSigninTab.classList.add('active');
        resRegisterTab.classList.remove('active');
        resSigninForm.classList.remove('hidden');
        resRegisterForm.classList.add('hidden');
    } else {
        resRegisterTab.classList.add('active');
        resSigninTab.classList.remove('active');
        resRegisterForm.classList.remove('hidden');
        resSigninForm.classList.add('hidden');
    }
    hideMessages();
}

/**
 * Register Researcher
 */
async function registerResearcher() {
    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resRegEmail').value.trim();
    const password = document.getElementById('resRegPassword').value.trim();
    const institution = document.getElementById('resInstitution').value.trim();
    const field = document.getElementById('resField').value;
    const experience = document.getElementById('resExperience').value.trim();
    const location = document.getElementById('resLocation').value.trim();
    const contactNumber = document.getElementById('resContact').value.trim();
    const projectTitle = document.getElementById('resProjectTitle').value.trim();
    const projectDescription = document.getElementById('resProjectDesc').value.trim();
    const skills = document.getElementById('resSkills').value.trim().split(',').map(s => s.trim()).filter(s => s);

    if (!name || !email || !password || !institution || !field || !projectTitle || skills.length === 0) {
        showError('Please fill all required fields');
        return;
    }

    resRegisterBtn.innerHTML = '<span class="loading"></span>Registering...';
    resRegisterBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/researcher/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name, email, password, institution, field, experience,
                location, contactNumber, projectTitle, projectDescription, skills
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Registration successful! Please sign in.');
            switchResTab('signin');
            clearForm('resRegisterForm');
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Make sure the backend is running at ' + API_BASE_URL);
    } finally {
        resRegisterBtn.innerHTML = 'Register as Researcher';
        resRegisterBtn.disabled = false;
    }
}

/**
 * Register Collaborator
 */
async function registerCollaborator() {
    const name = document.getElementById('collabName').value.trim();
    const email = document.getElementById('collabRegEmail').value.trim();
    const password = document.getElementById('collabRegPassword').value.trim();
    const organization = document.getElementById('collabOrg').value.trim();
    const projectIdea = document.getElementById('collabProject').value.trim();
    const budget = document.getElementById('collabBudget').value.trim();
    const fields = document.getElementById('collabFields').value.trim().split(',').map(f => f.trim()).filter(f => f);

    if (!name || !email || !password || !organization || fields.length === 0) {
        showError('Please fill all required fields');
        return;
    }

    collabRegisterBtn.innerHTML = '<span class="loading"></span>Registering...';
    collabRegisterBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/collaborator/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name, email, password, organization, projectIdea, budget,
                interestedFields: fields
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Registration successful! Please sign in.');
            switchCollabTab('signin');
            clearForm('collabRegisterForm');
        } else {
            showError(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Make sure the backend is running at ' + API_BASE_URL);
    } finally {
        collabRegisterBtn.innerHTML = 'Register';
        collabRegisterBtn.disabled = false;
    }
}

/**
 * Researcher Sign In
 */
async function researcherSignIn() {
    const email = document.getElementById('resEmail').value.trim();
    const password = document.getElementById('resPassword').value.trim();

    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }

    resSigninBtn.innerHTML = '<span class="loading"></span>Signing In...';
    resSigninBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/researcher/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.researcher;
            userType = 'researcher';
            showSuccess(`Welcome back, ${currentUser.name}!`);
            showResearcherDashboard();
        } else {
            showError(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        showError('Sign-in failed. Make sure the backend is running at ' + API_BASE_URL);
    } finally {
        resSigninBtn.innerHTML = 'Sign In';
        resSigninBtn.disabled = false;
    }
}

/**
 * Collaborator Sign In
 */
async function collaboratorSignIn() {
    const email = document.getElementById('collabEmail').value.trim();
    const password = document.getElementById('collabPassword').value.trim();

    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }

    collabSigninBtn.innerHTML = '<span class="loading"></span>Signing In...';
    collabSigninBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/collaborator/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.collaborator;
            userType = 'collaborator';
            showSuccess(`Welcome back, ${currentUser.name}!`);
            showResearcherBrowse();
        } else {
            showError(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error('Sign-in error:', error);
        showError('Sign-in failed. Make sure the backend is running at ' + API_BASE_URL);
    } finally {
        collabSigninBtn.innerHTML = 'Sign In';
        collabSigninBtn.disabled = false;
    }
}

/**
 * Show researcher browse section
 */
function showResearcherBrowse() {
    document.getElementById('collaboratorAuth').classList.add('hidden');
    researcherBrowse.classList.remove('hidden');
    loadResearchers();
}

/**
 * Show researcher dashboard
 */
function showResearcherDashboard() {
    document.getElementById('researcherAuth').classList.add('hidden');
    researcherDashboard.classList.remove('hidden');
    displayResearcherProfile();
}

/**
 * Load and display researchers
 */
async function loadResearchers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/researchers`);
        const data = await response.json();

        if (data.success) {
            displayResearchers(data.researchers);
        }
    } catch (error) {
        console.error('Error loading researchers:', error);
    }
}

/**
 * Search researchers
 */
async function searchResearchers() {
    const keyword = searchInput.value.trim();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        if (data.success) {
            displayResearchers(data.researchers);
        }
    } catch (error) {
        console.error('Error searching researchers:', error);
    }
}

/**
 * Display researchers in grid
 */
function displayResearchers(researchers) {
    if (researchers.length === 0) {
        researcherGrid.innerHTML = '<p style="text-align: center; color: #64748b; font-size: 18px; grid-column: 1/-1;">No researchers found. Be the first to register!</p>';
        return;
    }

    researcherGrid.innerHTML = researchers.map(researcher => `
        <div class="researcher-card" onclick="showResearcherDetails('${researcher.id}')">
            <h3><i class="fas fa-user-graduate"></i> ${researcher.name}</h3>
            <div class="field">${researcher.field}</div>
            <div class="institution"><i class="fas fa-university"></i> ${researcher.institution}</div>
            <div class="project-title"><strong>Project:</strong> ${researcher.projectTitle}</div>
            <div class="project-desc">${researcher.projectDescription}</div>
        </div>
    `).join('');
}

/**
 * Show researcher details in modal
 */
async function showResearcherDetails(researcherId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/researcher/${researcherId}`);
        const data = await response.json();

        if (data.success) {
            const researcher = data.researcher;
            modalContent.innerHTML = `
                <h2><i class="fas fa-user-graduate"></i> ${researcher.name}</h2>
                <div style="margin: 20px 0;">
                    <div class="field" style="display: inline-block; margin-bottom: 20px;">${researcher.field}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <div><strong><i class="fas fa-university"></i> Institution:</strong><br>${researcher.institution}</div>
                    <div><strong><i class="fas fa-map-marker-alt"></i> Location:</strong><br>${researcher.location || 'Not specified'}</div>
                    <div><strong><i class="fas fa-clock"></i> Experience:</strong><br>${researcher.experience || 'Not specified'} years</div>
                    <div><strong><i class="fas fa-phone"></i> Contact:</strong><br>${researcher.contactNumber || 'Not specified'}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong><i class="fas fa-project-diagram"></i> Current Project:</strong>
                    <h3 style="color: #2563eb; margin: 10px 0;">${researcher.projectTitle}</h3>
                    <p style="line-height: 1.6; color: #4a5568;">${researcher.projectDescription}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong><i class="fas fa-tools"></i> Skills:</strong>
                    <div style="margin-top: 10px;">
                        ${researcher.skills.map(skill => `<span style="background: #e2e8f0; padding: 4px 8px; font-size: 12px; margin: 2px; display: inline-block;">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="mailto:${researcher.email}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; font-weight: 600;">
                        <i class="fas fa-envelope"></i> Contact Researcher
                    </a>
                </div>
            `;
            researcherModal.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading researcher details:', error);
        showError('Failed to load researcher details');
    }
}

/**
 * Display researcher profile in dashboard
 */
function displayResearcherProfile() {
    const profile = document.getElementById('researcherProfile');
    profile.innerHTML = `
        <h3><i class="fas fa-user-circle"></i> ${currentUser.name}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
            <div><strong>Field:</strong> ${currentUser.field}</div>
            <div><strong>Institution:</strong> ${currentUser.institution}</div>
            <div><strong>Experience:</strong> ${currentUser.experience || 'Not specified'} years</div>
            <div><strong>Location:</strong> ${currentUser.location || 'Not specified'}</div>
        </div>
        
        <div style="margin: 20px 0;">
            <strong>Current Project:</strong>
            <h4 style="color: #2563eb; margin: 10px 0;">${currentUser.projectTitle}</h4>
            <p>${currentUser.projectDescription}</p>
        </div>
        
        <div>
            <strong>Skills:</strong>
            <div style="margin-top: 10px;">
                ${currentUser.skills.map(skill => `<span style="background: #e2e8f0; padding: 4px 8px; font-size: 12px; margin: 2px; display: inline-block;">${skill}</span>`).join('')}
            </div>
        </div>
    `;
}

/**
 * Close modal
 */
function closeModal() {
    researcherModal.classList.add('hidden');
}

/**
 * Clear form
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => input.value = '');
}

/**
 * Show error message
 */
function showError(message) {
    hideMessages();
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.classList.remove('hidden');
    setTimeout(() => hideMessages(), 8000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    hideMessages();
    successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successMessage.classList.remove('hidden');
    setTimeout(() => hideMessages(), 5000);
}

/**
 * Hide all messages
 */
function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}