// Another House — shared page logic (navbar, rendering, gallery, booking UX)

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function formatPriceUSD(n) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function navInit() {
  const toggles = $all("[data-nav-toggle]");
  const panel = $("#mobileNav");
  const overlay = $("#navOverlay");
  if (!panel || toggles.length === 0) return;

  const open = () => {
    panel.classList.remove("hidden");
    overlay?.classList.remove("hidden");
    toggles.forEach((t) => t.setAttribute("aria-expanded", "true"));
    document.body.classList.add("overflow-hidden");
  };
  const close = () => {
    panel.classList.add("hidden");
    overlay?.classList.add("hidden");
    toggles.forEach((t) => t.setAttribute("aria-expanded", "false"));
    document.body.classList.remove("overflow-hidden");
  };

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = !panel.classList.contains("hidden");
      isOpen ? close() : open();
    });
  });

  overlay?.addEventListener("click", close);
  $all('a[data-navlink="1"]', panel).forEach((a) => a.addEventListener("click", close));

  // Active link underline (desktop)
  const path = location.pathname.split("/").pop() || "index.html";
  $all('a[data-navlink="1"]').forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(path)) a.classList.add("text-olive", "font-semibold");
  });
}

function renderRoomCard(room, variant = "grid") {
  const base = variant === "list" ? "md:flex md:items-stretch" : "";
  const imgClass =
    variant === "list"
      ? "md:w-72 md:shrink-0 h-56 md:h-full"
      : "h-56";

  return `
    <article class="${base} group rounded-2xl overflow-hidden border border-ink/10 bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all">
      <div class="relative ${imgClass} overflow-hidden">
        <img src="${escapeHtml(room.images[0])}" alt="${escapeHtml(room.name)}" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy"/>
        <div class="absolute inset-0 bg-gradient-to-t from-ink/40 via-ink/0 to-ink/0"></div>
        <div class="absolute left-4 bottom-4">
          <span class="inline-flex items-center gap-2 rounded-full bg-cream/90 px-3 py-1 text-xs tracking-wide text-ink">
            <span class="h-1.5 w-1.5 rounded-full bg-olive"></span>
            ${escapeHtml(room.concept)}
          </span>
        </div>
      </div>
      <div class="p-6 flex-1">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-display text-2xl text-ink leading-tight">${escapeHtml(room.name)}</h3>
            <p class="mt-2 text-sm text-ink/70">${escapeHtml(room.tagline)}</p>
          </div>
          <div class="text-right">
            <div class="text-ink font-semibold">${escapeHtml(formatPriceUSD(room.price))}</div>
            <div class="text-xs text-ink/60">/ night</div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink/70">
          <span class="rounded-full bg-cream px-3 py-1 border border-ink/10">Capacity: ${escapeHtml(room.capacity)} guests</span>
          <span class="rounded-full bg-cream px-3 py-1 border border-ink/10">Aesthetic: Luxury minimal</span>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-3">
          <a href="room.html?id=${encodeURIComponent(room.id)}"
             class="inline-flex items-center justify-center rounded-xl bg-olive px-4 py-2 text-sm font-semibold text-cream shadow-sm hover:bg-olive/90 transition-colors">
            View details
          </a>
          <a href="bookingDesktop.html?room=${encodeURIComponent(room.id)}"
             class="inline-flex items-center justify-center rounded-xl border border-ink/15 bg-white/70 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors">
            Book now
          </a>
        </div>
      </div>
    </article>
  `;
}

function homeInit() {
  const mount = $("#featuredRooms");
  if (!mount || !window.AH_ROOMS) return;
  const featured = window.AH_ROOMS.slice(0, 3);
  mount.innerHTML = featured.map((r) => renderRoomCard(r, "grid")).join("");
}

function roomsInit() {
  const mount = $("#roomsList");
  if (!mount || !window.AH_ROOMS) return;

  const conceptBtns = $all("[data-concept]");
  const render = (concept) => {
    const rooms = concept && concept !== "all" ? window.AH_ROOMS.filter((r) => r.id === concept || r.concept.toLowerCase() === concept) : window.AH_ROOMS;
    mount.innerHTML = rooms.map((r) => renderRoomCard(r, "list")).join("");
  };

  conceptBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      conceptBtns.forEach((b) => b.classList.remove("bg-olive", "text-cream", "border-olive"));
      btn.classList.add("bg-olive", "text-cream", "border-olive");
      render(btn.getAttribute("data-concept"));
    });
  });

  const initial = (getParam("concept") || "all").toLowerCase();
  const initialBtn = conceptBtns.find((b) => (b.getAttribute("data-concept") || "").toLowerCase() === initial);
  if (initialBtn) initialBtn.click();
  else render("all");
}

