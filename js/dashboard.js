// dashboard.js — Main dashboard logic

const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';

// Auth guard
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'index.html';
}

// State
let allIssues = [];
let filteredIssues = [];
let currentTab = 'all';
let isSearchMode = false;
let searchQuery = '';

// DOM Elements
const issuesGrid = document.getElementById('issuesGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchInfo = document.getElementById('searchInfo');
const searchInfoText = document.getElementById('searchInfoText');
const logoutBtn = document.getElementById('logoutBtn');

// Stats
const totalCount = document.getElementById('totalCount');
const openCount = document.getElementById('openCount');
const closedCount = document.getElementById('closedCount');

// Badges
const badgeAll = document.getElementById('badgeAll');
const badgeOpen = document.getElementById('badgeOpen');
const badgeClosed = document.getElementById('badgeClosed');

// Modal Elements
const issueModal = document.getElementById('issueModal');
const closeModalBtn = document.getElementById('closeModal');

// =======================================
// FETCH ALL ISSUES
// =======================================
async function fetchAllIssues() {
  showLoading();
  try {
    const res = await fetch(`${API_BASE}/issues`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    allIssues = data.data || [];
    updateStats(allIssues);
    filterAndRender();
  } catch (err) {
    console.error('Error fetching issues:', err);
    showEmpty();
  }
}

// =======================================
// SEARCH ISSUES
// =======================================
async function searchIssues(query) {
  if (!query.trim()) {
    clearSearch();
    return;
  }
  showLoading();
  isSearchMode = true;
  searchQuery = query.trim();
  clearSearchBtn.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    const results = data.data || [];

    // Update filtered issues to match current tab from search results
    allIssues = results;
    updateStats(results);
    filterAndRender();

    // Show search info
    searchInfo.classList.remove('hidden');
    searchInfoText.textContent = `Search results for: "${query}" — ${results.length} issue(s) found`;
  } catch (err) {
    console.error('Error searching:', err);
    showEmpty();
  }
}

// =======================================
// FILTER & RENDER
// =======================================
function filterAndRender() {
  if (currentTab === 'all') {
    filteredIssues = [...allIssues];
  } else {
    filteredIssues = allIssues.filter(issue => issue.status === currentTab);
  }
  renderIssues(filteredIssues);
  updateTabBadges(allIssues);
}

function renderIssues(issues) {
  hideLoading();
  if (!issues || issues.length === 0) {
    showEmpty();
    return;
  }

  issuesGrid.innerHTML = '';
  emptyState.classList.add('hidden');
  issuesGrid.classList.remove('hidden');

  issues.forEach((issue, i) => {
    const card = createIssueCard(issue, i);
    issuesGrid.appendChild(card);
  });
}

// =======================================
// CREATE ISSUE CARD
// =======================================
function createIssueCard(issue, index) {
  const card = document.createElement('div');
  const isOpen = issue.status === 'open';
  card.className = `issue-card ${isOpen ? 'open-card' : 'closed-card'}`;
  card.style.animationDelay = `${Math.min(index, 12) * 30}ms`;

  const date = formatDate(issue.createdAt);
  const authorInitial = (issue.author || '?')[0].toUpperCase();

  card.innerHTML = `
    <div class="card-top">
      <span class="card-id">#${issue.id}</span>
      <span class="card-status-dot ${isOpen ? 'status-open' : 'status-closed'}"></span>
    </div>

    <h3 class="card-title">${escapeHtml(issue.title)}</h3>
    <p class="card-desc">${escapeHtml(issue.description || '')}</p>

    <div class="card-meta">
      <div class="card-meta-row">
        <span class="card-meta-label">Status</span>
        <span class="card-meta-value" style="color: ${isOpen ? 'var(--green)' : 'var(--purple)'}">
          ${isOpen ? '● Open' : '● Closed'}
        </span>
      </div>
      <div class="card-meta-row">
        <span class="card-meta-label">Priority</span>
        <span class="priority-badge priority-${issue.priority || 'low'}">${issue.priority || 'low'}</span>
      </div>
    </div>

    <div class="card-labels">
      ${renderLabels(issue.labels || [])}
    </div>

    <div class="card-footer">
      <div class="card-author">
        <div class="card-avatar">${authorInitial}</div>
        <span class="card-author-name">${escapeHtml(issue.author || 'unknown')}</span>
      </div>
      <span class="card-date">${date}</span>
    </div>
  `;

  card.addEventListener('click', () => openModal(issue));
  return card;
}

// =======================================
// LABELS
// =======================================
function renderLabels(labels) {
  return labels.map(label => {
    const cls = getLabelClass(label);
    return `<span class="card-label ${cls}">${escapeHtml(label)}</span>`;
  }).join('');
}

function getLabelClass(label) {
  const l = label.toLowerCase().replace(/\s+/g, '-');
  if (l === 'bug') return 'label-bug';
  if (l === 'enhancement') return 'label-enhancement';
  if (l === 'documentation') return 'label-documentation';
  if (l === 'good-first-issue') return 'label-good-first-issue';
  if (l === 'help-wanted') return 'label-help-wanted';
  return 'label-default';
}

// =======================================
// MODAL
// =======================================
function openModal(issue) {
  const isOpen = issue.status === 'open';

  document.getElementById('modalId').textContent = `#${issue.id}`;
  document.getElementById('modalTitle').textContent = issue.title;
  document.getElementById('modalDescription').textContent = issue.description || 'No description provided.';
  document.getElementById('modalAuthor').textContent = issue.author || '—';
  document.getElementById('modalAuthorInitial').textContent = (issue.author || '?')[0].toUpperCase();
  document.getElementById('modalAssignee').textContent = issue.assignee || 'Unassigned';
  document.getElementById('modalPriority').textContent = issue.priority || '—';
  document.getElementById('modalCreatedAt').textContent = formatDateFull(issue.createdAt);
  document.getElementById('modalUpdatedAt').textContent = formatDateFull(issue.updatedAt);

  const statusBadge = document.getElementById('modalStatus');
  statusBadge.textContent = issue.status;
  statusBadge.className = `modal-status-badge ${isOpen ? 'open-badge-modal' : 'closed-badge-modal'}`;

  const statusIcon = document.getElementById('modalStatusIcon');
  statusIcon.className = `modal-status-icon ${isOpen ? 'open-status-icon' : 'closed-status-icon'}`;
  statusIcon.innerHTML = isOpen
    ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  // Labels
  const labelsContainer = document.getElementById('modalLabels');
  if (issue.labels && issue.labels.length > 0) {
    labelsContainer.innerHTML = issue.labels.map(label => {
      const cls = getLabelClass(label);
      return `<span class="modal-label card-label ${cls}">${escapeHtml(label)}</span>`;
    }).join('');
  } else {
    labelsContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 13px;">No labels</span>';
  }

  issueModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  issueModal.classList.add('hidden');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
issueModal.addEventListener('click', (e) => {
  if (e.target === issueModal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =======================================
// TABS
// =======================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.dataset.tab;
    filterAndRender();
  });
});

// =======================================
// SEARCH
// =======================================
function doSearch() {
  const q = searchInput.value.trim();
  if (q) {
    searchIssues(q);
  } else {
    clearSearch();
  }
}

searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

clearSearchBtn.addEventListener('click', clearSearch);

function clearSearch() {
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  searchInfo.classList.add('hidden');
  isSearchMode = false;
  searchQuery = '';
  fetchAllIssues();
}

// =======================================
// STATS & BADGES
// =======================================
function updateStats(issues) {
  const total = issues.length;
  const open = issues.filter(i => i.status === 'open').length;
  const closed = issues.filter(i => i.status === 'closed').length;

  totalCount.textContent = total;
  openCount.textContent = open;
  closedCount.textContent = closed;
}

function updateTabBadges(issues) {
  const total = issues.length;
  const open = issues.filter(i => i.status === 'open').length;
  const closed = issues.filter(i => i.status === 'closed').length;

  badgeAll.textContent = total;
  badgeOpen.textContent = open;
  badgeClosed.textContent = closed;
}

// =======================================
// LOGOUT
// =======================================
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  window.location.href = 'index.html';
});

// =======================================
// HELPERS
// =======================================
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  issuesGrid.classList.add('hidden');
  emptyState.classList.add('hidden');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function showEmpty() {
  hideLoading();
  issuesGrid.classList.add('hidden');
  emptyState.classList.remove('hidden');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateFull(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// =======================================
// INIT
// =======================================
fetchAllIssues();
