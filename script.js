// ================================
// FIREBASE INITIALIZATION
// ================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWfh7DHNb4Pn7cbquYUNRDK65zcxl5u04",
  authDomain: "caresathiqr-55ae5.firebaseapp.com",
  projectId: "caresathiqr-55ae5",
  storageBucket: "caresathiqr-55ae5.firebasestorage.app",
  messagingSenderId: "899952960842",
  appId: "1:899952960842:web:81df701eb54c1255794db3",
  measurementId: "G-S76S4KDYCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ================================
// FIREBASE HELPER FUNCTIONS
// ================================

let currentUser = null;
/**
 * Save form data to Firestore
 * @param {string} collectionName - Firestore collection name
 * @param {object} data - Data to save
 * @returns {string} - Document ID
 */
async function saveForm(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    throw error;
  }
}

// ================================
// AUTHENTICATION FUNCTIONS
// ================================
/**
 * Show authentication modal (login or signup)
 * @param {string} type - 'login' or 'signup'
 */
function showAuthModal(type) {
  const nav2=document.getElementById("nav2");
  const modal = document.getElementById("auth-modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
if (nav2) nav2.style.zIndex = "-2"; // ✅ SAFE

  if (type === "login") {
    switchToLogin();
  } else {
    switchToSignup();
  }
}

window.logout = async function () {
  await signOut(auth);
};




document.addEventListener("DOMContentLoaded", () => {

  onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");

    if (!loginBtn || !signupBtn || !userInfo || !userName) {
      console.warn("Auth UI elements missing in DOM");
      return;
    }

    if (user) {
      currentUser = user;

      loginBtn.style.display = "none";
      signupBtn.style.display = "none";

      userInfo.style.display = "flex";
      userName.textContent = `Hi, ${user.displayName || user.email}`;

    } else {
      currentUser = null;

      loginBtn.style.display = "inline-block";
      signupBtn.style.display = "inline-block";

      userInfo.style.display = "none";

      console.log("User not logged in");
    }
  });

});



/**
 * Close authentication modal
 */
function closeAuthModal() {
  const nav2=document.getElementById("nav2");
  const modal = document.getElementById("auth-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
if (nav2) nav2.style.zIndex = "-2"; // ✅ SAFE
}

/**
 * Switch to login form
 */
function switchToLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
}

/**
 * Switch to signup form
 */
function switchToSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.querySelector('input[type="text"]').value;
  const password = form.querySelector('input[type="password"]').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('=== LOGIN SUCCESSFUL ===');
    
    alert('Welcome back, ' + user.email + '!');
    closeAuthModal();
    form.reset();
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
}

/**
 * Handle signup form submission
 * @param {Event} event - Form submit event
 */
async function handleSignup(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelectorAll('input[type="password"]')[0].value;
  const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

  // Validate passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('=== SIGNUP SUCCESSFUL ===');
    console.log('=========================');
    
    alert('Account created successfully! Welcome, ' + user.email);
    closeAuthModal();
    form.reset();
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed: ' + error.message);
  }
}

/**
 * Handle Google Sign-In
 */
async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log('=== GOOGLE LOGIN SUCCESSFUL ===');
    console.log('User:', user.displayName, user.email);
    console.log('================================');

    closeAuthModal();
    alert('Welcome, ' + user.displayName + '!');
  } catch (error) {
    console.error('Google login error:', error);
    alert('Google login failed: ' + error.message);
  }
}

// ================================
// NAVIGATION FUNCTIONS
// ================================

/**
 * Show the selected form and hide homepage
 * @param {string} formType - Type of form to display ('pet', 'elder', 'vehicle')
 */
