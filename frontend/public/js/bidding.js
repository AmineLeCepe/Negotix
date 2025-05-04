document.addEventListener('DOMContentLoaded', () => {
    // Handle mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Handle newsletter subscription
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                // Here you would typically send this to your backend
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Initialize chat functionality
    initializeChat();
});

// Email validation helper function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Chat functionality
function initializeChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;

    // Add chat interface elements
    chatWindow.innerHTML = `
        <div class="chat-messages"></div>
        <div class="chat-input">
            <input type="text" placeholder="Type your message..." id="messageInput">
            <button id="sendMessage">Send</button>
        </div>
    `;

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');
    const messagesContainer = chatWindow.querySelector('.chat-messages');

    // Add some styling to the chat interface
    const style = document.createElement('style');
    style.textContent = `
        .chat-messages {
            height: 250px;
            overflow-y: auto;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        .chat-input {
            display: flex;
            gap: 0.5rem;
            padding: 1rem;
        }
        .chat-input input {
            flex-grow: 1;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }
        .chat-input button {
            padding: 0.5rem 1rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .message {
            margin-bottom: 0.5rem;
            padding: 0.5rem;
            border-radius: 4px;
            max-width: 80%;
        }
        .message.user {
            background-color: var(--primary-color);
            color: white;
            margin-left: auto;
        }
        .message.support {
            background-color: #f0f0f0;
            margin-right: auto;
        }
    `;
    document.head.appendChild(style);

    // Handle sending messages
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';

        // Simulate support response
        setTimeout(() => {
            addMessage('Thank you for your message. A support representative will be with you shortly.', 'support');
        }, 1000);
    }

    function addMessage(text, type) {
        const message = document.createElement('div');
        message.classList.add('message', type);
        message.textContent = text;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add initial support message
    addMessage('Welcome to our live chat support! How can we help you today?', 'support');
} 
/*const axios = require('axios');

async function callChatGPT(userMessage) {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
        messages: [
          { role: 'system', content: 'You are a helpful assistant for a restaurant website.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY_HERE`,
          'Content-Type': 'application/json'
        }
      }
    );
  
    return response.data.choices[0].message.content;
  }
  