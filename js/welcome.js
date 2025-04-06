document.addEventListener('DOMContentLoaded', function() {
    // Get the current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Display user info
        document.getElementById('userName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
        
        // Format date
        if (currentUser.registrationDate) {
            const date = new Date(currentUser.registrationDate);
            document.getElementById('registrationDate').textContent = date.toLocaleDateString();
        }
    } else {
        // Redirect if no user is logged in
        window.location.href = 'index.html';
    }

    // Add auto-redirect after 5 seconds
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 5000);
});