function showForm(formType) {

  // 🔒 AUTH GUARD
  if (!currentUser) {
    alert("Please login or signup first to continue");
    showAuthModal("login");
    return;
  }

  const homepage = document.getElementById('homepage');
  homepage.classList.remove('active');

  const allForms = document.querySelectorAll('.form-section');
  allForms.forEach(form => form.classList.remove('active'));

  const selectedForm = document.getElementById(`${formType}-form`);
  if (selectedForm) {
    selectedForm.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


/**
 * Navigate back to homepage from any form
 */
function goBack() {
  // Hide all forms
  const allForms = document.querySelectorAll('.form-section');
  allForms.forEach(form => {
    form.classList.remove('active');
  });

  // Show homepage
  const homepage = document.getElementById('homepage');
  homepage.classList.add('active');

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// FORM SUBMISSION HANDLERS
// ================================

/**
 * Handle Pet Form Submission
 * @param {Event} event - Form submit event
 */
async function handlePetSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('petForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const petData = {};

  formData.forEach((value, key) => {
    petData[key] = value;
  });

  petData.formType = "PET";
  petData.userId = currentUser.uid;
  petData.userEmail = currentUser.email;


  try {
    const docId = await saveForm("petQR", petData);

    const qrLink = `https://yoursite.com/view.html?id=${docId}`;
    
    console.log('=== PET INFORMATION SAVED ===');
    console.log('Document ID:', docId);
    console.log('QR Link:', qrLink);
    console.log('Data:', petData);
    console.log('============================');

    showSuccessModal();
    setTimeout(() => {
      form.reset();
    }, 500);
  } catch (error) {
    console.error('Error saving pet data:', error);
    alert('Error saving data. Please try again.');
  }
}

/**
 * Handle Elder Form Submission
 * @param {Event} event - Form submit event
 */
async function handleElderSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('elderForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const elderData = {};

  formData.forEach((value, key) => {
    elderData[key] = value;
  });

  elderData.formType = "ELDER";
  elderData.userId = currentUser.uid;
  elderData.userEmail = currentUser.email;


  try {
    const docId = await saveForm("elderQR", elderData);

    const qrLink = `https://yoursite.com/view.html?id=${docId}`;
    
    console.log('=== ELDER INFORMATION SAVED ===');
    console.log('Document ID:', docId);
    console.log('QR Link:', qrLink);
    console.log('Data:', elderData);
    console.log('===============================');

    showSuccessModal();
    setTimeout(() => {
      form.reset();
    }, 500);
  } catch (error) {
    console.error('Error saving elder data:', error);
    alert('Error saving data. Please try again.');
  }
}

/**
 * Handle Vehicle Form Submission
 * @param {Event} event - Form submit event
 */
async function handleVehicleSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('vehicleForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const vehicleData = {};

  formData.forEach((value, key) => {
    vehicleData[key] = value;
  });

  // Auto-uppercase vehicle number
  if (vehicleData.vehicleNumber) {
    vehicleData.vehicleNumber = vehicleData.vehicleNumber.toUpperCase();
  }
  
  vehicleData.formType = "VEHICLE";
  vehicleData.userId = currentUser.uid;
  vehicleData.userEmail = currentUser.email;


  try {
    const docId = await saveForm("vehicleQR", vehicleData);

    const qrLink = `https://yoursite.com/view.html?id=${docId}`;
    
    console.log('=== VEHICLE INFORMATION SAVED ===');
    console.log('Document ID:', docId);
    console.log('QR Link:', qrLink);
    console.log('Data:', vehicleData);
    console.log('=================================');

    showSuccessModal();
    setTimeout(() => {
      form.reset();
    }, 500);
  } catch (error) {
    console.error('Error saving vehicle data:', error);
    alert('Error saving data. Please try again.');
  }
}

// ================================
// MODAL FUNCTIONS
// ================================

/**
 * Show success modal after form submission
 */
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close success modal and return to homepage
 */
function closeModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  goBack();
}

// ================================
// REAL-TIME INPUT VALIDATION
// ================================

/**
 * Initialize real-time validation for phone numbers
 */
function initializePhoneValidation() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '');
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  });
}

/**
 * Initialize real-time validation for vehicle number
 */
function initializeVehicleNumberValidation() {
  const vehicleNumberInput = document.getElementById('vehicle-number');

  if (vehicleNumberInput) {
    vehicleNumberInput.addEventListener('input', function(e) {
      this.value = this.value.toUpperCase();
    });
  }
}

/**
 * Initialize real-time validation for age
 */
