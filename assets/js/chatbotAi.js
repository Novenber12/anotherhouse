(function () {
  "use strict";

  const WIDGET_ID = "ah-chatbot-widget";
  const PANEL_OPEN_CLASS = "is-open";

  // Keep the bot fully front-end: rule-based FAQ + room/booking guidance.
  // No network calls needed.
  const ROOMS = [
    {
      id: "romantic",
      name: "Romantic",
      priceK: 990,
      vibe: "Warm amber light, intimate evenings, slow mornings.",
      highlights: ["King size bed", "Deep soaking tub", "Private balcony"],
    },
    {
      id: "sky",
      name: "Sky",
      priceK: 890,
      vibe: "Airy, cloud-like space with skylight and soft natural light.",
      highlights: ["Queen size bed", "Skylight window", "City view"],
    },
    {
      id: "cinema",
      name: "Cinema",
      priceK: 1090,
      vibe: "Velvet cocoon for film nights and immersive audio.",
      highlights: ["4K Projector", "Surround sound", "Curated film library"],
    },
    {
      id: "nature",
      name: "Nature",
      priceK: 940,
      vibe: "Living moss, botanical elements, grounding calm.",
      highlights: ["Living moss wall", "Soaking tub", "Garden view"],
    },
    {
      id: "minimal",
      name: "Minimal",
      priceK: 850,
      vibe: "Concrete + oak + linen. Quiet, clear, and exactly what you need.",
      highlights: ["Queen size bed", "Rain shower", "Writing desk"],
    },
  ];

  const QUICK_REPLIES = [
    { id: "q_book", label: "Đặt phòng ngay" },
    { id: "q_room", label: "Gợi ý phòng theo mood" },
    { id: "q_hours", label: "Giờ nhận/trả phòng" },
    { id: "q_pets", label: "Có cho thú cưng không?" },
    { id: "q_wifi", label: "WiFi có sẵn không?" },
    { id: "q_price", label: "Giá phòng bao nhiêu?" },
  ];

  const STYLE = `
    #${WIDGET_ID} { all: initial; position: fixed; right: 18px; bottom: 18px; z-index: 99999; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
    #${WIDGET_ID} *, #${WIDGET_ID} *::before, #${WIDGET_ID} *::after { box-sizing: border-box; }

    .ah-chatbot-fab {
      display: inline-flex; align-items: center; justify-content: center;
      width: 52px; height: 52px; border-radius: 999px;
      border: 1px solid rgba(255,255,255,.25);
      background: #191614; color: #F4EFE6;
      box-shadow: 0 14px 40px rgba(0,0,0,.22);
      cursor: pointer; user-select: none;
      transition: transform .15s ease, background .15s ease;
    }
    .ah-chatbot-fab:hover { transform: translateY(-1px); background: #2a2421; }
    .ah-chatbot-fab:active { transform: translateY(0px); }

    .ah-chatbot-panel {
      width: min(380px, calc(100vw - 36px));
      height: min(560px, calc(100vh - 110px));
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(25,22,20,.12);
      background: rgba(244,239,230,.96);
      box-shadow: 0 24px 70px rgba(0,0,0,.28);
      display: none;
      transform-origin: bottom right;
      animation: ah-chatbot-pop .18s ease-out;
    }
    @keyframes ah-chatbot-pop { from { transform: scale(.98); opacity: .7 } to { transform: scale(1); opacity: 1 } }

    .ah-chatbot-panel.${PANEL_OPEN_CLASS} { display: flex; flex-direction: column; }

    .ah-chatbot-header {
      padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;
      background: rgba(237,229,216,.95);
      border-bottom: 1px solid rgba(25,22,20,.08);
      gap: 10px;
    }
    .ah-chatbot-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .ah-chatbot-avatar {
      width: 30px; height: 30px; border-radius: 10px;
      background: #5A6545; color: #F4EFE6;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 800;
      flex: 0 0 auto;
    }
    .ah-chatbot-title { font-size: 13px; font-weight: 700; color: #191614; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ah-chatbot-subtitle { font-size: 11px; color: rgba(25,22,20,.62); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .ah-chatbot-close {
      width: 30px; height: 30px; border-radius: 10px;
      border: 1px solid rgba(25,22,20,.12);
      background: rgba(255,255,255,.3);
      cursor: pointer; color: rgba(25,22,20,.86);
      display: flex; align-items: center; justify-content: center;
      transition: background .15s ease;
      flex: 0 0 auto;
    }
    .ah-chatbot-close:hover { background: rgba(255,255,255,.6); }

    .ah-chatbot-messages {
      flex: 1 1 auto;
      padding: 12px 12px;
      overflow: auto;
      scroll-behavior: smooth;
    }

    .ah-msg { display: flex; margin: 8px 0; }
    .ah-msg.user { justify-content: flex-end; }
    .ah-msg.assistant { justify-content: flex-start; }

    .ah-bubble {
      max-width: 86%;
      border-radius: 14px;
      padding: 10px 12px;
      border: 1px solid rgba(25,22,20,.10);
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 13px;
      line-height: 1.35;
    }
    .ah-msg.user .ah-bubble {
      background: rgba(25,22,20,.92);
      color: #F4EFE6;
      border-color: rgba(25,22,20,.18);
    }
    .ah-msg.assistant .ah-bubble {
      background: rgba(255,255,255,.55);
      color: #191614;
    }

    .ah-typing {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: rgba(25,22,20,.65);
    }
    .ah-dot { width: 5px; height: 5px; border-radius: 999px; background: rgba(25,22,20,.35); animation: ah-bounce 1s infinite ease-in-out; }
    .ah-dot:nth-child(2) { animation-delay: .12s; }
    .ah-dot:nth-child(3) { animation-delay: .24s; }
    @keyframes ah-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-4px); opacity: 1; } }

    .ah-chatbot-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0 12px 10px;
    }
    .ah-chip {
      border-radius: 999px;
      border: 1px solid rgba(25,22,20,.12);
      background: rgba(255,255,255,.45);
      padding: 8px 10px;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      transition: transform .12s ease, background .12s ease;
      color: rgba(25,22,20,.92);
    }
    .ah-chip:hover { transform: translateY(-1px); background: rgba(255,255,255,.72); }

    .ah-chatbot-inputbar {
      padding: 10px 12px 12px;
      border-top: 1px solid rgba(25,22,20,.08);
      background: rgba(237,229,216,.7);
    }
    .ah-input-row {
      display: flex; gap: 10px; align-items: center;
    }
    .ah-input {
      flex: 1 1 auto;
      height: 40px;
      border-radius: 12px;
      border: 1px solid rgba(25,22,20,.12);
      background: rgba(255,255,255,.55);
      padding: 0 12px;
      outline: none;
      font-size: 13px;
      color: #191614;
    }
    .ah-input::placeholder { color: rgba(25,22,20,.45); }

    .ah-send {
      height: 40px;
      border-radius: 12px;
      border: 1px solid rgba(25,22,20,.18);
      background: #191614;
      color: #F4EFE6;
      font-weight: 700;
      padding: 0 14px;
      cursor: pointer;
      transition: transform .12s ease, background .12s ease;
    }
    .ah-send:hover { transform: translateY(-1px); background: #2a2421; }
    .ah-send:active { transform: translateY(0px); }

    .ah-assistant-actions { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
    .ah-action-btn {
      display: inline-flex; align-items: center; gap: 8px;
      border-radius: 12px;
      padding: 9px 10px;
      font-size: 12px;
      border: 1px solid rgba(25,22,20,.14);
      background: rgba(255,255,255,.65);
      cursor: pointer;
      user-select: none;
    }
    .ah-action-btn:hover { background: rgba(255,255,255,.86); }
  `;

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeVietnamese(text) {
    const s = String(text || "");
    try {
      return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    } catch (_) {
      return s.toLowerCase().trim();
    }
  }

  function getPageVariant() {
    const p = window.location.pathname || "";
    if (p.includes("/desktop/")) return "desktop";
    if (p.includes("/mobile/")) return "mobile";
    return "root";
  }

  function getUrlForRooms() {
    const v = getPageVariant();
    if (v === "desktop") return "roomsDesktop.html";
    if (v === "mobile") return "roomsMobile.html";
    return "rooms.html";
  }

  function getUrlForContact() {
    const v = getPageVariant();
    if (v === "desktop") return "contactDesktop.html";
    if (v === "mobile") return "contactMobile.html";
    return "contact.html";
  }

  function getUrlForBooking(roomId) {
    const v = getPageVariant();
    const base = v === "desktop" ? "bookingDesktop.html" : v === "mobile" ? "bookingMobile.html" : "booking.html";
    if (!roomId) return base;
    const url = new URL(base, window.location.href);
    url.searchParams.set("room", roomId);
    return url.pathname + "?" + url.searchParams.toString();
  }

  function findRoomFromText(textNormalized) {
    const t = textNormalized;
    // Match by id/name
    for (const r of ROOMS) {
      if (t.includes(r.id) || t.includes(r.name.toLowerCase())) return r;
    }

    // Extra Vietnamese matching
    if (t.includes("romantic")) return ROOMS[0];
    if (t.includes("sky")) return ROOMS[1];
    if (t.includes("cinema")) return ROOMS[2];
    if (t.includes("nature")) return ROOMS[3];
    if (t.includes("minimal")) return ROOMS[4];
    return null;
  }

  function formatPrice(room) {
    if (!room) return "";
    return `${room.priceK.toLocaleString()}k`;
  }

  function buildAssistantResponse(text) {
    const t = normalizeVietnamese(text);
    const has = (arr) => arr.some((k) => t.includes(k));

    // Quick intent: greet
    if (has(["chao", "xin chao", "hello", "hi", "hey"])) {
      return {
        text:
          "Chào bạn! Mình là trợ lý của Another House. Bạn muốn mình giúp gì: chọn phòng theo mood hay tư vấn đặt phòng?",
        actions: [
          { label: "Đặt phòng ngay", url: getUrlForBooking() },
          { label: "Xem phòng", url: getUrlForRooms() },
          { label: "Giờ nhận/trả", url: null, type: "faq_hours" },
        ],
      };
    }

    const wantsBooking = has([
      "dat phong",
      "datphong",
      "booking",
      "book",
      "reserve",
      "reservation",
      "dat ngay",
      "book ngay",
      "dat phong ngay",
    ]);

    // If user only mentions a room concept (e.g. "Romantic", "Sky"), respond with that room.
    const roomMentioned = findRoomFromText(t);
    if (roomMentioned && !wantsBooking) {
      return {
        text:
          `Gợi ý ${roomMentioned.name}: ${roomMentioned.vibe}\n` +
          `Giá: ${formatPrice(roomMentioned)} / đêm.\n` +
          `Điểm nổi bật: ${roomMentioned.highlights.join(", ")}.`,
        actions: [
          { label: "Đặt phòng", url: getUrlForBooking(roomMentioned.id) },
          { label: "Xem tất cả phòng", url: getUrlForRooms() },
          { label: "Hỏi giờ nhận/trả", url: null, type: "faq_hours" },
        ],
      };
    }

    // Booking / reservation
    if (has(["dat phong", "datphong", "booking", "book", "reserve", "reservation", "dat ngay", "book ngay", "dat phong ngay"])) {
      const room = findRoomFromText(t);
      const roomText = room ? `mình đề xuất ${room.name} (${formatPrice(room)} / đêm). ` : "";
      return {
        text:
          `${roomText}Bạn chỉ cần chọn concept phòng, chọn ngày check-in/check-out và điền thông tin. Mình sẽ mở trang đặt phòng để bạn tiếp tục nhé.`,
        actions: [
          { label: "Đi đến đặt phòng", url: getUrlForBooking(room ? room.id : null) },
          { label: "Hỏi giờ nhận/trả", url: null, type: "faq_hours" },
          { label: "Hỏi giá phòng", url: null, type: "faq_price" },
        ],
      };
    }

    // FAQ: Check-in / Check-out
    if (has(["gio nhan", "gio nhan phong", "nhan phong", "checkin", "check-in", "check in", "checkin", "check-in", "checkin date", "nhan", "checkin"]) ||
        has(["gio tra", "tra phong", "checkout", "check-out", "check out", "check out", "check-out date", "tra"]) ) {
      return {
        text:
          "Giờ tiêu chuẩn:\n- Check-in: từ 2:00 PM\n- Check-out: trước 12:00 PM\nNếu bạn cần sớm hơn/muộn hơn, bên mình có thể hỗ trợ Early check-in / Late check-out theo yêu cầu.",
        actions: [
          { label: "Đi đến đặt phòng", url: getUrlForBooking(null) },
          { label: "Xem phòng", url: getUrlForRooms() },
        ],
      };
    }

    // FAQ: Pets / No smoking
    if (has(["thucung", "thu cung", "pet", "cho", "cho meo", "meo", "dog", "cat"])) {
      return {
        text: "Bên mình có Pets welcome. Nếu bạn cho thú cưng đi cùng, bạn có thể ghi chú trong mục yêu cầu đặc biệt để team sắp xếp phù hợp.",
        actions: [
          { label: "Đi đến đặt phòng", url: getUrlForBooking(null) },
          { label: "Liên hệ", url: getUrlForContact() },
        ],
      };
    }
    if (has(["hut thuoc", "hut thuoc", "no smoking", "khong hut thuoc", "smoking"])) {
      return {
        text: "No smoking. Nếu cần, bạn có thể hỏi thêm team tại thời điểm nhận phòng.",
        actions: [{ label: "Liên hệ", url: getUrlForContact() }],
      };
    }

    // FAQ: WiFi / Internet
    if (has(["wifi", "free wifi", "internet", "wi fi"])) {
      return {
        text: "Có sẵn Free WiFi trong các phòng. Bạn cứ yên tâm kết nối khi nghỉ ngơi nhé.",
        actions: [{ label: "Xem phòng", url: getUrlForRooms() }],
      };
    }

    // Room questions / concepts / list
    if (has(["phong", "concept", "danh sach phong", "room", "hợp", "hop", "mood"])) {
      // If user mentions a room concept
      const room = findRoomFromText(t);
      if (room) {
        return {
          text:
            `Gợi ý ${room.name}: ${room.vibe}\n` +
            `Giá: ${formatPrice(room)} / đêm.\n` +
            `Điểm nổi bật: ${room.highlights.join(", ")}.`,
          actions: [
            { label: "Đặt phòng", url: getUrlForBooking(room.id) },
            { label: "Xem tất cả phòng", url: getUrlForRooms() },
          ],
        };
      }

      return {
        text:
          "Mỗi concept phòng là một mood riêng:\n" +
          "Romantic, Sky, Cinema, Nature, Minimal.\n" +
          "Bạn muốn cảm giác thiên về: lãng mạn / nhẹ nhàng / điện ảnh / gần gũi thiên nhiên / tối giản – mình gợi ý nhanh cho bạn.",
        actions: [
          { label: "Romantic", url: null, type: "pick_room", roomId: "romantic" },
          { label: "Sky", url: null, type: "pick_room", roomId: "sky" },
          { label: "Cinema", url: null, type: "pick_room", roomId: "cinema" },
          { label: "Nature", url: null, type: "pick_room", roomId: "nature" },
          { label: "Minimal", url: null, type: "pick_room", roomId: "minimal" },
        ],
      };
    }

    // Prices
    if (has(["gia", "price", "bao nhieu", "bao nhiêu", "bao gia", "cost"])) {
      const lines = ROOMS.map((r) => `${r.name}: ${formatPrice(r)} / đêm`).join("\n");
      return {
        text: "Bảng giá tham khảo theo concept:\n" + lines,
        actions: [
          { label: "Đặt phòng", url: getUrlForBooking(null) },
          { label: "Xem phòng", url: getUrlForRooms() },
        ],
      };
    }

    // Generic booking help: if the user mentions dates or guests
    if (has(["check-in", "checkin", "check-out", "checkout", "ngay", "date", "sang", "tomorrow", "hom nay", "hom nay", "1", "2"]) && has(["dat"])) {
      return {
        text:
          "Bạn cho mình biết bạn muốn ở ngày nào và bao nhiêu người nhé. Sau đó mình sẽ mở trang đặt phòng để bạn chọn phòng phù hợp và hoàn tất thông tin.",
        actions: [{ label: "Đi đến đặt phòng", url: getUrlForBooking(null) }],
      };
    }

    // Fallback
    return {
      text:
        "Mình có thể giúp bạn:\n" +
        "- Tư vấn chọn concept phòng (Romantic / Sky / Cinema / Nature / Minimal)\n" +
        "- Trả lời FAQ: giờ check-in/check-out, pets welcome, no smoking, WiFi\n" +
        "- Chỉ đường đi đến trang đặt phòng\n\nBạn muốn hỏi gì trước?",
      actions: [
        { label: "Đặt phòng ngay", url: getUrlForBooking(null) },
        { label: "Giờ nhận/trả", url: null, type: "faq_hours" },
        { label: "Liên hệ", url: getUrlForContact() },
      ],
    };
  }

  function injectStyles() {
    if (document.getElementById("ah-chatbot-style")) return;
    const style = document.createElement("style");
    style.id = "ah-chatbot-style";
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function createElement(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "className") el.className = v;
        else el.setAttribute(k, v);
      }
    }
    return el;
  }

  function renderMessage(container, { role, text }) {
    const msg = createElement("div", { className: `ah-msg ${role}` });
    const bubble = createElement("div", { className: "ah-bubble" });
    bubble.textContent = text;
    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function renderAssistantActions(container, actions) {
    if (!actions || !actions.length) return;
    const msg = container.lastElementChild;
    if (!msg) return;

    const bubble = msg.querySelector(".ah-bubble");
    if (!bubble) return;

    const wrap = createElement("div", { className: "ah-assistant-actions" });

    actions.forEach((a) => {
      const btn = createElement("div", { className: "ah-action-btn" });
      btn.textContent = a.label;
      btn.addEventListener("click", () => handleAssistantAction(a));
      wrap.appendChild(btn);
    });

    bubble.appendChild(wrap);
  }

  function renderTyping(container) {
    const wrap = createElement("div", { className: "ah-typing" });
    wrap.innerHTML = `<span class="ah-dot"></span><span class="ah-dot"></span><span class="ah-dot"></span>`;
    const msg = createElement("div", { className: "ah-msg assistant" });
    const bubble = createElement("div", { className: "ah-bubble" });
    bubble.appendChild(wrap);
    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return msg;
  }

  function getWidgetEls(root) {
    return {
      fab: root.querySelector("[data-role='fab']"),
      panel: root.querySelector("[data-role='panel']"),
      close: root.querySelector("[data-role='close']"),
      messages: root.querySelector("[data-role='messages']"),
      input: root.querySelector("[data-role='input']"),
      send: root.querySelector("[data-role='send']"),
      quick: root.querySelector("[data-role='quick']"),
    };
  }

  function buildQuickChips(quickEl, chips, handler) {
    if (!quickEl) return;
    quickEl.innerHTML = "";
    chips.forEach((chip) => {
      const b = createElement("div", { className: "ah-chip" });
      b.textContent = chip.label;
      b.addEventListener("click", () => handler(chip.id, chip.label));
      quickEl.appendChild(b);
    });
  }

  function handleAssistantAction(action) {
    // action.type is optional.
    if (action.type === "faq_hours") {
      handleUserMessage("giờ nhận/trả phòng");
      return;
    }
    if (action.type === "faq_price") {
      handleUserMessage("giá phòng bao nhiêu");
      return;
    }
    if (action.type === "pick_room" && action.roomId) {
      const room = ROOMS.find((r) => r.id === action.roomId);
      handleUserMessage(room ? room.name : action.roomId);
      return;
    }

    if (action.url) {
      window.location.href = action.url;
      return;
    }
  }

  let els = null;
  let isBotTyping = false;

  function setOpen(open) {
    if (!els) return;
    if (open) {
      els.panel.classList.add(PANEL_OPEN_CLASS);
      els.input?.focus?.();
    } else {
      els.panel.classList.remove(PANEL_OPEN_CLASS);
    }
  }

  function handleUserMessage(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed || isBotTyping) return;

    // Render user bubble
    renderMessage(els.messages, { role: "user", text: trimmed });

    // Typing indicator + assistant response
    isBotTyping = true;
    const typingNode = renderTyping(els.messages);

    window.setTimeout(() => {
      typingNode.remove();
      const resp = buildAssistantResponse(trimmed);

      renderMessage(els.messages, { role: "assistant", text: resp.text });
      renderAssistantActions(els.messages, resp.actions);

      isBotTyping = false;
      els.input.value = "";
      els.messages.scrollTop = els.messages.scrollHeight;
    }, 520);
  }

  function init() {
    injectStyles();
    if (document.getElementById(WIDGET_ID)) return;

    const root = createElement("div", { id: WIDGET_ID });
    root.setAttribute("aria-live", "polite");

    root.innerHTML = `
      <button type="button" class="ah-chatbot-fab" data-role="fab" aria-label="Open chat">
        ?
      </button>

      <div class="ah-chatbot-panel" data-role="panel" aria-label="Chat panel">
        <div class="ah-chatbot-header">
          <div class="ah-chatbot-brand">
            <div class="ah-chatbot-avatar">AH</div>
            <div style="min-width:0;">
              <div class="ah-chatbot-title">Another House Assistant</div>
              <div class="ah-chatbot-subtitle">Tư vấn đặt phòng & FAQ</div>
            </div>
          </div>
          <button type="button" class="ah-chatbot-close" data-role="close" aria-label="Close chat">×</button>
        </div>

        <div class="ah-chatbot-messages" data-role="messages" role="log" aria-live="polite"></div>

        <div class="ah-chatbot-quick" data-role="quick" aria-label="Quick replies"></div>

        <div class="ah-chatbot-inputbar">
          <div class="ah-input-row">
            <input data-role="input" class="ah-input" type="text" placeholder="Nhắn gì đó… (VD: đặt phòng, giờ nhận/trả, WiFi…)" autocomplete="off" />
            <button data-role="send" class="ah-send" type="button">Gửi</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    els = getWidgetEls(root);

    // Quick replies
    buildQuickChips(els.quick, QUICK_REPLIES, (id, label) => {
      if (id === "q_book") handleUserMessage("đặt phòng ngay");
      else if (id === "q_room") handleUserMessage("gợi ý phòng theo mood");
      else if (id === "q_hours") handleUserMessage("giờ nhận/trả phòng");
      else if (id === "q_pets") handleUserMessage("có cho thú cưng không");
      else if (id === "q_wifi") handleUserMessage("wifi có sẵn không");
      else if (id === "q_price") handleUserMessage("giá phòng bao nhiêu");
      else handleUserMessage(label);
    });

    // Events
    els.fab.addEventListener("click", () => setOpen(true));
    els.close.addEventListener("click", () => setOpen(false));

    els.send.addEventListener("click", () => handleUserMessage(els.input.value));
    els.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleUserMessage(els.input.value);
    });

    // Welcome message (only when opened initially we keep it simple)
    const welcomeText =
      "Xin chào! Bạn cần mình giúp đặt phòng hay trả lời câu hỏi thường gặp?\n" +
      "Bạn có thể nói: “đặt phòng”, “giờ nhận/trả”, “pets welcome”, “WiFi”, “giá phòng”…";
    // Show welcome immediately when panel opens for the first time.
    let greeted = false;
    els.fab.addEventListener("click", () => {
      if (!greeted) {
        renderMessage(els.messages, { role: "assistant", text: welcomeText });
        greeted = true;
      }
    }, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
