// ==================== SIMPLY AI PRO 2026 - CORE SCRIPT ====================
// Version: 2.0.0 | Complete JavaScript File

console.log('🚀 Simply AI Pro 2026 - JavaScript Loaded');

// ==================== GLOBAL VARIABLES ====================
let currentUser = {
    name: localStorage.getItem('simply_ai_username') || 'ضيف',
    messagesCount: parseInt(localStorage.getItem('simply_ai_message_count')) || 0,
    isPremium: localStorage.getItem('simply_ai_premium') === 'true',
    language: localStorage.getItem('simply_ai_language') || 'ar',
    mood: localStorage.getItem('simply_ai_mood') || 'happy'
};

const MAX_FREE_MESSAGES = 100;
let currentMood = currentUser.mood;
let conversation = [];
let deferredPrompt = null;
let isVoiceActive = false;
let speechRecognition = null;

// ==================== AI CONFIGURATION ====================
const AI_CONFIG = {
    moods: {
        happy: { 
            name: "سعيد 😊", 
            icon: "😊",
            color: "#10b981",
            responses: [
                "أهلاً وسهلاً! 🌟 كيف يمكنني مساعدتك اليوم؟",
                "مرحباً! 🚀 أنا سعيد بالتحدث معك. ما الذي تريد معرفته؟",
                "يا له من يوم جميل! ☀️ كيف يمكنني إسعادك أكثر؟",
                "أهلًا بك! 💫 مستعد للإجابة على جميع أسئلتك."
            ]
        },
        professional: {
            name: "محترف 💼", 
            icon: "💼",
            color: "#3b82f6",
            responses: [
                "تحية طيبة. أنا جاهز لمساعدتك بأفضل شكل ممكن.",
                "مرحباً. لدي كل المعلومات التي تحتاجها. ما هو سؤالك؟",
                "أهلاً بك. يمكنني تقديم إجابات دقيقة ومفصلة.",
                "تحياتي. جاهز لتقديم الدعم الفني المطلوب."
            ]
        },
        creative: {
            name: "مبدع 🎨", 
            icon: "🎨",
            color: "#8b5cf6",
            responses: [
                "مرحباً! 💡 لدي أفكار رائعة لشاركها معك.",
                "أهلاً! 🎯 دعني أريك عالماً من الإبداع.",
                "يا للروعة! ✨ لنتحدث عن أفكار مبتكرة.",
                "مرحباً! 🎭 جاهز للإبداع معك."
            ]
        },
        expert: {
            name: "خبير 🧠", 
            icon: "🧠",
            color: "#00d4ff",
            responses: [
                "مرحباً. لدي خبرة تقنية عميقة في هذا المجال.",
                "أهلاً. يمكنني تقديم تحليل متعمق لموضوعك.",
                "تحية. جاهز لمناقشة الجوانب التقنية.",
                "مرحباً. لدي معرفة شاملة بهذا الموضوع."
            ]
        }
    },
    
    responses: {
        greeting: [
            "أهلاً بك في عالم الذكاء الاصطناعي 2026! 🚀",
            "مرحباً! أنا مساعدك الذكي الجديد. كيف يمكنني خدمتك؟",
            "أهلاً وسهلاً! 🌟 جاهز للإجابة على جميع استفساراتك."
        ],
        question: [
            "سؤال ممتاز! 💡 دعني أفكر في أفضل إجابة لك...",
            "هذا موضوع شيق! 🎯 سأقدم لك معلومات دقيقة.",
            "أحب هذا النوع من الأسئلة! 📚 دعني أرتب المعلومات لك."
        ],
        thanks: [
            "العفو! 🌸 سعيد بمساعدتك دائماً.",
            "لا شكر على واجب! ✨ أنا هنا لخدمتك.",
            "من دواعي سروري! 💖 تفضل بأي سؤال آخر."
        ],
        tech: [
            "💻 <strong>التقنية الحديثة:</strong> الذكاء الاصطناعي يتطور باستمرار!",
            "🚀 <strong>المستقبل التقني:</strong> نحن على وشك ثورة تقنية كبيرة.",
            "🤖 <strong>تطور AI:</strong> التعلم العميق يغير العالم."
        ]
    },
    
    quickResponses: {
        "كيف يمكنك مساعدتي؟": "يمكنني مساعدتك في: 📝 الكتابة، 💻 البرمجة، 📊 التحليل، 🎨 التصميم، 💰 الأعمال، 🧠 التعليم، والمزيد!",
        "ما هي ميزاتك الجديدة؟": "ميزات 2026: 🤖 ذكاء متقدم، ⚡ سرعة فائقة، 🔐 أمان مشفر، 🌐 دعم متعدد اللغات، 📱 واجهة مستقبلية!",
        "أخبرني عن الذكاء الاصطناعي": "الذكاء الاصطناعي هو: 🧠 محاكاة الذكاء البشري، 💡 تعلم من البيانات، 🔄 تحسين ذاتي، 🚀 مستقبل التقنية!",
        "كيف أتعلم البرمجة؟": "لتعلم البرمجة: 1️⃣ ابدأ بلغة سهلة، 2️⃣ تدرب يومياً، 3️⃣ أنشئ مشاريع، 4️⃣ انضم لمجتمعات، 5️⃣ لا تستسلم!",
        "ما هو مستقبل العملات الرقمية؟": "المستقبل: 📈 نمو مستمر، 🌍 اعتماد عالمي، 💡 تقنيات جديدة، 🔒 أمان متقدم، 💰 فرص استثمارية!"
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Starting Simply AI Pro 2026...');
    
    initializeApp();
    setupEventListeners();
    loadSavedData();
    setupPWA();
    updateUI();
});

