// Sample Data
const sampleProducts = [
    {
        id: 1,
        title: "Refurbished MacBook Pro 2019",
        category: "laptops",
        condition: "refurbished",
        description: "Fully refurbished with new battery and 1-year warranty. 16GB RAM, 512GB SSD.",
        price: 30000,
        images: "https://buy.budli.in/cdn/shop/files/AppleMacBookPro_16-inch_2019_4ed70a92-e7e8-49f3-8713-e1441beda03d.jpg?v=1739016957",
        seller: "GreenTech Refurbs",
        date: "15-03-2025"
    },
    {
        id: 2,
        title: "iPhone 11 - Used Good Condition",
        category: "phones",
        condition: "used",
        description: "Excellent condition with 85% battery health. Includes original box and charger.",
        price: 15000,
        images: "https://rukminim3.flixcart.com/image/850/1000/k2jbyq80pkrrdj/mobile-refurbished/k/y/d/iphone-11-256-u-mwm82hn-a-apple-0-original-imafkg25mhaztxns.jpeg?q=90&crop=false",
        seller: "PhoneCycle",
        date: "20-02-2025"
    },
    {
        id: 3,
        title: "Samsung Galaxy Tab S6 for Parts",
        category: "tablets",
        condition: "for-parts",
        description: "Screen cracked but motherboard and battery in working condition.",
        price: 8000,
        images: "https://images-cdn.ubuy.co.in/656b96d91f732c63d33fffea-samsung-galaxy-s6-lite-10-4-fhd-tablet.jpg",
        seller: "E-Waste Solutions",
        date: "02-04-2025"
    }
];

const sampleNeeds = [
    {
        id: 1,
        title: "Need: Affordable Laptop for Online Classes",
        category: "laptops",
        description: "Looking for a reliable laptop for my daughter's school work. Budget around $300.",
        budget: 35000,
        user: "Parent123",
        date: "2025-03-16",
        responses: 3
    },
    {
        id: 2,
        title: "Seeking iPhone 8 or Similar",
        category: "phones",
        description: "Need a basic smartphone for my elderly mother. Must have good battery life.",
        budget: 10000,
        user: "CareGiver22",
        date: "2024-11-19",
        responses: 5
    }
];

// State Management
let currentUser = null;
let products = [...sampleProducts];
let needs = [...sampleNeeds];
let impactStats = {
    devicesRescued: 1247,
    ewasteDiverted: 3580,
    transactions: 892
};

// DOM Elements
const productsContainer = document.getElementById('products-container');
const needsContainer = document.getElementById('needs-container');
const categoryFilter = document.getElementById('category-filter');
const conditionFilter = document.getElementById('condition-filter');
const postNeedBtn = document.getElementById('post-need-btn');
const sellItemBtn = document.getElementById('sell-item-btn');
const postFormModal = document.getElementById('post-form');
const sellerFormModal = document.getElementById('seller-form');
const closeFormButtons = document.querySelectorAll('.close-form');
const needForm = document.getElementById('need-form');
const sellerForm = document.getElementById('seller-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const impactElements = {
    devicesRescued: document.getElementById('devices-rescued'),
    ewasteDiverted: document.getElementById('ewaste-diverted'),
    transactions: document.getElementById('transactions')
};

// Initialize the page
function init() {
    checkUserLoggedIn();
    renderProducts();
    renderNeeds();
    updateImpactStats();
    setupEventListeners();
    
    // Remove any existing user count elements
    removeUserCountDisplay();
}

// Check if user is logged in
function checkUserLoggedIn() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            updateAuthUI(true);
        } catch (e) {
            console.error('Error parsing user data', e);
            localStorage.removeItem('currentUser');
        }
    } else {
        updateAuthUI(false);
    }
}

// Display total registered user count
function displayUserCount() {
    // Empty function as we want to hide the user count
    // But we keep the function to maintain script compatibility
    return;
}

