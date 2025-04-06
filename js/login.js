document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Clear previous error messages
        document.getElementById('loginEmailError').textContent = '';
        document.getElementById('loginPasswordError').textContent = '';
        
        // Validate inputs
        let isValid = true;
        
        if (email === '') {
            document.getElementById('loginEmailError').textContent = 'Email is required';
            isValid = false;
        }
        
        if (password === '') {
            document.getElementById('loginPasswordError').textContent = 'Password is required';
            isValid = false;
        }
        
        if (isValid) {
            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
            
            // Find user with matching email
            const user = users.find(user => user.email === email);
            
            if (!user) {
                document.getElementById('loginEmailError').textContent = 'No account found with this email';
                return;
            }
            
            // Check password
            if (user.password !== password) {
                document.getElementById('loginPasswordError').textContent = 'Incorrect password';
                return;
            }
            
            // Login successful
            // Store current user (excluding password for security)
            const currentUser = { ...user };
            delete currentUser.password;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect to homepage
            window.location.href = 'index.html';
        }
    });
});