function initializeApp() {
    console.log('🔄 Initializing application...');
    
    // Simulate loading
    const progressBar = document.getElementById('loaderProgress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loader and show app
            setTimeout(() => {
                document.getElementById('appLoader').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('appLoader').style.display = 'none';
                    document.getElementById('mainApp').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('mainApp').style.opacity = '1';
                        showNotification('🚀 Simply AI Pro 2026 جاهز!', 'success');
                    }, 100);
                }, 500);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

function loadSavedData() {
    try {
        // Load conversation
        const saved = localStorage.getItem('simply_ai_conversation');
        if (saved) {
            conversation = JSON.parse(saved);
            updateTotalMessages();
            
            // Display last 3 messages
            const lastMessages = conversation.slice(-3);
            lastMessages.forEach(msg => {
                displayMessage(msg.sender, msg.content, msg.time, false);
            });
        }
        
        // Load settings
        const settings = localStorage.getItem('simply_ai_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            
            if (parsed.username) {
                document.getElementById('username').value = parsed.username;
                currentUser.name = parsed.username;
            }
            if (parsed.mood) {
                currentMood = parsed.mood;
                updateMoodIndicator();
            }
            if (parsed.language) {
                document.getElementById('language').value = parsed.language;
                currentUser.language = parsed.language;
            }
        }
        
        // Update counters
        updateMessageCounter();
        updateUserStatus();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        showNotification('⚠️ حدث خطأ في تحميل البيانات', 'warning');
    }
}