// Update UI based on authentication state
function updateAuthUI(isLoggedIn) {
    if (isLoggedIn && currentUser) {
        // Replace login/register buttons with user info
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="user-welcome">Welcome, ${currentUser.firstName}!</div>
                <button id="logout-btn">Logout</button>
            `;
            // Add logout functionality
            document.getElementById('logout-btn').addEventListener('click', logoutUser);
        }
    }
}

// Logout functionality
function logoutUser() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    window.location.reload();
}

// Render products to the page
function renderProducts(filterCategory = 'all', filterCondition = 'all') {
    productsContainer.innerHTML = '';
    
    const filteredProducts = products.filter(product => {
        const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
        const conditionMatch = filterCondition === 'all' || product.condition === filterCondition;
        return categoryMatch && conditionMatch;
    });
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-results">No products match your filters.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Handle both string (single image) and array (multiple images) cases
        let imageUrl = '';
        if (Array.isArray(product.images)) {
            imageUrl = product.images[0]; // Use first image if array
        } else {
            imageUrl = product.images || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.title)}`;
        }
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${imageUrl}" alt="${product.title}" class="product-img" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-condition">${formatCondition(product.condition)}</span>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <p class="seller">Sold by: ${product.seller}</p>
                <button class="view-btn">View Details</button>
                <button class="contact-btn">Contact Seller</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Render needs to the page
function renderNeeds() {
    needsContainer.innerHTML = '';
    
    if (needs.length === 0) {
        needsContainer.innerHTML = '<p class="no-results">No current needs posted.</p>';
        return;
    }
    
    needs.forEach(need => {
        const needCard = document.createElement('div');
        needCard.className = 'need-card';
        
        const budgetInfo = need.budget ? `<p><strong>Budget:</strong> ₹${need.budget}</p>` : '';
        
        needCard.innerHTML = `
            <div class="need-info">
                <h3 class="need-title">${need.title}</h3>
                <span class="need-category">${formatCategory(need.category)}</span>
                <p class="need-description">${need.description}</p>
                ${budgetInfo}
                <p class="meta">Posted by ${need.user} on ${need.date} • ${need.responses} responses</p>
                <button class="view-btn">View Details</button>
                <button class="contact-btn">Make an Offer</button>
            </div>
        `;
        
        needsContainer.appendChild(needCard);
    });
}

// Update impact stats display
function updateImpactStats() {
    impactElements.devicesRescued.textContent = impactStats.devicesRescued.toLocaleString();
    impactElements.ewasteDiverted.textContent = impactStats.ewasteDiverted.toLocaleString();
    impactElements.transactions.textContent = impactStats.transactions.toLocaleString();
}

// Format condition for display
function formatCondition(condition) {
    const conditionMap = {
        'new': 'New',
        'refurbished': 'Refurbished',
        'used': 'Used - Good',
        'used-fair': 'Used - Fair',
        'for-parts': 'For Parts/Repair'
    };
    return conditionMap[condition] || condition;
}

// Format category for display
function formatCategory(category) {
    const categoryMap = {
        'laptops': 'Laptop',
        'phones': 'Phone',
        'tablets': 'Tablet',
        'components': 'Component'
    };
    return categoryMap[category] || category;
}

// Setup event listeners
function setupEventListeners() {
    // Filter products
    categoryFilter.addEventListener('change', () => {
        renderProducts(categoryFilter.value, conditionFilter.value);
    });
    
    conditionFilter.addEventListener('change', () => {
        renderProducts(categoryFilter.value, conditionFilter.value);
    });
    
    // Modal controls
    postNeedBtn.addEventListener('click', () => {
        // Check if user is logged in before allowing posting
        if (!currentUser) {
            alert('Please log in to post your needs');
            window.location.href = 'login.html';
            return;
        }
        postFormModal.style.display = 'block';
    });
    
    sellItemBtn.addEventListener('click', () => {
        // Check if user is logged in before allowing selling
        if (!currentUser) {
            alert('Please log in to list items for sale');
            window.location.href = 'login.html';
            return;
        }
        sellerFormModal.style.display = 'block';
    });
    
    closeFormButtons.forEach(button => {
        button.addEventListener('click', () => {
            postFormModal.style.display = 'none';
            sellerFormModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === postFormModal) {
            postFormModal.style.display = 'none';
        }
        if (e.target === sellerFormModal) {
            sellerFormModal.style.display = 'none';
        }
    });
    
    // Form submissions
    needForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitNewNeed();
    });
    
    sellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitNewProduct();
    });
}

// Submit new need
function submitNewNeed() {
    const newNeed = {
        id: needs.length + 1,
        title: document.getElementById('need-title').value,
        category: document.getElementById('need-category').value,
        description: document.getElementById('need-description').value,
        budget: document.getElementById('need-budget').value ? 
               parseFloat(document.getElementById('need-budget').value) : null,
        user: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        responses: 0
    };
    
    needs.unshift(newNeed);
    renderNeeds();
    postFormModal.style.display = 'none';
    needForm.reset();
    
    // Show confirmation
    alert('Your need has been posted successfully! Sellers can now respond to your request.');
}

// Submit new product
function submitNewProduct() {
    // Get form values
    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productCondition = document.getElementById('product-condition').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);

    // Basic validation
    if (!productName || !productCategory || !productCondition || !productDescription || isNaN(productPrice)) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    // Create new product object
    const newProduct = {
        id: products.length + 1,
        title: productName,
        category: productCategory,
        condition: productCondition,
        description: productDescription,
        price: productPrice,
        images: [], // Initialize empty array for images
        seller: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'New Seller',
        date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };

    // Handle image uploads if implemented
    const imageInput = document.getElementById('product-images');
    if (imageInput.files.length > 0) {
        // In a real app, you would upload images to a server here
        // For demo purposes, we'll just store the filenames
        for (let i = 0; i < imageInput.files.length; i++) {
            newProduct.images.push(imageInput.files[i].name);
        }
    } else {
        // Fallback to placeholder if no images
        newProduct.images.push(`https://via.placeholder.com/300x200?text=${encodeURIComponent(productName)}`);
    }

    // Add to products array
    products.unshift(newProduct);

    // Update UI
    renderProducts();
    document.getElementById('seller-form-modal').style.display = 'none';
    document.getElementById('seller-form').reset();

    // Update impact stats
    impactStats.devicesRescued += 1;
    impactStats.ewasteDiverted += 2; // Approx 2kg per device
    updateImpactStats();

    // Show confirmation
    alert('Your product has been listed successfully!');
}

// Remove user count display elements
function removeUserCountDisplay() {
    // Remove from impact section if it exists
    const usersCountElement = document.getElementById('users-count');
    if (usersCountElement) {
        const statElement = usersCountElement.closest('.stat');
        if (statElement && statElement.parentNode) {
            statElement.parentNode.removeChild(statElement);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);