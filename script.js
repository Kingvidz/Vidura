// --- DATABASE ---
let appData = JSON.parse(localStorage.getItem('RepPro_v2')) || {
    theme: 'dark',
    bizName: "Silverline Agency",
    aiTone: "Professional & Polished",
    reviews: [
        { id: 1, author: "Marcus V.", platform: "Google", text: "The response time was incredible. Will use again.", rating: 5, reply: "" },
        { id: 2, author: "Elena R.", platform: "Yelp", text: "Good quality, but a bit pricey for the market.", rating: 3, reply: "" }
    ]
};

// --- THEME ENGINE ---
function toggleTheme() {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    appData.theme = newTheme;
    save();
}

// --- PAGE ENGINE ---
function showPage(pageId) {
    const content = document.getElementById('page-content');
    
    // Sidebar Active State
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${pageId}`).classList.add('active');

    // Routing
    if (pageId === 'dashboard') {
        content.innerHTML = `
            <h1 class="fade-in">Executive Summary</h1>
            <div class="stats-grid">
                <div class="card stat-card"><h3>4.9</h3><p>Global Rating</p></div>
                <div class="card stat-card"><h3>${appData.reviews.filter(r => !r.reply).length}</h3><p>Action Items</p></div>
            </div>
            <div class="card fade-in">
                <h2>Welcome, ${appData.bizName}</h2>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Your AI assistant is optimized and ready.</p>
            </div>`;
    } 

    else if (pageId === 'reviews') {
        content.innerHTML = `<h1>Inbox</h1>` + appData.reviews.map(rev => `
            <div class="card fade-in" style="border-left: 4px solid var(--accent)">
                <div style="display:flex; justify-content:space-between; margin-bottom: 1rem;">
                    <strong>${rev.author} <span style="color:var(--text-muted)">— ${rev.platform}</span></strong>
                    <span>${"⭐".repeat(rev.rating)}</span>
                </div>
                <p style="margin-bottom: 1.5rem;">"${rev.text}"</p>
                <button class="primary-btn" onclick="generateAI(${rev.id})">Auto-Generate Response</button>
                <div id="reply-${rev.id}" class="fade-in" style="margin-top:1.5rem; color: var(--text-muted); font-style: italic;">
                    ${rev.reply ? '✅ Sent: ' + rev.reply : ''}
                </div>
            </div>
        `).join('');
    }

    else if (pageId === 'templates') {
        content.innerHTML = `
            <h1>AI Personality</h1>
            <div class="card">
                <label>System Prompt Tone</label>
                <select id="toneInput" onchange="appData.aiTone = this.value; save();">
                    <option value="Friendly" ${appData.aiTone === 'Friendly' ? 'selected' : ''}>Friendly & Energetic</option>
                    <option value="Professional & Polished" ${appData.aiTone === 'Professional & Polished' ? 'selected' : ''}>Corporate & Executive</option>
                    <option value="Short & Punchy" ${appData.aiTone === 'Short & Punchy' ? 'selected' : ''}>Minimalist</option>
                </select>
            </div>`;
    }

    else if (pageId === 'settings') {
        content.innerHTML = `
            <h1>Global Settings</h1>
            <div class="card">
                <label>Organization Name</label>
                <input type="text" id="bizInput" value="${appData.bizName}">
                <button class="primary-btn" style="margin-top:1.5rem" onclick="updateBizName()">Update Profile</button>
            </div>`;
    }
}

// --- ACTIONS ---
function generateAI(id) {
    const box = document.getElementById(`reply-${id}`);
    box.innerHTML = `<span style="color: var(--accent)">AI is analyzing sentiment...</span>`;
    
    setTimeout(() => {
        const msg = `Thank you ${appData.reviews.find(r=>r.id===id).author}, we appreciate the feedback! Our team is focused on ${appData.aiTone.toLowerCase()} service.`;
        box.innerHTML = `✅ <strong>Draft:</strong> ${msg}`;
        appData.reviews.find(r => r.id === id).reply = msg;
        save(false);
    }, 1200);
}

function updateBizName() {
    appData.bizName = document.getElementById('bizInput').value;
    save();
}

function save(showToast = true) {
    localStorage.setItem('RepPro_v2', JSON.stringify(appData));
    document.getElementById('display-biz-name').innerText = appData.bizName;
    if (showToast) {
        const t = document.getElementById('toast');
        t.style.display = 'block';
        setTimeout(() => t.style.display = 'none', 2000);
    }
}

// Start
window.onload = () => {
    document.documentElement.setAttribute('data-theme', appData.theme);
    document.getElementById('display-biz-name').innerText = appData.bizName;
    showPage('dashboard');
};