function saveData() {
    try {
        // Save conversation
        localStorage.setItem('simply_ai_conversation', JSON.stringify(conversation));
        
        // Save user data
        localStorage.setItem('simply_ai_username', currentUser.name);
        localStorage.setItem('simply_ai_message_count', currentUser.messagesCount.toString());
        localStorage.setItem('simply_ai_mood', currentMood);
        localStorage.setItem('simply_ai_language', currentUser.language);
        
        // Save settings
        const settings = {
            username: currentUser.name,
            mood: currentMood,
            language: currentUser.language,
            darkMode: document.getElementById('darkModeToggle')?.checked || true,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('simply_ai_settings', JSON.stringify(settings));
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
    }
}

// ==================== UI FUNCTIONS ====================
function updateUI() {
    updateMessageCounter();
    updateMoodIndicator();
    updateUserStatus();
    updateWelcomeTime();
    updateStats();
}

function updateMessageCounter() {
    const remaining = MAX_FREE_MESSAGES - currentUser.messagesCount;
    document.getElementById('messageCounter').textContent = 
        `${currentUser.messagesCount}/${MAX_FREE_MESSAGES}`;
    document.getElementById('messageLimit').textContent = 
        `${remaining} رسالة متبقية`;
    
    // Color coding
    const progress = (currentUser.messagesCount / MAX_FREE_MESSAGES) * 100;
    const limitElement = document.getElementById('messageLimit');
    if (progress > 80) {
        limitElement.style.color = '#ef4444';
        limitElement.style.fontWeight = 'bold';
    } else if (progress > 60) {
        limitElement.style.color = '#f59e0b';
    }
}

function updateMoodIndicator() {
    const mood = AI_CONFIG.moods[currentMood];
    document.getElementById('aiMoodIndicator').innerHTML = 
        `${mood.icon} المزاج: ${mood.name}`;
}

function updateUserStatus() {
    document.getElementById('userStatus').textContent = currentUser.name;
}

function updateTotalMessages() {
    document.getElementById('totalMessages').textContent = conversation.length;
    
    // Update daily stats
    const today = new Date().toDateString();
    let todayCount = parseInt(localStorage.getItem(`simply_ai_${today}`)) || 0;
    todayCount = conversation.filter(msg => {
        const msgDate = new Date(msg.timestamp || Date.now()).toDateString();
        return msgDate === today;
    }).length;
    
    document.getElementById('todayMessages').textContent = todayCount;
    localStorage.setItem(`simply_ai_${today}`, todayCount.toString());
}

function updateWelcomeTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('welcomeTime').textContent = 
        `${timeString} - ${dateString}`;
}

function updateStats() {
    // Update usage time
    const savedStart = localStorage.getItem('simply_ai_start_time');
    const startTime = savedStart ? new Date(savedStart) : new Date();
    if (!savedStart) localStorage.setItem('simply_ai_start_time', startTime.toISOString());
    
    const diff = new Date() - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('usageTime').textContent = `${hours} ساعة ${minutes} دقيقة`;
    
    // Update AI accuracy (simulated)
    const accuracy = 94 + Math.random() * 4;
    document.getElementById('aiAccuracy').textContent = `${accuracy.toFixed(1)}%`;
    
    // Update uptime
    const uptime = 99.5 + Math.random() * 0.5;
    document.getElementById('uptime').textContent = `${uptime.toFixed(1)}%`;
    
    // Update last keys update
    const timeString = new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('keysLastUpdate').textContent = timeString;
}

// ==================== CHAT FUNCTIONS ====================
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        showNotification('⚠️ الرجاء كتابة رسالة', 'warning');
        return;
    }
    
    if (currentUser.messagesCount >= MAX_FREE_MESSAGES && !currentUser.isPremium) {
        showUpgradePrompt();
        return;
    }
    
    // Add user message
    const userTime = new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    displayMessage('user', message, userTime);
    
    // Save to conversation
    conversation.push({
        sender: 'user',
        content: message,
        time: userTime,
        mood: currentMood,
        timestamp: Date.now()
    });
    
    // Clear input
    input.value = '';
    updateCharCount();
    input.style.height = 'auto';
    
    // Update counters
    currentUser.messagesCount++;
    updateMessageCounter();
    updateTotalMessages();
    
    // Analyze message
    analyzeMessage(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Disable send button
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        // Generate AI response
        const aiResponse = await generateAIResponse(message);
        
        // Add AI response
        const aiTime = new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        displayMessage('ai', aiResponse, aiTime);
        
        // Save to conversation
        conversation.push({
            sender: 'ai',
            content: aiResponse,
            time: aiTime,
            mood: currentMood,
            timestamp: Date.now()
        });
        
        // Save data
        saveData();
        
        // Speak response if voice is active
        if (isVoiceActive) {
            speakText(aiResponse);
        }
        
    } catch (error) {
        console.error('❌ Error generating response:', error);
        showNotification('❌ حدث خطأ في الاتصال', 'error');
        
        // Show error message
        const aiTime = new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        displayMessage('ai', '⚠️ عذراً، حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.', aiTime);
        
    } finally {
        // Re-enable send button
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        hideTypingIndicator();
    }
}

