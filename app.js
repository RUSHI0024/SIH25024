// Application State
const AppState = {
    currentSection: 'dashboard',
    currentModal: null,
    selectedPatient: null,
    selectedMeal: null,
    dietPlan: {},
    patients: [],
    foods: [],
    recipes: [],
    loading: false
};

// Sample Data
const sampleData = {
    foods: [
        {
            id: 1,
            name: "Basmati Rice",
            category: "Grains",
            calories_per_100g: 345,
            protein: 7.1,
            carbohydrates: 78.2,
            fat: 0.6,
            fiber: 1.3,
            ayurvedic_properties: {
                rasa: ["Madhura (Sweet)"],
                guna: ["Guru (Heavy)", "Snigdha (Oily)"],
                virya: "Shita (Cooling)",
                vipaka: "Madhura (Sweet)",
                dosha_effect: "Increases Kapha, Decreases Vata+Pitta"
            },
            seasonal: "All seasons",
            constitution_rating: { vata: 5, pitta: 5, kapha: 3 }
        },
        {
            id: 2,
            name: "Ginger (Fresh)",
            category: "Spices",
            calories_per_100g: 80,
            protein: 1.8,
            carbohydrates: 17.8,
            fat: 0.8,
            fiber: 2.0,
            ayurvedic_properties: {
                rasa: ["Katu (Pungent)"],
                guna: ["Laghu (Light)", "Snigdha (Oily)"],
                virya: "Ushna (Heating)",
                vipaka: "Madhura (Sweet)",
                dosha_effect: "Increases Pitta, Decreases Vata+Kapha"
            },
            seasonal: "Winter, Monsoon",
            constitution_rating: { vata: 5, pitta: 2, kapha: 5 }
        },
        {
            id: 3,
            name: "Spinach",
            category: "Vegetables",
            calories_per_100g: 23,
            protein: 2.9,
            carbohydrates: 3.6,
            fat: 0.4,
            fiber: 2.2,
            ayurvedic_properties: {
                rasa: ["Tikta (Bitter)", "Kashaya (Astringent)"],
                guna: ["Laghu (Light)", "Ruksha (Dry)"],
                virya: "Shita (Cooling)",
                vipaka: "Katu (Pungent)",
                dosha_effect: "Increases Vata, Decreases Pitta+Kapha"
            },
            seasonal: "Winter, Spring",
            constitution_rating: { vata: 3, pitta: 5, kapha: 4 }
        },
        {
            id: 4,
            name: "Ghee",
            category: "Dairy",
            calories_per_100g: 900,
            protein: 0,
            carbohydrates: 0,
            fat: 100,
            fiber: 0,
            ayurvedic_properties: {
                rasa: ["Madhura (Sweet)"],
                guna: ["Guru (Heavy)", "Snigdha (Oily)"],
                virya: "Shita (Cooling)",
                vipaka: "Madhura (Sweet)",
                dosha_effect: "Increases Kapha, Decreases Vata+Pitta"
            },
            seasonal: "All seasons",
            constitution_rating: { vata: 5, pitta: 5, kapha: 2 }
        },
        {
            id: 5,
            name: "Mung Dal",
            category: "Legumes",
            calories_per_100g: 347,
            protein: 24.0,
            carbohydrates: 59.0,
            fat: 1.2,
            fiber: 16.3,
            ayurvedic_properties: {
                rasa: ["Madhura (Sweet)", "Kashaya (Astringent)"],
                guna: ["Laghu (Light)", "Ruksha (Dry)"],
                virya: "Shita (Cooling)",
                vipaka: "Madhura (Sweet)",
                dosha_effect: "Balances all doshas"
            },
            seasonal: "All seasons",
            constitution_rating: { vata: 4, pitta: 5, kapha: 4 }
        }
    ],
    patients: [
        {
            id: 1,
            name: "Priya Sharma",
            age: 34,
            gender: "Female",
            prakriti: "Pitta-Vata",
            vikriti: "Pitta aggravated",
            contact: "9876543210",
            allergies: ["Dairy", "Nuts"],
            medical_history: "Gastritis, Anxiety",
            lifestyle_factors: {
                sleep: "6-7 hours",
                exercise: "Moderate yoga",
                stress_level: "High",
                occupation: "Software Engineer"
            },
            last_consultation: "2025-09-15"
        },
        {
            id: 2,
            name: "Rajesh Kumar",
            age: 42,
            gender: "Male",
            prakriti: "Kapha-Pitta",
            vikriti: "Kapha excess",
            contact: "9123456789",
            allergies: [],
            medical_history: "Diabetes Type 2, High Cholesterol",
            lifestyle_factors: {
                sleep: "7-8 hours",
                exercise: "Walking",
                stress_level: "Moderate",
                occupation: "Business Owner"
            },
            last_consultation: "2025-09-18"
        }
    ],
    recipes: [
        {
            id: 1,
            name: "Kitchari (Mung Dal Rice)",
            ingredients: [
                {food_id: 1, quantity: 100, unit: "g"},
                {food_id: 5, quantity: 100, unit: "g"},
                {food_id: 2, quantity: 10, unit: "g"},
                {food_id: 4, quantity: 15, unit: "g"}
            ],
            instructions: "Wash rice and dal. Heat ghee, add ginger. Add rice and dal with water. Cook until soft.",
            constitution_rating: { vata: 5, pitta: 4, kapha: 4 },
            category: "Main Course"
        }
    ]
};