function roomDetailInit() {
  const id = getParam("id");
  if (!id || !window.AH_ROOMS) return;
  const room = window.AH_ROOMS.find((r) => r.id === id);
  if (!room) return;

  setText($("#roomName"), room.name);
  setText($("#roomConcept"), room.concept);
  setText($("#roomTagline"), room.tagline);
  setText($("#roomPrice"), formatPriceUSD(room.price));
  setText($("#roomCapacity"), `${room.capacity} guests`);

  const amenities = $("#amenities");
  if (amenities) {
    amenities.innerHTML = room.amenities
      .map(
        (a) => `
        <li class="flex items-start gap-3 rounded-xl border border-ink/10 bg-white/60 px-4 py-3">
          <span class="mt-1 h-2 w-2 rounded-full bg-gold"></span>
          <span class="text-sm text-ink/80">${escapeHtml(a)}</span>
        </li>`
      )
      .join("");
  }

  const mainImg = $("#galleryMain");
  const thumbs = $("#galleryThumbs");
  if (mainImg && thumbs) {
    mainImg.src = room.images[0];
    mainImg.alt = room.name;

    thumbs.innerHTML = room.images
      .map(
        (src, idx) => `
        <button type="button" class="group relative rounded-xl overflow-hidden border border-ink/10 focus:outline-none focus:ring-2 focus:ring-olive/60" data-thumb="${idx}">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(room.name)} thumbnail ${idx + 1}" class="h-20 w-28 object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy"/>
        </button>
      `
      )
      .join("");

    const setActive = (idx) => {
      mainImg.src = room.images[idx];
      $all("[data-thumb]", thumbs).forEach((b, i) => {
        b.classList.toggle("ring-2", i === idx);
        b.classList.toggle("ring-olive/70", i === idx);
      });
    };
    setActive(0);
    $all("[data-thumb]", thumbs).forEach((btn) => {
      btn.addEventListener("click", () => setActive(Number(btn.getAttribute("data-thumb"))));
    });
  }

  const bookLinks = $all("[data-book-room]");
  bookLinks.forEach((a) => {
    const url = new URL(a.getAttribute("href") || "bookingDesktop.html", location.href);
    url.searchParams.set("room", room.id);
    a.setAttribute("href", url.pathname + "?" + url.searchParams.toString());
  });

  // Mini booking form -> redirect to booking page
  const form = $("#miniBookingForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const checkin = $("#miniCheckin")?.value || "";
      const checkout = $("#miniCheckout")?.value || "";
      const guests = $("#miniGuests")?.value || "1";
      const url = new URL("booking.html", location.href);
      url.searchParams.set("room", room.id);
      if (checkin) url.searchParams.set("checkin", checkin);
      if (checkout) url.searchParams.set("checkout", checkout);
      url.searchParams.set("guests", guests);
      location.href = url.pathname + "?" + url.searchParams.toString();
    });
  }
}

function bookingInit() {
  const form = $("#bookingForm");
  if (!form || !window.AH_ROOMS) return;

  const roomId = getParam("room");
  const room = roomId ? window.AH_ROOMS.find((r) => r.id === roomId) : null;
  const updateSummary = (r) => {
    if (!r) {
      setText($("#bookingRoomName"), "Choose a room");
      setText($("#bookingRoomConcept"), "—");
      setText($("#bookingRoomPrice"), "—");
      return;
    }
    setText($("#bookingRoomName"), r.name);
    setText($("#bookingRoomConcept"), r.concept);
    setText($("#bookingRoomPrice"), formatPriceUSD(r.price));
  };
  updateSummary(room);

  // Prefill
  const checkin = getParam("checkin");
  const checkout = getParam("checkout");
  const guests = getParam("guests");
  if (checkin) $("#checkin") && ($("#checkin").value = checkin);
  if (checkout) $("#checkout") && ($("#checkout").value = checkout);
  if (guests) $("#guests") && ($("#guests").value = guests);
  if (roomId) $("#roomSelect") && ($("#roomSelect").value = roomId);

  // Update summary when room changes
  $("#roomSelect")?.addEventListener("change", (e) => {
    const val = e.target.value;
    const r = val ? window.AH_ROOMS.find((x) => x.id === val) : null;
    updateSummary(r);
  });

  const modal = $("#successModal");
  const modalClose = $("#successClose");
  const openModal = () => modal?.classList.remove("hidden");
  const closeModal = () => modal?.classList.add("hidden");
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      room: $("#roomSelect")?.value || "",
      checkin: $("#checkin")?.value || "",
      checkout: $("#checkout")?.value || "",
      guests: $("#guests")?.value || "",
      name: $("#name")?.value || "",
      phone: $("#phone")?.value || "",
      note: $("#note")?.value || ""
    };
    try {
      localStorage.setItem("ah_last_booking", JSON.stringify({ ...payload, createdAt: Date.now() }));
    } catch (_) {}
    openModal();
  });
}

function bookingRoomOptionsInit() {
  const select = $("#roomSelect");
  if (!select || !window.AH_ROOMS) return;
  select.innerHTML =
    `<option value="">Select a room</option>` +
    window.AH_ROOMS
      .map((r) => `<option value="${escapeHtml(r.id)}">${escapeHtml(r.name)} — ${escapeHtml(r.concept)}</option>`)
      .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  navInit();

  const page = document.body.getAttribute("data-page");
  if (page === "home") homeInit();
  if (page === "rooms") roomsInit();
  if (page === "room") roomDetailInit();
  if (page === "booking") {
    bookingRoomOptionsInit();
    bookingInit();
  }
});

