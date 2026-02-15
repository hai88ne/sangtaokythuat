// BAO QUANH CODE BẰNG IIFE ĐỂ TRÁNH XUNG ĐỘT BIẾN TOÀN CỤC
(function() {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatbot = document.querySelector(".chatbot");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");

    const botCloseBtn = document.getElementById("close-btn");
    const expandBtn = document.getElementById("expand-btn");
    const newChatBtn = document.getElementById("new-chat-btn");

    let userMessage = null; 
    const inputInitHeight = chatInput ? chatInput.scrollHeight : 0;

    // URL CỦA BẠN (Đã cập nhật)
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxwZIc7uvt4b0rNzAA9cUq3wseLOR2yWeMe6Hf8XUv95siqiTAYx7oGU_fg_x87dTiZ/exec"; 
    let SESSION_ID = "sess_" + Date.now(); 

    // --- 1. XỬ LÝ VĂN BẢN TỐI ƯU ---
    const cleanText = (text) => {
        if (!text || text === "undefined") return "Không có thông tin";
        
        let cleaned = text.toString();
        
        // Thay thế khoảng trắng không ngắt dòng bằng khoảng trắng thường
        cleaned = cleaned.replace(/\u00A0/g, ' ');
        
        // Thay thế các ký tự xuống dòng bằng thẻ <br>
        cleaned = cleaned.replace(/(\r\n|\n|\r)/g, '<br>');
        
        // Gộp nhiều thẻ <br> liên tiếp (cùng khoảng trắng) thành tối đa 2 thẻ để tách đoạn
        cleaned = cleaned.replace(/(<br>\s*){3,}/g, '<br><br>');
        
        // Xóa <br> dư thừa ở đầu và cuối chuỗi
        cleaned = cleaned.replace(/^(<br>\s*)+|(<br>\s*)+$/g, '');
        
        // Xóa khoảng trắng thừa đầu cuối
        return cleaned.trim();
    };

    const escapeHtml = (unsafe) => {
        if (!unsafe) return "";
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };

    // --- 2. TẠO HTML TIN NHẮN (Sử dụng class chat-content) ---
    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        
        // Lấy src ảnh từ nút toggle để đảm bảo đồng bộ
        let imgIconSrc = "../public/images/thutuchanhchinh.svg"; 
        const togglerImg = document.querySelector(".chatbot-toggler img");
        if (togglerImg) {
            imgIconSrc = togglerImg.src;
        }
        
        let botIcon = `<span class="bot-icon"><img src="${imgIconSrc}" alt="Bot"></span>`;
        let userIcon = `<span class="user-icon"><i class="fas fa-user"></i></span>`;

        // Sử dụng div.chat-content thay vì thẻ p
        let chatContent = className === "outgoing" 
            ? `<div class="chat-content"></div>${userIcon}` 
            : `${botIcon}<div class="chat-content"></div>`;
            
        chatLi.innerHTML = chatContent;
        chatLi.querySelector(".chat-content").innerHTML = message;
        return chatLi;
    }

    // --- 3. XÂY DỰNG NỘI DUNG TRẢ LỜI ---
    const buildResponseHTML = (detail, query) => {
        // Clean dữ liệu trước khi lắp ráp
        const t_coquan = cleanText(detail.co_quan);
        const t_trinhtu = cleanText(detail.trinh_tu);
        const t_yeucau = cleanText(detail.yeu_cau);
        const t_cachthuc = cleanText(detail.cach_thuc);

        return `
        Dựa trên dữ liệu hệ thống, để trả lời câu hỏi "<em>${escapeHtml(query)}</em>", em xin cung cấp thông tin về thủ tục: <strong>${detail.ten}</strong>.
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        
        <div style="margin-bottom: 8px;">
            <strong style="color:var(--primary-red);">1. Cơ quan thực hiện:</strong><br>
            ${t_coquan}
        </div>

        <div style="margin-bottom: 8px;">
            <strong style="color:var(--primary-red);">2. Trình tự thực hiện:</strong><br>
            ${t_trinhtu}
        </div>

        <div style="margin-bottom: 8px;">
            <strong style="color:var(--primary-red);">3. Yêu cầu - điều kiện:</strong><br>
            ${t_yeucau}
        </div>

        <div style="margin-bottom: 12px;">
            <strong style="color:var(--primary-red);">4. Cách thức thực hiện:</strong><br>
            ${t_cachthuc}
        </div>

        <div style="text-align: center; margin-top: 15px;">
            <a href="${detail.link}" target="_blank" class="chat-link-btn" style="display:inline-block; padding:8px 15px; background:var(--primary-blue); color:white; border-radius:15px; text-decoration:none; font-size:0.9rem;">
                <i class="fas fa-paper-plane"></i> Nộp hồ sơ ngay
            </a>
        </div>
        
        <div style="margin-top: 15px; font-size: 0.85rem; color: #666; font-style: italic;">
            Hy vọng thông tin trên hữu ích với anh/chị.
        </div>
        `;
    };

    const buildNotFoundHTML = (query) => {
        return `
        Xin lỗi, em chưa thể tìm thấy câu trả lời chính xác cho câu hỏi "<em>${escapeHtml(query)}</em>" trong cơ sở dữ liệu hiện tại.
        <br><br>
        Có thể thủ tục này có tên gọi khác hoặc chưa được cập nhật. Anh/chị vui lòng:
        <ul style="padding-left: 20px; margin-top: 5px;">
            <li>Thử lại với từ khóa ngắn gọn hơn (VD: "khai sinh", "kết hôn").</li>
            <li>Liên hệ trực tiếp bộ phận Một cửa xã Tiên Lữ để được hỗ trợ.</li>
        </ul>
        `;
    };

    const generateResponse = async (chatElement) => {
        const messageElement = chatElement.querySelector(".chat-content");

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    sessionId: SESSION_ID,
                    message: userMessage
                })
            });

            const data = await response.json();
            
            if (data.found && data.detail) {
                messageElement.innerHTML = buildResponseHTML(data.detail, userMessage);
            } else {
                messageElement.innerHTML = buildNotFoundHTML(userMessage);
            }

        } catch (error) {
            console.error(error);
            messageElement.innerText = "Đang có sự cố kết nối. Vui lòng thử lại sau.";
            messageElement.classList.add("error");
        } finally {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    }

    const handleChat = () => {
        userMessage = chatInput.value.trim();
        if(!userMessage) return;

        chatInput.value = "";
        if(inputInitHeight) chatInput.style.height = `${inputInitHeight}px`;

        // User Message
        chatbox.appendChild(createChatLi(escapeHtml(userMessage), "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Bot Thinking
        setTimeout(() => {
            const incomingChatLi = createChatLi("Đang tra cứu dữ liệu...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi);
        }, 600);
    }

    // --- EVENT LISTENERS ---

    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            if(confirm("Bạn muốn bắt đầu cuộc trò chuyện mới?")) {
                let imgIconSrc = "../public/images/thutuchanhchinh.svg";
                const togglerImg = document.querySelector(".chatbot-toggler img");
                if (togglerImg) imgIconSrc = togglerImg.src;

                chatbox.innerHTML = `
                    <li class="chat incoming">
                        <span class="bot-icon"><img src="${imgIconSrc}" alt="Bot"></span>
                        <div class="chat-content">Xin chào! 👋<br>Em là Trợ lý ảo AI. Cuộc trò chuyện đã được làm mới. Anh/chị cần hỗ trợ gì ạ?</div>
                    </li>
                `;
                SESSION_ID = "sess_" + Date.now();
            }
        });
    }

    if (expandBtn) {
        expandBtn.addEventListener("click", () => {
            chatbot.classList.toggle("fullscreen");
            const icon = expandBtn.querySelector("i");
            if (chatbot.classList.contains("fullscreen")) {
                icon.classList.remove("fa-expand-alt");
                icon.classList.add("fa-compress-alt");
                document.body.style.overflow = "hidden";
            } else {
                icon.classList.remove("fa-compress-alt");
                icon.classList.add("fa-expand-alt");
                document.body.style.overflow = "auto";
            }
        });
    }

    if (botCloseBtn) {
        botCloseBtn.addEventListener("click", () => {
            document.body.classList.remove("show-chatbot");
            if (chatbot.classList.contains("fullscreen")) {
                chatbot.classList.remove("fullscreen");
                if(expandBtn) {
                    expandBtn.querySelector("i").classList.remove("fa-compress-alt");
                    expandBtn.querySelector("i").classList.add("fa-expand-alt");
                }
                document.body.style.overflow = "auto";
            }
        });
    }

    if (chatbotToggler) {
        chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    }

    if (chatInput) {
        chatInput.addEventListener("input", () => {
            chatInput.style.height = `${inputInitHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });

        chatInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChat();
            }
        });
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener("click", handleChat);
    }

})();