// Global functions (define early)
window.viewPatient = function(patientId) {
    console.log('Viewing patient:', patientId);
    const patient = AppState.patients.find(p => p.id === patientId);
    if (patient) {
        console.log('Patient details:', patient);
        if (AppState.currentSection !== 'patients') {
            navigateToSection('patients');
        }
    }
};

window.addFoodToMeal = function(foodId) {
    console.log('Adding food to meal:', foodId, AppState.selectedMeal);
    const food = AppState.foods.find(f => f.id === foodId);
    if (!food || !AppState.selectedMeal) return;
    
    const mealItem = {
        food: food,
        quantity: 100,
        unit: 'g'
    };
    
    if (!AppState.dietPlan[AppState.selectedMeal]) {
        AppState.dietPlan[AppState.selectedMeal] = [];
    }
    
    AppState.dietPlan[AppState.selectedMeal].push(mealItem);
    renderMealItems(AppState.selectedMeal);
    updateNutritionPanel();
    hideModal('food-selection-modal');
};

window.removeMealItem = function(mealType, index) {
    console.log('Removing meal item:', mealType, index);
    if (AppState.dietPlan[mealType]) {
        AppState.dietPlan[mealType].splice(index, 1);
        renderMealItems(mealType);
        updateNutritionPanel();
    }
};

// Navigation function
function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    try {
        // Hide all sections
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section activated:', sectionId);
        } else {
            console.error('Section not found:', sectionId);
            return;
        }

        // Update navigation buttons
        const allNavBtns = document.querySelectorAll('.nav-btn');
        allNavBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        AppState.currentSection = sectionId;

        // Render section content
        switch(sectionId) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'patients':
                renderPatients();
                break;
            case 'food-database':
                renderFoodDatabase();
                break;
            case 'diet-plans':
                renderDietPlans();
                break;
            case 'recipes':
                renderRecipes();
                break;
            case 'reports':
                renderReports();
                break;
        }
    } catch (error) {
        console.error('Error navigating to section:', error);
    }
}

// Modal functions
function showModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        AppState.currentModal = modalId;
    }
}

function hideModal(modalId) {
    console.log('Hiding modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        AppState.currentModal = null;
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    try {
        initializeApp();
        setupEventListeners();
        renderDashboard();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

function initializeApp() {
    console.log('Initializing app state...');
    AppState.patients = [...sampleData.patients];
    AppState.foods = [...sampleData.foods];
    AppState.recipes = [...sampleData.recipes];
    
    // Initialize diet plan
    AppState.dietPlan = {
        early_morning: [],
        breakfast: [],
        mid_morning: [],
        lunch: [],
        evening: [],
        dinner: []
    };
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    try {
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log('Found nav buttons:', navButtons.length);
        
        navButtons.forEach((btn, index) => {
            console.log(`Setting up listener for nav button ${index}:`, btn.dataset.section);
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const section = this.dataset.section;
                console.log('Nav button clicked:', section);
                navigateToSection(section);
            });
        });

        // Quick actions in sidebar
        setupQuickActions();
        
        // Patient management
        setupPatientManagement();
        
        // Search and filters
        setupSearchAndFilters();
        
        // Diet plan functionality
        setupDietPlanFunctionality();
        
        // Modal functionality
        setupModals();
        
        console.log('All event listeners set up successfully');
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function setupQuickActions() {
    const addPatientQuick = document.getElementById('add-patient-quick');
    const createDietPlanQuick = document.getElementById('create-diet-plan-quick');
    const searchFoodQuick = document.getElementById('search-food-quick');
    
    if (addPatientQuick) {
        addPatientQuick.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add patient quick clicked');
            showModal('add-patient-modal');
        });
    }
    
    if (createDietPlanQuick) {
        createDietPlanQuick.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Create diet plan quick clicked');
            navigateToSection('diet-plans');
        });
    }
    
    if (searchFoodQuick) {
        searchFoodQuick.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Search food quick clicked');
            navigateToSection('food-database');
        });
    }
}