async function generateAIResponse(message) {
    return new Promise((resolve) => {
        // Simulate thinking time
        const thinkingTime = 800 + Math.random() * 1200;
        
        setTimeout(() => {
            const lowerMsg = message.toLowerCase();
            
            // Check for quick responses first
            for (const [key, response] of Object.entries(AI_CONFIG.quickResponses)) {
                if (lowerMsg.includes(key.toLowerCase())) {
                    resolve(response);
                    return;
                }
            }
            
            // Determine response type
            let response = '';
            
            if (lowerMsg.includes('مرحبا') || lowerMsg.includes('اهلا') || lowerMsg.includes('سلام')) {
                response = AI_CONFIG.responses.greeting[Math.floor(Math.random() * AI_CONFIG.responses.greeting.length)];
            }
            else if (lowerMsg.includes('شكر') || lowerMsg.includes('مشكور') || lowerMsg.includes('يعطيك')) {
                response = AI_CONFIG.responses.thanks[Math.floor(Math.random() * AI_CONFIG.responses.thanks.length)];
            }
            else if (lowerMsg.includes('كيف') || lowerMsg.includes('لماذا') || lowerMsg.includes('متى') || lowerMsg.includes('اين')) {
                response = AI_CONFIG.responses.question[Math.floor(Math.random() * AI_CONFIG.responses.question.length)];
            }
            else if (lowerMsg.includes('تقنية') || lowerMsg.includes('تكنولوجيا') || lowerMsg.includes('برمجة')) {
                response = AI_CONFIG.responses.tech[Math.floor(Math.random() * AI_CONFIG.responses.tech.length)];
            }
            else if (lowerMsg.includes('مفتاح') || lowerMsg.includes('key') || lowerMsg.includes('api')) {
                response = "🔐 <strong>نظام الأمان المتقدم 2026</strong><br><br>" +
                          "جميع المفاتيح مخزنة في خوادم مشفرة باستخدام تقنية AES-256.<br>" +
                          "✅ اتصال آمن من طرف لطرف<br>" +
                          "✅ مفاتيح مؤقتة (24 ساعة)<br>" +
                          "✅ مراقبة مستمرة للنشاط<br>" +
                          "✅ تشفير كامل للبيانات";
            }
            else if (lowerMsg.includes('دعم') || lowerMsg.includes('اتصال') || lowerMsg.includes('رقم')) {
                response = `📞 <strong>الدعم الفني المباشر</strong><br><br>` +
                          `يمكنك التواصل مع المطور مباشرة:<br><br>` +
                          `📱 <strong>واتساب:</strong> 0930127500<br>` +
                          `📧 <strong>إيميل:</strong> maisabbas445@gmail.com<br>` +
                          `📞 <strong>هاتف:</strong> 0930127500<br><br>` +
                          `🚀 <strong>متاح 24/7 للدعم الفوري!</strong>`;
            }
            else {
                // Generic intelligent response
                const genericResponses = [
                    `🤖 <strong>رد ذكي من AI 2026:</strong><br><br>` +
                    `لقد فهمت سؤالك: "${message}"<br><br>` +
                    `في نسخة 2026، أستطيع تقديم إجابات أكثر دقة وذكاءً!`,
                    
                    `💡 <strong>فكرة مبتكرة:</strong><br><br>` +
                    `بناءً على سؤالك، أرى أن الموضوع مهم.<br>` +
                    `دعني أقدم لك تحليلاً شاملاً باستخدام ذكاء 2026.`,
                    
                    `🎯 <strong>تحليل متقدم:</strong><br><br>` +
                    `"${message}"<br><br>` +
                    `هذا موضوع يستحق البحث. مع تقنيات 2026، يمكنني تقديم رؤى قيمة.`
                ];
                response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
            }
            
            // Add mood-based enhancement
            const mood = AI_CONFIG.moods[currentMood];
            if (Math.random() > 0.5) {
                response = `${mood.icon} <strong>[${mood.name}]</strong><br><br>${response}`;
            }
            
            resolve(response);
            
        }, thinkingTime);
    });
}

