// Get URL parameters to determine which product is being bid on
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product') || '1';

const timerElement = document.getElementById('auction-timer');
const endTime = new Date(auction.endDate);

const timeRemainingElement = document.getElementById('time-remaining');

function updateTimer() {
    const now = new Date();
    const remainingMs = endTime - now;

    if (remainingMs <= 0) {
        timeRemainingElement.textContent = "00:00:00";
        clearInterval(timerInterval);
        endAuction(); 
        return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    timeRemainingElement.textContent = 
        `${days}d ${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`;
}

const timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // call once immediately


// Simulated users data
const otherUsers = [
    { name: 'Alice', avatar: '👩' },
    { name: 'Bob', avatar: '👨' },
    { name: 'Carol', avatar: '👩🏽' },
    { name: 'David', avatar: '👨🏻' }
];

let totalBids = 0;
let lastBidder = null;
let auctionEnded = false;


// DOM Elements
const chatMessages = document.querySelector('.chat-messages');
const bidInput = document.querySelector('input[type="number"]');
const bidButton = document.querySelector('.bid-button');
const biddersCountElement = document.getElementById('bidders-count');

// Update product info
if (product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('current-bid').textContent = `$${product.currentBid}`;
    bidInput.min = product.currentBid + 1;
}

// Add message to chat
function addMessage(content, type, user = null) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    
    if (user) {
        message.innerHTML = `<span class="user-avatar">${user.avatar}</span>
                           <span class="user-name">${user.name}</span>
                           <span class="message-content">${content}</span>`;
    } else {
        message.innerHTML = `<span class="message-content">${content}</span>`;
    }
    
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function endAuction() {
    auctionEnded = true;
    const winMessage = lastBidder.name === 'You' ?
        'Congratulations! You won the auction! 🎉' :
        `Auction ended! ${lastBidder.name} won with a bid of $${product.currentBid}! 🎉`;
    
    addMessage(winMessage, 'received', { name: 'System', avatar: '🤖' });
    
    // Update UI to show auction ended
    const statusIndicator = document.querySelector('.status-indicator');
    const statusDot = document.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('span:last-child');
    
    statusDot.classList.remove('active');
    statusDot.style.background = '#f44336';
    statusText.textContent = 'Ended';
    
    // Disable input
    bidInput.disabled = true;
    bidButton.disabled = true;
    bidButton.style.opacity = '0.5';
    bidInput.placeholder = 'Auction ended';
    
    // Add confetti effect
    if (lastBidder.name === 'You') {
        createConfetti();
    }
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 6000);
}

function simulateOtherUserBid() {
    if (auctionEnded) return;

    const availableUsers = otherUsers.filter(user => !user.lastBid || (Date.now() - user.lastBid) > 3000);
    if (availableUsers.length === 0) return;

    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    const currentBid = product.currentBid;
    const newBid = currentBid + Math.floor(Math.random() * 15) + 5;
    
    randomUser.lastBid = Date.now();
    addMessage(`I bid $${newBid}`, 'received', randomUser);
    
    // Add bid animation
    animateBidChange(currentBid, newBid);
    
    product.currentBid = newBid;
    document.getElementById('current-bid').textContent = `$${newBid}`;
    bidInput.min = newBid + 1;
    
    totalBids++;
    lastBidder = randomUser;

    if (totalBids >= 10) {
        endAuction();
        return;
    }

    // Schedule next user bid
    const nextBidDelay = Math.random() * 3000 + 2000; // 2-5 seconds
    setTimeout(simulateOtherUserBid, nextBidDelay);
}

function animateBidChange(oldValue, newValue) {
    const bidElement = document.getElementById('current-bid');
    bidElement.classList.add('bid-changed');
    
    setTimeout(() => {
        bidElement.classList.remove('bid-changed');
    }, 1000);
}

// Handle bid submission
bidButton.addEventListener('click', () => {
    if (auctionEnded) {
        addMessage('Sorry, this auction has ended!', 'received', { name: 'System', avatar: '🤖' });
        return;
    }

    const bidAmount = parseFloat(bidInput.value);
    if (bidAmount > product.currentBid) {
        addMessage(`I place a bid of $${bidAmount}`, 'sent');
        
        // Add bid animation
        animateBidChange(product.currentBid, bidAmount);
        
        // Update current bid
        product.currentBid = bidAmount;
        document.getElementById('current-bid').textContent = `$${bidAmount}`;
        bidInput.min = bidAmount + 1;
        bidInput.value = '';
        
        totalBids++;
        lastBidder = { name: 'You' };
        
        // Add button animation
        bidButton.classList.add('bid-success');
        setTimeout(() => {
            bidButton.classList.remove('bid-success');
        }, 1000);
        
        if (totalBids >= 10) {
            endAuction();
            return;
        }
        
        // Simulate other users responding
        setTimeout(() => {
            addMessage(`New bid of $${bidAmount} has been recorded!`, 'received', { name: 'System', avatar: '🤖' });
            
            // Trigger other users to bid more actively
            setTimeout(simulateOtherUserBid, 1500);
        }, 1000);
    } else {
        // Show error for invalid bid
        bidInput.classList.add('bid-error');
        setTimeout(() => {
            bidInput.classList.remove('bid-error');
        }, 1000);
        
        addMessage(`Your bid must be higher than the current bid of $${product.currentBid}`, 'received', { name: 'System', avatar: '🤖' });
    }
});

// Allow Enter key to submit bid
bidInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        bidButton.click();
    }
});

// Initial welcome message
addMessage('Welcome to the live bidding chat! Other users are also bidding on this item.', 'received', { name: 'System', avatar: '🤖' });

// Start the bidding simulation
setTimeout(() => {
    // Alice starts
    addMessage(`I'm interested in this item!`, 'received', otherUsers[0]);
    setTimeout(() => {
        // Bob follows
        addMessage(`Me too, great product!`, 'received', otherUsers[1]);
        setTimeout(() => {
            // Carol makes first bid
            const firstBid = product.currentBid + 5;
            addMessage(`Let's start! I bid $${firstBid}`, 'received', otherUsers[2]);
            product.currentBid = firstBid;
            document.getElementById('current-bid').textContent = `$${firstBid}`;
            bidInput.min = firstBid + 1;
            
            // Start regular bidding
            simulateOtherUserBid();
        }, 1500);
    }, 1500);
}, 1000);