function setupPatientManagement() {
    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add patient button clicked');
            showModal('add-patient-modal');
        });
    }
    
    const patientForm = document.getElementById('patient-form');
    if (patientForm) {
        patientForm.addEventListener('submit', handleAddPatient);
    }
    
    const closePatientModal = document.getElementById('close-patient-modal');
    if (closePatientModal) {
        closePatientModal.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('add-patient-modal');
        });
    }
    
    const cancelPatient = document.getElementById('cancel-patient');
    if (cancelPatient) {
        cancelPatient.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('add-patient-modal');
        });
    }
}

function setupSearchAndFilters() {
    const patientSearch = document.getElementById('patient-search');
    const constitutionFilter = document.getElementById('constitution-filter');
    const foodSearch = document.getElementById('food-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (patientSearch) patientSearch.addEventListener('input', filterPatients);
    if (constitutionFilter) constitutionFilter.addEventListener('change', filterPatients);
    if (foodSearch) foodSearch.addEventListener('input', filterFoods);
    if (categoryFilter) categoryFilter.addEventListener('change', filterFoods);
}

function setupDietPlanFunctionality() {
    const patientSelect = document.getElementById('patient-select');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    
    if (patientSelect) patientSelect.addEventListener('change', handlePatientSelect);
    if (generatePlanBtn) generatePlanBtn.addEventListener('click', generateDietPlan);
}

function setupModals() {
    const closeFoodSelection = document.getElementById('close-food-selection');
    const foodSearchModal = document.getElementById('food-search-modal');
    
    if (closeFoodSelection) {
        closeFoodSelection.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal('food-selection-modal');
        });
    }
    
    if (foodSearchModal) {
        foodSearchModal.addEventListener('input', filterFoodSelection);
    }

    // Modal backdrop clicks
    document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function(e) {
            const modal = e.target.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
}

// Dashboard Functions
function renderDashboard() {
    console.log('Rendering dashboard...');
    try {
        renderRecentPatients();
        setTimeout(() => {
            renderConstitutionChart();
        }, 100);
    } catch (error) {
        console.error('Error rendering dashboard:', error);
    }
}

function renderRecentPatients() {
    const container = document.getElementById('recent-patients');
    if (!container) {
        console.error('Recent patients container not found');
        return;
    }
    
    const recentPatients = AppState.patients.slice(-3);

    container.innerHTML = recentPatients.map(patient => `
        <div class="patient-item" onclick="viewPatient(${patient.id})">
            <div class="patient-info">
                <h4>${patient.name}</h4>
                <p>${patient.age} years • ${patient.prakriti}</p>
            </div>
            <span class="status status--${getStatusColor(patient.vikriti)}">${patient.vikriti}</span>
        </div>
    `).join('');
}

