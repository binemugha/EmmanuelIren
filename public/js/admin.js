// Admin panel JavaScript - Firebase Authentication and Firestore integration
import { auth, db } from './firebase-init.js';
import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  collection, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  getDocs,
  where,
  doc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const contactRequestsList = document.getElementById('contactRequestsList');

// Stats elements
const totalRequestsEl = document.getElementById('totalRequests');
const pendingRequestsEl = document.getElementById('pendingRequests');
const repliedRequestsEl = document.getElementById('repliedRequests');

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, show dashboard
    showDashboard();
    loadContactRequests();
    loadStats();
  } else {
    // User is signed out, show login
    showLogin();
  }
});

// Login form handler
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle UI transition
      loginError.textContent = '';
    } catch (error) {
      console.error('Login error:', error);
      loginError.textContent = getErrorMessage(error.code);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    }
  });
}

// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  });
}

// Show login section
function showLogin() {
  if (loginSection) loginSection.style.display = 'block';
  if (dashboardSection) dashboardSection.classList.remove('is-visible');
}

// Show dashboard section
function showDashboard() {
  if (loginSection) loginSection.style.display = 'none';
  if (dashboardSection) dashboardSection.classList.add('is-visible');
}

// Load contact requests from Firestore
function loadContactRequests() {
  const q = query(
    collection(db, 'contactRequests'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  // Real-time listener
  onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      contactRequestsList.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No contact requests yet.</p>';
      return;
    }
    
    contactRequestsList.innerHTML = '';
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = createRequestItem(doc.id, data);
      contactRequestsList.appendChild(item);
    });
  }, (error) => {
    console.error('Error loading contact requests:', error);
    contactRequestsList.innerHTML = '<p style="color: #ff6b6b;">Error loading data. Please refresh.</p>';
  });
}

// Create a contact request item element
function createRequestItem(id, data) {
  const div = document.createElement('div');
  div.className = 'contact-request-item';
  
  const status = data.status || 'pending';
  const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Unknown date';
  
  div.innerHTML = `
    <div class="header">
      <span class="name">${escapeHtml(data.name)}</span>
      <span class="status ${status}">${status}</span>
    </div>
    <div class="meta">
      ${escapeHtml(data.email)} · ${escapeHtml(data.organization || 'No organization')} · ${date}
    </div>
    <div class="message">${escapeHtml(data.message)}</div>
    ${status === 'pending' ? `
      <button class="mark-replied-btn" data-id="${id}" style="
        margin-top: 0.75rem;
        padding: 0.375rem 0.75rem;
        background: rgba(40, 167, 69, 0.2);
        border: 1px solid rgba(40, 167, 69, 0.4);
        color: #28a745;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 500;
      ">Mark as Replied</button>
    ` : ''}
  `;
  
  // Add click handler for mark as replied button
  const markRepliedBtn = div.querySelector('.mark-replied-btn');
  if (markRepliedBtn) {
    markRepliedBtn.addEventListener('click', () => markAsReplied(id));
  }
  
  return div;
}

// Mark a contact request as replied
async function markAsReplied(id) {
  try {
    const requestRef = doc(db, 'contactRequests', id);
    await updateDoc(requestRef, {
      status: 'replied',
      repliedAt: new Date()
    });
  } catch (error) {
    console.error('Error marking as replied:', error);
    alert('Failed to update status. Please try again.');
  }
}

// Load statistics
async function loadStats() {
  try {
    // Total requests
    const totalSnapshot = await getDocs(collection(db, 'contactRequests'));
    totalRequestsEl.textContent = totalSnapshot.size;
    
    // Pending requests
    const pendingQuery = query(
      collection(db, 'contactRequests'),
      where('status', '==', 'pending')
    );
    const pendingSnapshot = await getDocs(pendingQuery);
    pendingRequestsEl.textContent = pendingSnapshot.size;
    
    // Replied requests
    const repliedQuery = query(
      collection(db, 'contactRequests'),
      where('status', '==', 'replied')
    );
    const repliedSnapshot = await getDocs(repliedQuery);
    repliedRequestsEl.textContent = repliedSnapshot.size;
    
  } catch (error) {
    console.error('Error loading stats:', error);
    totalRequestsEl.textContent = '?';
    pendingRequestsEl.textContent = '?';
    repliedRequestsEl.textContent = '?';
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Get user-friendly error message
function getErrorMessage(code) {
  const messages = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.'
  };
  return messages[code] || 'An error occurred. Please try again.';
}

console.log('Admin panel initialized');
