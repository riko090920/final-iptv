// public/js/script.js

document.addEventListener('DOMContentLoaded', function() {
  // Common functions
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }, 100);
  }

  // Form validation for login
  const loginForm = document.querySelector('form[action="/login"]');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const username = this.querySelector('input[name="username"]');
      const password = this.querySelector('input[name="password"]');
      
      if (!username.value.trim() || !password.value.trim()) {
        e.preventDefault();
        showToast('Please fill in all fields', 'error');
      }
    });
  }

  // MAC address formatting for customer form
  const macInput = document.querySelector('input[name="macAddress"]');
  if (macInput) {
    macInput.addEventListener('input', function(e) {
      let value = this.value.replace(/[^a-fA-F0-9]/g, '');
      if (value.length > 12) value = value.substr(0, 12);
      
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 2 === 0) formatted += ':';
        formatted += value[i].toUpperCase();
      }
      
      this.value = formatted;
    });
  }

  // Stream URL validation
  const streamForm = document.querySelector('form[action="/streams"]');
  if (streamForm) {
    streamForm.addEventListener('submit', function(e) {
      const urlInput = this.querySelector('input[name="url"]');
      if (!urlInput.value.startsWith('http://') && !urlInput.value.startsWith('https://')) {
        e.preventDefault();
        showToast('Stream URL must start with http:// or https://', 'error');
        urlInput.focus();
      }
    });
  }

  // Table row click functionality
  const tableRows = document.querySelectorAll('tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', function() {
      // Implement what happens when a row is clicked
      // For example: window.location.href = `/edit/${this.dataset.id}`;
    });
  });

  // Responsive menu toggle for mobile
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.innerHTML = '☰';
  const nav = document.querySelector('nav');
  if (nav) {
    nav.parentNode.insertBefore(menuToggle, nav);
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
  }

  // Date picker enhancement for expiry date
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      const today = new Date();
      const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));
      input.valueAsDate = oneMonthLater;
    }
  });
});