function renderConstitutionChart() {
    const canvas = document.getElementById('constitution-chart');
    if (!canvas) {
        console.error('Constitution chart canvas not found');
        return;
    }
    
    try {
        const ctx = canvas.getContext('2d');
        
        const constitutionData = AppState.patients.reduce((acc, patient) => {
            const constitution = patient.prakriti;
            acc[constitution] = (acc[constitution] || 0) + 1;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(constitutionData),
                datasets: [{
                    data: Object.values(constitutionData),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error rendering constitution chart:', error);
    }
}

// Patient Management Functions
function renderPatients() {
    console.log('Rendering patients section...');
    try {
        populatePatientSelect();
        displayPatients(AppState.patients);
    } catch (error) {
        console.error('Error rendering patients:', error);
    }
}

function displayPatients(patients) {
    const container = document.getElementById('patients-grid');
    if (!container) {
        console.error('Patients grid container not found');
        return;
    }
    
    container.innerHTML = patients.map(patient => `
        <div class="patient-card" onclick="viewPatient(${patient.id})">
            <h3>${patient.name}</h3>
            <span class="status status--${getStatusColor(patient.vikriti)}">${patient.vikriti}</span>
            <p><strong>Age:</strong> ${patient.age} years</p>
            <p><strong>Constitution:</strong> ${patient.prakriti}</p>
            <p><strong>Contact:</strong> ${patient.contact}</p>
            <p><strong>Last Visit:</strong> ${patient.last_consultation}</p>
        </div>
    `).join('');
}

function handleAddPatient(e) {
    e.preventDefault();
    console.log('Adding new patient...');
    
    try {
        const formData = new FormData(e.target);
        const patientData = {
            id: AppState.patients.length + 1,
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            contact: formData.get('contact'),
            prakriti: formData.get('prakriti'),
            vikriti: formData.get('vikriti'),
            allergies: formData.get('allergies') ? formData.get('allergies').split(',').map(s => s.trim()) : [],
            medical_history: formData.get('medical_history') || '',
            last_consultation: new Date().toISOString().split('T')[0]
        };

        AppState.patients.push(patientData);
        
        hideModal('add-patient-modal');
        e.target.reset();
        
        if (AppState.currentSection === 'patients') {
            renderPatients();
        }
        
        updateRecentActivity(`New patient ${patientData.name} added`);
        
        if (AppState.currentSection === 'dashboard') {
            renderRecentPatients();
        }
    } catch (error) {
        console.error('Error adding patient:', error);
    }
}

function filterPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    const constitutionFilter = document.getElementById('constitution-filter').value;
    
    let filtered = AppState.patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm) ||
                            patient.contact.includes(searchTerm);
        const matchesConstitution = !constitutionFilter || patient.prakriti.includes(constitutionFilter);
        
        return matchesSearch && matchesConstitution;
    });
    
    displayPatients(filtered);
}

// Food Database Functions
function renderFoodDatabase() {
    console.log('Rendering food database...');
    try {
        displayFoods(AppState.foods);
    } catch (error) {
        console.error('Error rendering food database:', error);
    }
}