function initializeAgeValidation() {
  const ageInput = document.getElementById('age');

  if (ageInput) {
    ageInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '');
      const age = parseInt(this.value);
      if (age > 120) {
        this.value = '120';
      }
    });
  }
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Smooth scroll to any section
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
  
  if (navMenu.style.display === 'flex') {
    navMenu.style.position = 'absolute';
    navMenu.style.top = '100%';
    navMenu.style.left = '0';
    navMenu.style.right = '0';
    navMenu.style.flexDirection = 'column';
    navMenu.style.background = 'rgba(10, 36, 99, 0.98)';
    navMenu.style.padding = '20px';
    navMenu.style.gap = '10px';
  }
}

/**
 * Add smooth scrolling to all anchor links
 */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}


document.getElementById("loginBtn")?.addEventListener("click", () => {
  showAuthModal("login");
});

document.getElementById("signupBtn")?.addEventListener("click", () => {
  showAuthModal("signup");
});

/**
 * Close modal when clicking outside of it
 */
function initializeModalClickOutside() {
  const modal = document.getElementById('success-modal');
  const authModal = document.getElementById('auth-modal');

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  authModal.addEventListener('click', function(e) {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}

/**
 * Handle keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const successModal = document.getElementById('success-modal');
      const authModal = document.getElementById('auth-modal');
      
      if (successModal.classList.contains('active')) {
        closeModal();
      }
      if (authModal.classList.contains('active')) {
        closeAuthModal();
      }
    }
  });
}

/**
 * Add loading animation to submit buttons
 */
function initializeSubmitButtonAnimation() {
  const submitButtons = document.querySelectorAll('.submit-btn');

  submitButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.style.opacity = '0.7';
      this.style.cursor = 'not-allowed';

      setTimeout(() => {
        this.style.opacity = '1';
        this.style.cursor = 'pointer';
      }, 300);
    });
  });
}

/**
 * Auto-save form data to localStorage
 */
function initializeAutoSave() {
  const forms = ['petForm', 'elderForm', 'vehicleForm'];

  forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (!form) return;

    loadFormData(formId);

    form.addEventListener('input', function() {
      saveFormData(formId);
    });
  });
}

/**
 * Save form data to localStorage
 */
function saveFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  localStorage.setItem(`caresathiqr_${formId}`, JSON.stringify(data));
}

/**
 * Load saved form data from localStorage
 */
function loadFormData(formId) {
  const savedData = localStorage.getItem(`caresathiqr_${formId}`);
  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);
    const form = document.getElementById(formId);

    Object.keys(data).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = data[key];
      }
    });
  } catch (e) {
    console.error('Error loading saved form data:', e);
  }
}

/**
 * Clear saved form data from localStorage
 */
function clearFormData(formId) {
  localStorage.removeItem(`caresathiqr_${formId}`);
}

/**
 * Highlight active navigation link on scroll
 */
function initializeNavHighlight() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.features-section, .how-it-works-section, .pricing-section, .contact-section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ================================
// INITIALIZATION
// ================================

/**
 * Initialize all features when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('CareSathiQR System Initialized');
  console.log('Version: 3.0 - Firebase Integrated');
  console.log('© 2024 CareSathiQR - Emergency Information System');

  // Show homepage by default
  const homepage = document.getElementById('homepage');
  homepage.classList.add('active');

  // Initialize all validations and features
  initializePhoneValidation();
  initializeVehicleNumberValidation();
  initializeAgeValidation();
  initializeSmoothScrolling();
  initializeModalClickOutside();
  initializeKeyboardShortcuts();
  initializeSubmitButtonAnimation();
  initializeAutoSave();
  initializeNavHighlight();

  console.log('All features initialized successfully');
  console.log('Firebase connected and ready');
});

// ================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ================================
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchToLogin = switchToLogin;
window.switchToSignup = switchToSignup;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.googleLogin = googleLogin;

window.showForm = showForm;
window.goBack = goBack;
window.handlePetSubmit = handlePetSubmit;
window.handleElderSubmit = handleElderSubmit;
window.handleVehicleSubmit = handleVehicleSubmit;
window.closeModal = closeModal;

// ================================
// CONSOLE WELCOME MESSAGE
// ================================

console.log('%c🚀 CareSathiQR System Ready', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cFirebase & Google Auth Enabled', 'color: #84cc16; font-size: 14px; font-weight: bold;');
console.log('%cOpen DevTools Console to see form submissions', 'color: #3b82f6; font-size: 12px;');
