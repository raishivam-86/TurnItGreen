document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const passwordStrengthText = document.getElementById('passwordStrength');
    const strengthBars = document.querySelectorAll('.strength-bar');
    
    // Popup elements
    const successPopup = document.getElementById('successPopup');
    const continueBtn = document.getElementById('continueBtn');
    const popupName = document.getElementById('popupName');
    const popupEmail = document.getElementById('popupEmail');
    const popupDate = document.getElementById('popupDate');
    
    // Continue button click handler
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // Hide popup and redirect to welcome page
            successPopup.classList.remove('active');
            window.location.href = 'welcome.html';
        });
    }
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });
    
    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Form is valid, proceed with registration
            const userData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                phone: document.getElementById('phone').value.trim(),
                registrationDate: new Date().toISOString()
            };
            
            // Save user data
            if (saveUserData(userData)) {
                // Show success popup with user details
                if (popupName) popupName.textContent = userData.firstName + ' ' + userData.lastName;
                if (popupEmail) popupEmail.textContent = userData.email;
                
                // Format date
                const registrationDate = new Date(userData.registrationDate);
                if (popupDate) {
                    popupDate.textContent = registrationDate.toLocaleDateString() + ' ' + 
                                        registrationDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                }
                
                // Show popup
                if (successPopup) {
                    successPopup.classList.add('active');
                    
                    // Auto redirect after 5 seconds if user doesn't click the button
                    setTimeout(function() {
                        window.location.href = 'welcome.html';
                    }, 5000);
                } else {
                    // If popup element doesn't exist, just redirect
                    window.location.href = 'welcome.html';
                }
                
                // Reset form
                registerForm.reset();
            }
        }
    });
    
    // Function to save user data
    function saveUserData(userData) {
        // Get existing users if any
        let allUsers = [];
        
        if (localStorage.getItem('registeredUsers')) {
            try {
                allUsers = JSON.parse(localStorage.getItem('registeredUsers'));
            } catch (e) {
                // If there's an error parsing, start with an empty array
                allUsers = [];
            }
        }
        
        // Check if email already exists
        const emailExists = allUsers.some(user => user.email === userData.email);
        if (emailExists) {
            showError('emailError', 'An account with this email already exists');
            return false;
        }
        
        // Add the new user
        allUsers.push(userData);
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(allUsers));
        
        // Also save current user separately for easy access
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('User data saved successfully!');
        
        // Update the user counter on the homepage if it exists and we're in the right context
        if (window.opener && window.opener.displayUserCount) {
            window.opener.displayUserCount();
        }
        
        return true;
    }
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Validate first name
        const firstName = document.getElementById('firstName').value.trim();
        if (firstName === '') {
            showError('firstNameError', 'First name is required');
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            showError('firstNameError', 'First name should contain only letters');
            isValid = false;
        } else {
            hideError('firstNameError');
        }
        
        // Validate last name
        const lastName = document.getElementById('lastName').value.trim();
        if (lastName === '') {
            showError('lastNameError', 'Last name is required');
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            showError('lastNameError', 'Last name should contain only letters');
            isValid = false;
        } else {
            hideError('lastNameError');
        }
        
        // Validate email
        const email = document.getElementById('email').value.trim();
        if (email === '') {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        } else {
            hideError('emailError');
        }
        
        // Validate password
        const password = document.getElementById('password').value;
        if (password === '') {
            showError('passwordError', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('passwordError', 'Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            showError('passwordError', 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character');
            isValid = false;
        } else {
            hideError('passwordError');
        }
        
        // Validate confirm password
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (confirmPassword === '') {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (confirmPassword !== password) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        } else {
            hideError('confirmPasswordError');
        }
        
        // Validate phone (optional)
        const phone = document.getElementById('phone').value.trim();
        if (phone && !isValidPhone(phone)) {
            showError('phoneError', 'Please enter a valid phone number');
            isValid = false;
        } else {
            hideError('phoneError');
        }
        
        // Validate terms checkbox
        if (!document.getElementById('terms').checked) {
            showError('termsError', 'You must accept the terms and conditions');
            isValid = false;
        } else {
            hideError('termsError');
        }
        
        return isValid;
    }
    
    // Helper functions
    function showError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }
    
    function hideError(elementId) {
        document.getElementById(elementId).textContent = '';
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length contributes up to 40%
        strength += Math.min(40, (password.length / 12) * 40);
        
        // Contains both lower and upper case
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
        
        // Contains numbers
        if (/\d/.test(password)) strength += 20;
        
        // Contains special characters
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        
        return Math.min(100, strength);
    }
    
    function updatePasswordStrengthIndicator(strength) {
        // Update text
        let strengthText;
        let strengthColor;
        
        if (strength < 30) {
            strengthText = 'Weak';
            strengthColor = '#e74c3c';
        } else if (strength < 70) {
            strengthText = 'Moderate';
            strengthColor = '#f39c12';
        } else {
            strengthText = 'Strong';
            strengthColor = '#2ecc71';
        }
        
        passwordStrengthText.textContent = strengthText;
        passwordStrengthText.style.color = strengthColor;
        
        // Update bars
        const activeBars = Math.ceil((strength / 100) * strengthBars.length);
        
        strengthBars.forEach((bar, index) => {
            if (index < activeBars) {
                bar.style.backgroundColor = strengthColor;
                bar.style.opacity = 0.2 + (0.8 * (index + 1) / activeBars);
            } else {
                bar.style.backgroundColor = '#e0e0e0';
            }
        });
    }
});