function displayFoods(foods) {
    const container = document.getElementById('foods-grid');
    if (!container) {
        console.error('Foods grid container not found');
        return;
    }
    
    container.innerHTML = foods.map(food => `
        <div class="food-card">
            <div class="food-card__header">
                <h3>${food.name}</h3>
                <span class="food-category">${food.category}</span>
            </div>
            <div class="food-card__body">
                <div class="nutrition-info">
                    <div class="nutrition-item">
                        <span>Calories:</span>
                        <span>${food.calories_per_100g}/100g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Protein:</span>
                        <span>${food.protein}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Carbs:</span>
                        <span>${food.carbohydrates}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span>Fat:</span>
                        <span>${food.fat}g</span>
                    </div>
                </div>
                
                <div class="ayurvedic-properties">
                    <h4>Ayurvedic Properties</h4>
                    <div class="property-tags">
                        ${food.ayurvedic_properties.rasa.map(r => `<span class="property-tag">${r}</span>`).join('')}
                    </div>
                    <p style="font-size: 12px; margin-top: 8px; color: var(--color-text-secondary);">
                        ${food.ayurvedic_properties.dosha_effect}
                    </p>
                </div>
                
                <div class="dosha-ratings">
                    <div class="dosha-rating">
                        <span>Vata</span>
                        <div class="rating-stars">${'★'.repeat(food.constitution_rating.vata)}</div>
                    </div>
                    <div class="dosha-rating">
                        <span>Pitta</span>
                        <div class="rating-stars">${'★'.repeat(food.constitution_rating.pitta)}</div>
                    </div>
                    <div class="dosha-rating">
                        <span>Kapha</span>
                        <div class="rating-stars">${'★'.repeat(food.constitution_rating.kapha)}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterFoods() {
    const searchTerm = document.getElementById('food-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filtered = AppState.foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || food.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayFoods(filtered);
}

// Diet Plan Functions
function renderDietPlans() {
    console.log('Rendering diet plans...');
    try {
        populatePatientSelect();
        initializeDietPlan();
        setupMealButtons();
    } catch (error) {
        console.error('Error rendering diet plans:', error);
    }
}

function setupMealButtons() {
    document.querySelectorAll('.add-food-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add food button clicked for meal:', this.dataset.meal);
            AppState.selectedMeal = this.dataset.meal;
            showFoodSelection();
        });
    });
}

function populatePatientSelect() {
    const select = document.getElementById('patient-select');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Patient</option>' +
        AppState.patients.map(patient => 
            `<option value="${patient.id}">${patient.name} (${patient.prakriti})</option>`
        ).join('');
}

function handlePatientSelect() {
    const patientId = parseInt(document.getElementById('patient-select').value);
    const patient = AppState.patients.find(p => p.id === patientId);
    
    console.log('Patient selected:', patient);
    AppState.selectedPatient = patient;
    
    if (patient) {
        displaySelectedPatientInfo(patient);
        initializeDietPlan();
    }
}

function displaySelectedPatientInfo(patient) {
    const container = document.getElementById('selected-patient-info');
    if (!container) return;
    
    container.innerHTML = `
        <h3>${patient.name}</h3>
        <p><strong>Constitution:</strong> ${patient.prakriti} | <strong>Current Status:</strong> ${patient.vikriti}</p>
        <p><strong>Allergies:</strong> ${patient.allergies.join(', ') || 'None'}</p>
        <p><strong>Medical History:</strong> ${patient.medical_history || 'None'}</p>
    `;
}

function initializeDietPlan() {
    console.log('Initializing diet plan...');
    AppState.dietPlan = {
        early_morning: [],
        breakfast: [],
        mid_morning: [],
        lunch: [],
        evening: [],
        dinner: []
    };
    
    updateNutritionPanel();
}

function showFoodSelection() {
    console.log('Showing food selection for meal:', AppState.selectedMeal);
    const container = document.getElementById('food-selection-list');
    
    if (!container) {
        console.error('Food selection list container not found');
        return;
    }
    
    container.innerHTML = AppState.foods.map(food => `
        <div class="food-selection-item" onclick="addFoodToMeal(${food.id})">
            <h4>${food.name}</h4>
            <p>${food.category} • ${food.calories_per_100g} cal/100g</p>
        </div>
    `).join('');
    
    showModal('food-selection-modal');
}

function renderMealItems(mealType) {
    const container = document.querySelector(`.meal-items[data-meal="${mealType}"]`);
    if (!container) return;
    
    const items = AppState.dietPlan[mealType] || [];
    
    container.innerHTML = items.map((item, index) => `
        <div class="meal-item">
            <div class="meal-item-info">
                <div class="meal-item-name">${item.food.name}</div>
                <div class="meal-item-portion">${item.quantity}${item.unit}</div>
            </div>
            <button class="remove-item" onclick="removeMealItem('${mealType}', ${index})">Remove</button>
        </div>
    `).join('');
}

function updateNutritionPanel() {
    let totalNutrition = {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0
    };
    
    let doshaBalance = { vata: 0, pitta: 0, kapha: 0 };
    let totalItems = 0;
    
    Object.values(AppState.dietPlan).forEach(meal => {
        if (meal && Array.isArray(meal)) {
            meal.forEach(item => {
                const multiplier = item.quantity / 100;
                
                totalNutrition.calories += item.food.calories_per_100g * multiplier;
                totalNutrition.protein += item.food.protein * multiplier;
                totalNutrition.carbohydrates += item.food.carbohydrates * multiplier;
                totalNutrition.fat += item.food.fat * multiplier;
                
                doshaBalance.vata += item.food.constitution_rating.vata;
                doshaBalance.pitta += item.food.constitution_rating.pitta;
                doshaBalance.kapha += item.food.constitution_rating.kapha;
                totalItems++;
            });
        }
    });
    
    const caloriesEl = document.getElementById('total-calories');
    const proteinEl = document.getElementById('total-protein');
    const carbsEl = document.getElementById('total-carbs');
    const fatEl = document.getElementById('total-fat');
    
    if (caloriesEl) caloriesEl.textContent = Math.round(totalNutrition.calories);
    if (proteinEl) proteinEl.textContent = Math.round(totalNutrition.protein) + 'g';
    if (carbsEl) carbsEl.textContent = Math.round(totalNutrition.carbohydrates) + 'g';
    if (fatEl) fatEl.textContent = Math.round(totalNutrition.fat) + 'g';
    
    if (totalItems > 0) {
        const avgVata = (doshaBalance.vata / totalItems) * 20;
        const avgPitta = (doshaBalance.pitta / totalItems) * 20;
        const avgKapha = (doshaBalance.kapha / totalItems) * 20;
        
        const vataMeter = document.getElementById('vata-meter');
        const pittaMeter = document.getElementById('pitta-meter');
        const kaphaMeter = document.getElementById('kapha-meter');
        
        if (vataMeter) vataMeter.style.width = avgVata + '%';
        if (pittaMeter) pittaMeter.style.width = avgPitta + '%';
        if (kaphaMeter) kaphaMeter.style.width = avgKapha + '%';
    }
}

function filterFoodSelection() {
    const searchTerm = document.getElementById('food-search-modal').value.toLowerCase();
    const container = document.getElementById('food-selection-list');
    
    const filtered = AppState.foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filtered.map(food => `
        <div class="food-selection-item" onclick="addFoodToMeal(${food.id})">
            <h4>${food.name}</h4>
            <p>${food.category} • ${food.calories_per_100g} cal/100g</p>
        </div>
    `).join('');
}

function generateDietPlan() {
    if (!AppState.selectedPatient) {
        alert('Please select a patient first.');
        return;
    }
    
    console.log('Generating diet plan for:', AppState.selectedPatient.name);
    updateRecentActivity(`Diet plan generated for ${AppState.selectedPatient.name}`);
    alert(`Diet plan generated successfully for ${AppState.selectedPatient.name}!`);
}

// Recipe Functions
function renderRecipes() {
    console.log('Rendering recipes...');
    const container = document.getElementById('recipes-grid');
    if (!container) {
        console.error('Recipes grid container not found');
        return;
    }
    
    container.innerHTML = AppState.recipes.map(recipe => `
        <div class="recipe-card">
            <div class="recipe-card__header">
                <h3>${recipe.name}</h3>
                <span class="food-category">${recipe.category}</span>
            </div>
            <div class="recipe-card__body">
                <div class="recipe-ingredients">
                    <strong>Ingredients:</strong> ${recipe.ingredients.length} items
                </div>
                <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 12px;">
                    ${recipe.instructions}
                </p>
                <div class="dosha-ratings">
                    <div class="dosha-rating">
                        <span>Vata</span>
                        <div class="rating-stars">${'★'.repeat(recipe.constitution_rating.vata)}</div>
                    </div>
                    <div class="dosha-rating">
                        <span>Pitta</span>
                        <div class="rating-stars">${'★'.repeat(recipe.constitution_rating.pitta)}</div>
                    </div>
                    <div class="dosha-rating">
                        <span>Kapha</span>
                        <div class="rating-stars">${'★'.repeat(recipe.constitution_rating.kapha)}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Reports Functions
function renderReports() {
    console.log('Rendering reports...');
    setTimeout(() => {
        try {
            renderProgressChart();
            renderFoodsChart();
        } catch (error) {
            console.error('Error rendering reports:', error);
        }
    }, 100);
}

function renderProgressChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Patient Progress',
                data: [65, 70, 75, 72, 78, 82],
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderColor: '#1FB8CD',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function renderFoodsChart() {
    const canvas = document.getElementById('foods-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Rice', 'Dal', 'Vegetables', 'Fruits', 'Spices'],
            datasets: [{
                label: 'Usage Count',
                data: [45, 38, 52, 28, 65],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Utility Functions
function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'balanced': return 'success';
        case 'vata aggravated': return 'warning';
        case 'pitta aggravated': return 'error';
        case 'kapha excess': return 'info';
        default: return 'info';
    }
}

function updateRecentActivity(activity) {
    const container = document.getElementById('recent-activity');
    if (!container) return;
    
    const newActivity = document.createElement('li');
    newActivity.textContent = activity;
    container.insertBefore(newActivity, container.firstChild);
    
    while (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                navigateToSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                navigateToSection('patients');
                break;
            case '3':
                e.preventDefault();
                navigateToSection('food-database');
                break;
            case 'n':
                e.preventDefault();
                showModal('add-patient-modal');
                break;
        }
    }
    
    if (e.key === 'Escape' && AppState.currentModal) {
        hideModal(AppState.currentModal);
    }
});