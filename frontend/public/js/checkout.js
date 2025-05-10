// Remove order card
const deleteButtons = document.querySelectorAll('.order-delete');
deleteButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.order-card');
    if (card) card.remove();
  });
});

// Address modal functionality
document.addEventListener('DOMContentLoaded', function() {
  const addAddressBtn = document.getElementById('add-address-btn');
  const addressModal = document.getElementById('address-modal');
  const cancelAddressBtn = document.getElementById('cancel-address');
  const saveAddressBtn = document.getElementById('save-address');
  const newAddressInput = document.getElementById('new-address-input');
  const addressList = document.getElementById('address-list');
  
  if (addAddressBtn && addressModal) {
    // Open modal when Add button is clicked
    addAddressBtn.addEventListener('click', function() {
      addressModal.style.display = 'flex';
      newAddressInput.focus();
    });
    
    // Close modal when Cancel button is clicked
    cancelAddressBtn.addEventListener('click', function() {
      addressModal.style.display = 'none';
      newAddressInput.value = '';
    });
    
    // Save new address when Save button is clicked
    saveAddressBtn.addEventListener('click', function() {
      const newAddress = newAddressInput.value.trim();
      if (newAddress) {
        // Create new radio button with the address
        const newLabel = document.createElement('label');
        const newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.name = 'address';
        newRadio.checked = true; // Select the new address
        
        // Add the radio button and address text to the label
        newLabel.appendChild(newRadio);
        newLabel.appendChild(document.createTextNode(' ' + newAddress));
        
        // Add animation class
        newLabel.classList.add('animate-fadeInUp');
        
        // Add the new address to the list
        addressList.appendChild(newLabel);
        
        // Close the modal and clear the input
        addressModal.style.display = 'none';
        newAddressInput.value = '';
      }
    });
    
    // Close modal if clicked outside
    addressModal.addEventListener('click', function(event) {
      if (event.target === addressModal) {
        addressModal.style.display = 'none';
        newAddressInput.value = '';
      }
    });
    
    // Allow pressing Enter to save
    newAddressInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        saveAddressBtn.click();
      }
    });
  }
});

// Pay button with success message
const payBtn = document.querySelector('.pay-btn');
const paymentSuccess = document.getElementById('payment-success');

if (payBtn) {
  payBtn.addEventListener('click', function() {
    // Disable the button to prevent multiple clicks
    payBtn.disabled = true;
    payBtn.style.opacity = '0.7';
    payBtn.textContent = 'Processing...';
    
    // Simulate payment processing with a short delay
    setTimeout(function() {
      // Show success message
      paymentSuccess.style.display = 'block';
      
      // Update button text
      payBtn.textContent = 'Paid';
      payBtn.style.background = 'linear-gradient(90deg, #4CAF50, #8BC34A)';
      
      // Scroll to make sure success message is visible
      paymentSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
  });
} 