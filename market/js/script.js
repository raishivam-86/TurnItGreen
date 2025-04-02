// Sample Data
const sampleProducts = [
    {
        id: 1,
        title: "Refurbished MacBook Pro 2019",
        category: "laptops",
        condition: "refurbished",
        description: "Fully refurbished with new battery and 1-year warranty. 16GB RAM, 512GB SSD.",
        price: 899.99,
        images: ["macbook.jpg"],
        seller: "GreenTech Refurbs",
        date: "2023-05-15"
    },
    {
        id: 2,
        title: "iPhone 11 - Used Good Condition",
        category: "phones",
        condition: "used",
        description: "Excellent condition with 85% battery health. Includes original box and charger.",
        price: 249.99,
        images: ["iphone11.jpg"],
        seller: "PhoneCycle",
        date: "2023-05-18"
    },
    {
        id: 3,
        title: "Samsung Galaxy Tab S6 for Parts",
        category: "tablets",
        condition: "for-parts",
        description: "Screen cracked but motherboard and battery in working condition.",
        price: 75.00,
        images: ["galaxy-tab.jpg"],
        seller: "E-Waste Solutions",
        date: "2023-05-20"
    }
];

const sampleNeeds = [
    {
        id: 1,
        title: "Need: Affordable Laptop for Online Classes",
        category: "laptops",
        description: "Looking for a reliable laptop for my daughter's school work. Budget around $300.",
        budget: 300,
        user: "Parent123",
        date: "2023-05-16",
        responses: 3
    },
    {
        id: 2,
        title: "Seeking iPhone 8 or Similar",
        category: "phones",
        description: "Need a basic smartphone for my elderly mother. Must have good battery life.",
        budget: 150,
        user: "CareGiver22",
        date: "2023-05-19",
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
const impactElements = {
    devicesRescued: document.getElementById('devices-rescued'),
    ewasteDiverted: document.getElementById('ewaste-diverted'),
    transactions: document.getElementById('transactions')
};

// Initialize the page
function init() {
    renderProducts();
    renderNeeds();
    updateImpactStats();
    setupEventListeners();
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
        
        productCard.innerHTML = `
            <img src="https://via.placeholder.com/300x200?text=${product.title.split(' ').join('+')}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-condition">${formatCondition(product.condition)}</span>
                <p class="product-price">$${product.price.toFixed(2)}</p>
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
        
        const budgetInfo = need.budget ? `<p><strong>Budget:</strong> $${need.budget}</p>` : '';
        
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
        postFormModal.style.display = 'block';
    });
    
    sellItemBtn.addEventListener('click', () => {
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
        user: currentUser || 'Anonymous',
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
    const newProduct = {
        id: products.length + 1,
        title: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        condition: document.getElementById('product-condition').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        images: [], // Would handle file upload in real implementation
        seller: currentUser || 'New Seller',
        date: new Date().toISOString().split('T')[0]
    };
    
    products.unshift(newProduct);
    renderProducts();
    sellerFormModal.style.display = 'none';
    sellerForm.reset();
    
    // Update impact stats
    impactStats.devicesRescued += 1;
    impactStats.ewasteDiverted += 2; // Approx 2kg per device
    updateImpactStats();
    
    // Show confirmation
    alert('Your product has been listed successfully!');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);