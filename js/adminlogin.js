document.addEventListener('DOMContentLoaded', function() {
    // Create default admin account if it doesn't exist
    if (!localStorage.getItem('adminAccount')) {
        const adminAccount = {
            username: 'admin',
            password: 'Admin123!'
        };
        localStorage.setItem('adminAccount', JSON.stringify(adminAccount));
    }
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        
        // Get input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Basic validation
        let isValid = true;
        
        if (username === '') {
            document.getElementById('usernameError').textContent = 'Username is required';
            isValid = false;
        }
        
        if (password === '') {
            document.getElementById('passwordError').textContent = 'Password is required';
            isValid = false;
        }
        
        if (isValid) {
            // Get admin account
            const adminAccount = JSON.parse(localStorage.getItem('adminAccount'));
            
            // Check credentials
            if (username === adminAccount.username && password === adminAccount.password) {
                // Login successful
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'viewusers.html';
            } else {
                // Login failed
                document.getElementById('passwordError').textContent = 'Invalid username or password';
            }
        }
    });
});