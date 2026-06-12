/* ========================================
   SCRIPT.JS - Global JavaScript Functions
   ======================================== */

/**
 * Show alert message
 * @param {string} message - Alert message text
 * @param {string} type - 'success', 'danger', 'warning', 'info'
 * @param {HTMLElement} container - Container element to append alert
 */
function showAlert(message, type = 'info', container = null) {
  if (!container) {
    container = document.getElementById('alertContainer');
  }

  if (!container) return;

  const alertClass = `alert alert-${type} show`;
  const alertHTML = `<div class="${alertClass}">${message}</div>`;
  
  container.innerHTML = alertHTML;

  // Auto remove after 5 seconds
  setTimeout(() => {
    const alert = container.querySelector('.alert');
    if (alert) {
      alert.classList.remove('show');
      setTimeout(() => {
        container.innerHTML = '';
      }, 300);
    }
  }, 5000);
}

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format date to DD/MM/YYYY
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDateShort(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Format time to HH:MM:SS
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
function formatTime(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get month name from month number
 * @param {number} monthNumber - Month number (0-11)
 * @returns {string} Month name
 */
function getMonthName(monthNumber) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthNumber] || '';
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhone(phone) {
  const regex = /^(\+62|0)[0-9]{9,12}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Format currency to Rp format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Format large numbers with separator
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(number) {
  return new Intl.NumberFormat('id-ID').format(number);
}

/**
 * Debounce function to limit function calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is visible in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Scroll to element smoothly
 * @param {HTMLElement|string} element - Element or selector
 * @param {number} offset - Offset from top
 */
function scrollToElement(element, offset = 0) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showAlert('✅ Text copied to clipboard!', 'success');
  } catch (err) {
    showAlert('❌ Failed to copy text', 'danger');
  }
}

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - File name to save as
 */
function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Parse URL query parameters
 * @param {string} url - URL to parse (optional, uses current URL if not provided)
 * @returns {Object} Query parameters
 */
function getQueryParams(url = window.location.search) {
  const params = {};
  const searchParams = new URLSearchParams(url);
  for (let [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
}

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function mergeObjects(target, source) {
  return { ...target, ...source };
}

/**
 * Sleep function (promise-based)
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Resolves after sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Show loading spinner
 * @param {HTMLElement|string} element - Element or selector
 */
function showLoading(element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (element) {
    element.classList.add('show');
  }
}

/**
 * Hide loading spinner
 * @param {HTMLElement|string} element - Element or selector
 */
function hideLoading(element) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (element) {
    element.classList.remove('show');
  }
}

/**
 * Disable button and show loading state
 * @param {HTMLElement} button - Button element
 * @param {string} loadingText - Text to show while loading
 */
function setButtonLoading(button, loadingText = 'Loading...') {
  button.disabled = true;
  button.dataset.originalText = button.textContent;
  button.textContent = loadingText;
}

/**
 * Restore button from loading state
 * @param {HTMLElement} button - Button element
 */
function resetButton(button) {
  button.disabled = false;
  button.textContent = button.dataset.originalText || 'Submit';
}

/**
 * Logout function
 */
function logout() {
  if (confirm('Apakah Anda yakin ingin keluar?')) {
    sessionStorage.clear();
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
  }
}

/**
 * Handle API error
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
function handleError(error) {
  console.error('Error:', error);
  
  if (error.message === 'Terjadi kesalahan') {
    return 'Terjadi kesalahan sistem. Silakan coba lagi.';
  }
  
  return error.message || 'Terjadi kesalahan yang tidak diketahui';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showAlert,
    formatDate,
    formatDateShort,
    formatTime,
    getMonthName,
    validateEmail,
    validatePhone,
    formatCurrency,
    formatNumber,
    debounce,
    throttle,
    isElementInViewport,
    scrollToElement,
    copyToClipboard,
    downloadFile,
    generateRandomString,
    getQueryParams,
    isEmpty,
    deepClone,
    mergeObjects,
    sleep,
    showLoading,
    hideLoading,
    setButtonLoading,
    resetButton,
    logout,
    handleError
  };
}
