// Remove order card
const deleteButtons = document.querySelectorAll('.order-delete');
deleteButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.order-card');
    if (card) card.remove();
  });
});

// Add address (placeholder functionality)
const addAddressBtn = document.querySelector('.add-address');
if (addAddressBtn) {
  addAddressBtn.addEventListener('click', function() {
    alert('Add address functionality coming soon!');
  });
}

// Pay button (placeholder functionality)
const payBtn = document.querySelector('.pay-btn');
if (payBtn) {
  payBtn.addEventListener('click', function() {
    alert('Payment processing coming soon!');
  });
} 