(function() {
    
    const getPath = (path) => {
        const depth = window.location.pathname.split('/').length - 2;
        let prefix = "";
        if (window.location.pathname.includes('/thutuchanhchinh/') || 
            window.location.pathname.includes('/vneid/') ||
            window.location.pathname.includes('/binhdanhocvuso/') ||
            window.location.pathname.includes('/bandoso/')) {
            prefix = "../";
        }
        return prefix + path;
    };

    const imgPath = getPath("public/images/thutuchanhchinh.svg");
    const cssPath = getPath("css/chatbot.css");
    const jsPath = getPath("chatbot/chatbot.js");

    const chatbotHTML = `
    <button class="chatbot-toggler">
        <img src="${imgPath}" alt="Chat Icon">
    </button>
    <div class="chatbot">
        <header>
            <div class="header-info">
                <img src="${imgPath}" alt="Logo" class="bot-logo">
                <div class="bot-text">
                    <h3>Trợ lý AI</h3>
                    <p>Hỗ trợ dịch vụ công</p>
                </div>
            </div>
            <div class="header-controls">
                <button id="new-chat-btn" title="Làm mới"><i class="fas fa-sync-alt"></i></button>
                <button id="expand-btn" title="Mở rộng"><i class="fas fa-expand-alt"></i></button>
                <button id="close-btn" title="Đóng"><i class="fas fa-times"></i></button>
            </div>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="bot-icon"><img src="${imgPath}" alt="Bot"></span>
                <p>Xin chào! 👋<br>Em là Trợ lý ảo AI chuyên trách hướng dẫn Thủ tục hành chính xã Tiên Lữ.<br>Anh/chị cần tìm hiểu về thủ tục nào ạ?</p>
            </li>
        </ul>
        <div class="chat-input">
            <textarea placeholder="Nhập câu hỏi (VD: Khai sinh)..." spellcheck="false" required></textarea>
            <span id="send-btn"><i class="fas fa-paper-plane"></i></span>
        </div>
    </div>`;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);

    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);

    const script = document.createElement('script');
    script.src = jsPath;
    script.defer = true;
    document.body.appendChild(script);

})();