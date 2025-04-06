document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('mainContent');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isAdminLoggedIn) {
        // Admin is logged in, load the admin panel
        loadAdminPanel();
    } else {
        // Admin is not logged in, show access denied message
        showAccessDenied();
    }
    
    // Admin logout button
    adminLogoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'index.html';
    });
    
    // Function to load the admin panel
    function loadAdminPanel() {
        // Get registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // Create the HTML for the admin panel
        let adminHTML = `
            <div class="admin-banner">
                Administrator Control Panel
            </div>
            
            <h1>User Management</h1>
            
            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-value">${registeredUsers.length}</div>
                    <div class="stat-label">Total Registered Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="todayRegistrations">0</div>
                    <div class="stat-label">Registrations Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="weekRegistrations">0</div>
                    <div class="stat-label">Registrations This Week</div>
                </div>
            </div>
            
            <div class="tools">
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search users...">
                    <button id="searchBtn">Search</button>
                </div>
                <div class="action-buttons">
                    <button id="exportBtn" class="button">Export User Data</button>
                </div>
            </div>
        `;
        
        if (registeredUsers.length > 0) {
            // Users exist, display the table
            adminHTML += `
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            // Add user rows
            registeredUsers.forEach(user => {
                const date = new Date(user.registrationDate);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                adminHTML += `
                    <tr>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td>${formattedDate}</td>
                    </tr>
                `;
            });
            
            adminHTML += `
                    </tbody>
                </table>
            `;
        } else {
            // No users yet
            adminHTML += `
                <div class="no-users">
                    No users have registered yet.
                </div>
            `;
        }
        
        // Set the HTML content
        mainContent.innerHTML = adminHTML;
        
        // Calculate registrations today and this week
        calculateRecentRegistrations(registeredUsers);
        
        // Set up search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                searchUsers(searchInput.value.trim().toLowerCase());
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    searchUsers(searchInput.value.trim().toLowerCase());
                }
            });
        }
        
        // Set up export functionality
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                exportUserData(registeredUsers);
            });
        }
    }
    
    // Function to show access denied message
    function showAccessDenied() {
        mainContent.innerHTML = `
            <div class="access-denied">
                <h2>Access Denied</h2>
                <p>You need to be logged in as an administrator to view this page.</p>
                <a href="adminlogin.html" class="button">Go to Admin Login</a>
            </div>
        `;
    }
    
    // Function to calculate recent registrations
    function calculateRecentRegistrations(users) {
        const todayElement = document.getElementById('todayRegistrations');
        const weekElement = document.getElementById('weekRegistrations');
        
        if (!todayElement || !weekElement) return;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const oneWeekAgo = today - (7 * 24 * 60 * 60 * 1000);
        
        const todayCount = users.filter(user => {
            const regDate = new Date(user.registrationDate).getTime();
            return regDate >= today;
        }).length;
        
        const weekCount = users.filter(user => {
            const regDate = new Date(user.registrationDate).getTime();
            return regDate >= oneWeekAgo;
        }).length;
        
        todayElement.textContent = todayCount;
        weekElement.textContent = weekCount;
    }
    
    // Function to search users
    function searchUsers(query) {
        const rows = document.querySelectorAll('#usersTable tbody tr');
        if (!rows.length) return;
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Function to export user data
    function exportUserData(users) {
        if (!users.length) {
            alert('No user data to export.');
            return;
        }
        
        // Create a sanitized version without passwords
        const sanitizedUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        
        // Convert to CSV
        let csv = 'First Name,Last Name,Email,Phone,Registration Date\n';
        
        sanitizedUsers.forEach(user => {
            const date = new Date(user.registrationDate).toLocaleDateString();
            csv += `${user.firstName},${user.lastName},${user.email},${user.phone || 'N/A'},${date}\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'turnitgreen_users.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
});