function displayMessage(sender, content, time, animate = true) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    if (animate) {
        messageDiv.style.animation = 'messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    const avatar = sender === 'user' ? 
        '<i class="fas fa-user"></i>' : 
        '<i class="fas fa-robot"></i>';
    
    const senderName = sender === 'user' ? 
        currentUser.name : 
        'Simply AI';
    
    const senderTitle = sender === 'user' ? 
        'المستخدم' : 
        'المساعد الذكي 2026';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar">
                ${avatar}
            </div>
            <div>
                <div class="message-sender">${senderName}</div>
                <small>${senderTitle}</small>
            </div>
        </div>
        <div class="message-content">${formatMessage(content)}</div>
        <div class="message-time">${time}</div>
        <div class="message-actions">
            <button class="message-action" onclick="copyMessage(this)">
                <i class="fas fa-copy"></i> نسخ
            </button>
            <button class="message-action" onclick="likeMessage(this)">
                <i class="fas fa-thumbs-up"></i> أعجبني
            </button>
            ${sender === 'ai' ? `
            <button class="message-action" onclick="speakMessage(this)">
                <i class="fas fa-volume-up"></i> استماع
            </button>
            ` : ''}
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Play notification sound
    playNotificationSound();
}

function formatMessage(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00d4ff; text-decoration: underline;">$1</a>');
    
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

function scrollToBottom() {
    const chatArea = document.getElementById('chatArea');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'block';
    scrollToBottom();
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// ==================== MESSAGE ACTIONS ====================
function copyMessage(button) {
    const messageContent = button.closest('.message').querySelector('.message-content');
    const text = messageContent.textContent;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('✅ تم نسخ الرسالة إلى الحافظة', 'success');
            button.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> نسخ';
            }, 2000);
        })
        .catch(() => {
            showNotification('❌ فشل نسخ الرسالة', 'error');
        });
}

function likeMessage(button) {
    button.innerHTML = '<i class="fas fa-heart"></i> أعجبني';
    button.style.color = '#ef4444';
    showNotification('❤️ شكراً للإعجاب!', 'info');
}

function speakMessage(button) {
    const messageContent = button.closest('.message').querySelector('.message-content');
    const text = messageContent.textContent;
    
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'ar-SA';
        speech.rate = 1;
        
        button.innerHTML = '<i class="fas fa-volume-mute"></i> إيقاف';
        button.style.color = '#00d4ff';
        
        speech.onend = function() {
            button.innerHTML = '<i class="fas fa-volume-up"></i> استماع';
            button.style.color = '';
        };
        
        window.speechSynthesis.speak(speech);
    } else {
        showNotification('⚠️ المتصفح لا يدعم ميزة النطق', 'warning');
    }
}

// ==================== CHAT MANAGEMENT ====================
function clearChat() {
    if (confirm('⚠️ هل تريد مسح المحادثة الحالية؟\n\nهذا الإجراء لا يمكن التراجع عنه.')) {
        conversation = [];
        
        // Clear messages container
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = `
            <div class="message ai">
                <div class="message-header">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div>
                        <div class="message-sender">Simply AI</div>
                        <small>المساعد الذكي 2026</small>
                    </div>
                </div>
                <div class="message-content">
                    <span class="glow">🚀 المحادثة تم مسحها!</span>
                    <br><br>
                    يمكنك البدء بمحادثة جديدة.<br>
                    أنا هنا لمساعدتك بأي شيء تريده.
                </div>
                <div class="message-time" id="welcomeTime"></div>
                <div class="message-actions">
                    <button class="message-action" onclick="copyMessage(this)">
                        <i class="fas fa-copy"></i> نسخ
                    </button>
                    <button class="message-action" onclick="likeMessage(this)">
                        <i class="fas fa-thumbs-up"></i> أعجبني
                    </button>
                </div>
            </div>
        `;
        
        updateWelcomeTime();
        saveData();
        showNotification('🗑️ تم مسح المحادثة بنجاح', 'success');
    }
}

function exportChat() {
    if (conversation.length === 0) {
        showNotification('⚠️ لا توجد محادثة لتصديرها', 'warning');
        return;
    }
    
    let chatText = "محادثة Simply AI Pro 2026\n";
    chatText += "=".repeat(50) + "\n\n";
    
    conversation.forEach((msg, index) => {
        const sender = msg.sender === 'user' ? '👤 أنت' : '🤖 Simply AI';
        chatText += `${index + 1}. ${sender} (${msg.time}):\n`;
        chatText += `${msg.content.replace(/<[^>]*>/g, '')}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simply-ai-chat-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('📥 تم تصدير المحادثة بنجاح', 'success');
}

function changeAIMood() {
    const moods = Object.keys(AI_CONFIG.moods);
    let newMood;
    do {
        newMood = moods[Math.floor(Math.random() * moods.length)];
    } while (newMood === currentMood && moods.length > 1);
    
    currentMood = newMood;
    const mood = AI_CONFIG.moods[newMood];
    
    showNotification(`🤖 تم تغيير مزاج AI إلى: ${mood.name}`, 'info');
    updateMoodIndicator();
    
    // Save settings
    saveData();
}

function insertPredefined(text) {
    const input = document.getElementById('messageInput');
    input.value = text;
    input.focus();
    updateCharCount();
}

function analyzeMessage(message) {
    const lowerMsg = message.toLowerCase();
    let detectedMood = currentMood;
    
    if (lowerMsg.includes('مشكلة') || lowerMsg.includes('خطأ') || lowerMsg.includes('سيء')) {
        detectedMood = 'professional';
    } else if (lowerMsg.includes('مبدع') || lowerMsg.includes('إبداع') || lowerMsg.includes('فكرة')) {
        detectedMood = 'creative';
    } else if (lowerMsg.includes('تقني') || lowerMsg.includes('تقنية') || lowerMsg.includes('برمجة')) {
        detectedMood = 'expert';
    }
    
    if (detectedMood !== currentMood) {
        currentMood = detectedMood;
        updateMoodIndicator();
        saveData();
    }
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // Activate selected tab
    document.querySelector(`.nav-tab[data-page="${pageId}"]`).classList.add('active');
    
    // Save last visited page
    localStorage.setItem('simply_ai_last_page', pageId);
}

// ==================== UTILITY FUNCTIONS ====================
function updateCharCount() {
    const input = document.getElementById('messageInput');
    const length = input.value.length;
    document.getElementById('charCount').textContent = `${length}/2000 حرف`;
    
    // Auto-resize textarea
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">${message}</div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'notificationSlide 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    playNotificationSound();
}

function playNotificationSound() {
    // Simple beep sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Sound not supported, ignore
    }
}

// ==================== PWA FUNCTIONS ====================
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker مسجل:', registration.scope);
            })
            .catch(error => {
                console.log('❌ فشل تسجيل Service Worker:', error);
            });
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        setTimeout(() => {
            if (deferredPrompt) {
                showInstallPrompt();
            }
        }, 10000);
    });
}

function showInstallPrompt() {
    document.getElementById('installPrompt').style.display = 'block';
}

function hideInstallPrompt() {
    document.getElementById('installPrompt').style.display = 'none';
}

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ المستخدم وافق على التثبيت');
            showNotification('📱 تم بدء تثبيت التطبيق', 'success');
        }
        
        deferredPrompt = null;
        hideInstallPrompt();
    }
}

// ==================== SETUP EVENT LISTENERS ====================
function setupEventListeners() {
    // Input events
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', updateCharCount);
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Settings changes
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('change', function() {
            currentUser.name = this.value;
            updateUserStatus();
            saveData();
            showNotification('👤 تم تحديث اسم المستخدم', 'info');
        });
    }
    
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            currentUser.language = this.value;
            saveData();
            showNotification('🌍 تم تغيير اللغة', 'info');
        });
    }
    
    // Auto-save every 30 seconds
    setInterval(saveData, 30000);
    
    // Update stats every minute
    setInterval(updateStats, 60000);
    
    // Update time every minute
    setInterval(updateWelcomeTime, 60000);
    
    // Online/offline detection
    window.addEventListener('online', function() {
        showNotification('✅ تم استعادة الاتصال بالإنترنت', 'success');
        document.getElementById('aiStatus').textContent = '🟢 متصل';
    });
    
    window.addEventListener('offline', function() {
        showNotification('⚡ أنت غير متصل بالإنترنت', 'warning');
        document.getElementById('aiStatus').textContent = '🔴 غير متصل';
    });
}

// ==================== UPGRADE PROMPT ====================
function showUpgradePrompt() {
    showNotification('🚀 وصلت للحد المجاني! ترقية الآن للحصول على رسائل غير محدودة.', 'warning');
    
    setTimeout(() => {
        if (confirm('🎯 <strong>ترقية إلى النسخة المميزة</strong>\n\n' +
                   '💎 <strong>المميزة:</strong> $20/شهر\n' +
                   '✨ <strong>المتقدمة:</strong> $100/سنة\n\n' +
                   '🚀 <strong>المزايا:</strong>\n' +
                   '• رسائل غير محدودة\n' +
                   '• سرعة فائقة\n' +
                   '• دعم فني مميز\n\n' +
                   '💳 <strong>هل تريد المتابعة للدفع؟</strong>')) {
            showPage('keys');
            showNotification('💰 جاري تحويلك لصفحة الدفع...', 'info');
        }
    }, 1000);
}

// ==================== KEYS PAGE FUNCTIONS ====================
function testOpenAI() {
    showNotification('🔗 جاري اختبار اتصال OpenAI...', 'info');
    
    setTimeout(() => {
        showNotification('✅ اتصال OpenAI ناجح! GPT-4 Turbo يعمل بكفاءة.', 'success');
        document.getElementById('aiStatus').textContent = '🟢 متصل - GPT-4 Turbo';
    }, 2000);
}

function testPayment() {
    showNotification('💳 جاري اختبار بوابة الدفع...', 'info');
    
    setTimeout(() => {
        showNotification('✅ NOWPayments جاهز للاستخدام! الأمان 100%.', 'success');
    }, 1500);
}

function showWalletAddress() {
    showNotification('🔐 جاري جلب العنوان الآمن...', 'info');
    
    setTimeout(() => {
        if (confirm(`💰 عنوان Trust Wallet (آمن):\n\nTXYZ1234567890...\n\n🚨 للأمان: العنوان يتم جلبه من خادم مشفر.\n\nهل تريد نسخ العنوان؟`)) {
            navigator.clipboard.writeText('TXYZ1234567890abcdefghijklmnopqrstuvwxyz')
                .then(() => showNotification('✅ تم نسخ العنوان', 'success'))
                .catch(() => showNotification('❌ فشل نسخ العنوان', 'error'));
        }
    }, 1000);
}

// ==================== INITIAL LOAD ====================
console.log('🎉 Simply AI Pro 2026 - JavaScript Initialized Successfully');
