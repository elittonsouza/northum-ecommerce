(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  var waNumber = digits(C.WHATSAPP_NUMERO);
  var hasWhatsApp = waNumber.length >= 12 && !/X/i.test(C.WHATSAPP_NUMERO || "");

  function waLink(text) {
    return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  // ---------- Analytics (preparado, sem ferramenta instalada) ----------
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
  }

  // ---------- Dados do config.js ----------
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var v = C[el.getAttribute("data-config")];
    if (v) el.textContent = v;
  });

  var showPrice = C.MOSTRAR_PRECO !== false;
  document.querySelectorAll("[data-show-if]").forEach(function (el) {
    var cond = el.getAttribute("data-show-if");
    var visible =
      (cond === "price" && showPrice) ||
      (cond === "no-price" && !showPrice) ||
      (cond === "whatsapp" && hasWhatsApp);
    el.classList.toggle("is-hidden", !visible);
  });

  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.href = waLink("Olá! Quero conversar sobre o meu e-commerce com a Northum.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  var contact = document.getElementById("footer-contact");
  if (contact) {
    var items = [];
    if (hasWhatsApp) items.push('<li><a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    if (C.EMAIL_CONTATO) items.push('<li><a href="mailto:' + C.EMAIL_CONTATO + '">' + C.EMAIL_CONTATO + "</a></li>");
    if (C.INSTAGRAM_URL) items.push('<li><a href="' + C.INSTAGRAM_URL + '" target="_blank" rel="noopener">Instagram</a></li>');
    if (C.LINKEDIN_URL) items.push('<li><a href="' + C.LINKEDIN_URL + '" target="_blank" rel="noopener">LinkedIn</a></li>');
    if (C.CIDADE_UF) items.push("<li>" + C.CIDADE_UF + "</li>");
    if (C.CNPJ) items.push("<li>CNPJ " + C.CNPJ + "</li>");
    contact.innerHTML = items.join("");
  }

  // ---------- Header e menu ----------
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu");

  // Some ao rolar para baixo e volta ao rolar para cima (ou perto do topo).
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    var menuOpen = nav.classList.contains("open");
    var focusInside = header.contains(document.activeElement) && document.activeElement !== document.body;
    if (y < 120 || menuOpen || focusInside) header.classList.remove("is-hidden");
    else if (y > lastY + 4) header.classList.add("is-hidden");
    else if (y < lastY - 4) header.classList.remove("is-hidden");
    if (Math.abs(y - lastY) > 4) lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  // Navegação por teclado: o menu reaparece ao receber foco.
  header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // ---------- CTAs: rastrear; os de diagnóstico abrem o pop-up de aplicação ----------
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      track("cta_click", { origem: el.getAttribute("data-cta") });
      if (el.classList.contains("js-whatsapp")) track("whatsapp_click", { origem: el.getAttribute("data-cta") });
      if (el.getAttribute("href") === "#diagnostico" && applyDialog) {
        e.preventDefault();
        openApply(el);
      }
    });
  });

  // ---------- Vídeo do hero ----------
  var heroPlayer = document.getElementById("hero-player");
  var heroVideo = document.getElementById("hero-video");
  var heroPlay = document.getElementById("hero-play");
  if (heroPlayer && heroVideo && heroPlay) {
    // Sem JavaScript o vídeo mantém os controles nativos; com ele, a capa fica limpa até o play.
    heroVideo.controls = false;
    var heroTrack = heroVideo.textTracks && heroVideo.textTracks[0];
    var heroPlayText = heroPlay.getAttribute("aria-label");
    var marks = {};
    function mark(name) { if (!marks[name]) { marks[name] = true; track(name, { video: "institucional" }); } }

    // Assistir com som, do início, com os controles do navegador.
    function playWithSound() {
      var wasPreview = heroPlayer.classList.contains("is-preview");
      heroPlayer.classList.remove("is-preview");
      heroPlayer.classList.add("is-playing");
      heroVideo.loop = false;
      heroVideo.muted = false;
      heroVideo.controls = true;
      if (wasPreview) { heroVideo.currentTime = 0; track("video_unmute", { video: "institucional" }); }
      if (heroTrack) heroTrack.mode = "disabled";
      var p = heroVideo.play();
      if (p && p.then) p.then(function () { mark("video_play"); });
      if (p && p.catch) p.catch(function () { heroPlayer.classList.remove("is-playing"); });
      heroVideo.focus({ preventScroll: true });
    }
    heroPlay.addEventListener("click", playWithSound);
    heroVideo.addEventListener("click", function () { if (heroPlayer.classList.contains("is-preview")) playWithSound(); });

    // Começa sozinho, sem som e com legendas: os navegadores só permitem autoplay mudo.
    // O som só é ligado por um clique (playWithSound); a prévia nunca perde o mudo sozinha.
    // Se o celular bloquear o autoplay (ex.: modo de economia de bateria do iPhone),
    // a prévia começa no primeiro toque na página.
    function retryOnFirstTouch() {
      var events = ["touchend", "click", "keydown"];
      function go() {
        events.forEach(function (ev) { document.removeEventListener(ev, go, true); });
        startPreview();
      }
      events.forEach(function (ev) { document.addEventListener(ev, go, true); });
    }
    function startPreview() {
      if (heroPlayer.classList.contains("is-playing")) return;
      heroVideo.muted = true;
      heroVideo.loop = true;
      heroVideo.preload = "auto";
      if (heroTrack) heroTrack.mode = "showing";
      var auto = heroVideo.play();
      if (!auto || !auto.then) return;
      auto.then(function () {
        if (heroPlayer.classList.contains("is-playing")) return;
        heroPlayer.classList.add("is-preview");
        heroPlay.setAttribute("aria-label", "Ativar o som e assistir ao vídeo do início");
        track("video_autoplay", { video: "institucional" });
      }).catch(function (err) {
        if (heroPlayer.classList.contains("is-playing")) return;
        // Aba em segundo plano: o navegador interrompe vídeos mudos; tenta de novo quando ela ficar visível.
        if (err && err.name === "AbortError" && document.hidden) {
          document.addEventListener("visibilitychange", function retry() {
            if (document.hidden) return;
            document.removeEventListener("visibilitychange", retry);
            startPreview();
          });
          return;
        }
        // Autoplay bloqueado: fica a capa com o botão de play até o primeiro toque.
        heroVideo.pause();
        heroVideo.loop = false;
        if (heroTrack) heroTrack.mode = "disabled";
        heroPlay.setAttribute("aria-label", heroPlayText);
        retryOnFirstTouch();
      });
    }
    if (document.hidden) {
      document.addEventListener("visibilitychange", function firstShow() {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", firstShow);
        startPreview();
      });
    } else {
      startPreview();
    }

    // Analytics: início, metade e fim (uma vez cada)
    // Só conta quem assiste com som; a prévia muda tem o próprio evento (video_autoplay).
    heroVideo.addEventListener("play", function () { if (!heroVideo.muted) mark("video_play"); });
    heroVideo.addEventListener("timeupdate", function () {
      if (!heroVideo.muted && heroVideo.duration && heroVideo.currentTime / heroVideo.duration >= 0.5) mark("video_50");
    });
    heroVideo.addEventListener("ended", function () { if (!heroVideo.muted) mark("video_complete"); });
  }

  // ---------- Entrada dos blocos ao rolar ----------
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // pequenos atrasos em grupos lado a lado
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); });
        var i = siblings.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 5) * 70 : 0) + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ---------- WhatsApp flutuante some perto do formulário ----------
  var fab = document.querySelector(".wa-float");
  var diag = document.getElementById("diagnostico");
  if (fab && diag && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      fab.classList.toggle("tucked", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(diag);
  }

  // ---------- Pop-up de aplicação para o diagnóstico gratuito ----------
  // Passo 1: contato e se tem loja. Passo 2: sobre a loja. Envio: FORM_ENDPOINT → WhatsApp → aviso.
  var applyDialog = document.getElementById("apply-dialog");
  var form = document.getElementById("apply-form");
  var status = document.getElementById("form-status");
  var lastTrigger = null;
  var applyOrigin = "";
  var steps = form ? form.querySelectorAll(".apply-step") : [];
  var bars = form ? form.querySelectorAll(".apply-progress i") : [];

  // UTMs da URL vão junto com a aplicação
  var utm = {};
  new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v; });

  function showStep(name) {
    steps.forEach(function (s) { s.hidden = s.getAttribute("data-step") !== name; });
    bars.forEach(function (b, i) { b.classList.toggle("on", name === "done" || i < Number(name)); });
    form.querySelector(".apply-progress").hidden = name === "done";
    var focusEl = form.querySelector('.apply-step[data-step="' + name + '"] ' + (name === "done" ? ".apply-title" : "input, select"));
    if (focusEl) focusEl.focus();
    applyDialog.scrollTop = 0;
  }

  function openApply(trigger) {
    lastTrigger = trigger || null;
    applyOrigin = (trigger && trigger.getAttribute("data-cta")) || "";
    if (form.querySelector('[data-step="done"]').hidden === false) { form.reset(); setStatus("", ""); }
    if (typeof applyDialog.showModal === "function") applyDialog.showModal();
    else applyDialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
    if (form.querySelector('[data-step="2"]').hidden) showStep("1");
    track("apply_open", { origem: applyOrigin });
  }
  function closeApply() {
    if (typeof applyDialog.close === "function") applyDialog.close();
    else { applyDialog.removeAttribute("open"); onClose(); }
  }
  function onClose() {
    document.body.classList.remove("dialog-open");
    if (!form.querySelector('[data-step="done"]').hidden) { form.reset(); showStep("1"); setStatus("", ""); }
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  if (!applyDialog || !form) return;
  applyDialog.addEventListener("close", onClose);
  applyDialog.addEventListener("click", function (e) { if (e.target === applyDialog) closeApply(); });
  form.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeApply); });
  if (location.hash === "#aplicar") openApply(null);

  function hasStore() {
    var c = form.querySelector('input[name="tem_loja"]:checked');
    return !c || c.value === "Sim";
  }
  function phoneDigits(v) {
    var d = digits(v);
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    return d;
  }

  var rules = {
    nome: function (v) { return v.trim().length >= 2 || "Informe seu nome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Informe um e-mail válido."; },
    whatsapp: function (v) { var d = phoneDigits(v); return (d.length === 10 || d.length === 11) || "Informe o WhatsApp com DDD."; },
    tem_loja: function () { return !!form.querySelector('input[name="tem_loja"]:checked') || "Selecione uma opção."; },
    segmento: function (v) { return !!v || "Selecione o segmento."; },
    faturamento: function (v) { return !hasStore() || !!v || "Selecione uma faixa, ou \"Prefiro não informar\"."; },
    equipe: function (v) { return !!v || "Selecione o tamanho da equipe."; },
  };
  var stepFields = { 1: ["nome", "email", "whatsapp", "tem_loja"], 2: ["segmento", "faturamento", "equipe"] };

  function check(name) {
    var el = form.elements[name];
    var target = el.length && !el.tagName ? el[0] : el;
    var res = rules[name](el.value || "", el);
    var err = document.getElementById("e-" + name);
    var ok = res === true;
    target.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) {
      err.textContent = ok ? "" : res;
      if (!ok) target.setAttribute("aria-describedby", err.id); else target.removeAttribute("aria-describedby");
    }
    return ok;
  }
  function checkStep(n) {
    var firstBad = null;
    stepFields[n].forEach(function (name) {
      if (!check(name) && !firstBad) { var el = form.elements[name]; firstBad = el.length && !el.tagName ? el[0] : el; }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  ["nome", "email", "whatsapp"].forEach(function (name) {
    form.elements[name].addEventListener("blur", function () { if (this.value) check(name); });
  });
  ["segmento", "faturamento", "equipe"].forEach(function (name) {
    form.elements[name].addEventListener("change", function () { check(name); });
  });

  // Máscara do WhatsApp: (11) 98765-4321
  form.elements.whatsapp.addEventListener("input", function () {
    var d = phoneDigits(this.value).slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(d.length - 4);
    this.value = out;
  });

  // Sem loja: o passo 2 fala do projeto e não pede faturamento nem site.
  function applyStoreMode() {
    var store = hasStore();
    form.querySelectorAll("[data-text-loja]").forEach(function (el) {
      el.textContent = el.getAttribute(store ? "data-text-loja" : "data-text-sem-loja");
    });
    form.querySelectorAll("[data-only-loja]").forEach(function (el) { el.hidden = !store; });
  }
  form.querySelectorAll('input[name="tem_loja"]').forEach(function (r) {
    r.addEventListener("change", function () { check("tem_loja"); applyStoreMode(); });
  });

  document.getElementById("apply-next").addEventListener("click", function () {
    if (!checkStep(1)) return;
    applyStoreMode();
    track("apply_step1", { origem: applyOrigin, tem_loja: hasStore() ? "sim" : "nao" });
    showStep("2");
  });
  document.getElementById("apply-back").addEventListener("click", function () { setStatus("", ""); showStep("1"); });
  // Enter no passo 1 avança em vez de enviar
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !form.querySelector('[data-step="1"]').hidden && e.target.tagName === "INPUT") {
      e.preventDefault();
      document.getElementById("apply-next").click();
    }
  });

  function setStatus(kind, msg) {
    status.className = "form-status " + kind;
    status.textContent = msg;
  }

  function summary(d) {
    return [
      "Olá! Quero aplicar para o diagnóstico gratuito da Northum.",
      "",
      "Nome: " + d.nome,
      "E-mail: " + d.email,
      "WhatsApp: " + d.whatsapp,
      "Tem loja: " + d.tem_loja,
      "Segmento: " + d.segmento,
      d.faturamento ? "Faturamento mensal: " + d.faturamento : "",
      "Equipe: " + d.equipe,
      d.site ? "Site: " + d.site : "",
    ].filter(Boolean).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!checkStep(1)) { showStep("1"); checkStep(1); return; }
    if (!checkStep(2)) return;
    var store = hasStore();

    var data = Object.assign({
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      whatsapp: "+55" + phoneDigits(form.whatsapp.value),
      tem_loja: store ? "Sim" : "Não",
      segmento: form.segmento.value,
      faturamento: store ? form.faturamento.value : "",
      equipe: form.equipe.value,
      site: store ? form.site.value.trim() : "",
      aceite_politica_privacidade: true,
      origem: "site" + (applyOrigin ? ":" + applyOrigin : ""),
      pagina: location.pathname,
      enviado_em: new Date().toISOString(),
    }, utm);

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;

    function done(text) {
      track("form_submit", { origem: applyOrigin, tem_loja: store ? "sim" : "nao", faturamento: data.faturamento, equipe: data.equipe });
      if (text) document.getElementById("apply-done-text").textContent = text;
      setStatus("", "");
      showStep("done");
    }

    if (C.FORM_ENDPOINT) {
      btn.disabled = true;
      btn.textContent = "Enviando…";
      setStatus("", "");
      fetch(C.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          setStatus("fail", "Não foi possível enviar agora. Tente de novo em instantes" + (hasWhatsApp ? " ou fale conosco pelo WhatsApp." : "."));
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    } else if (hasWhatsApp) {
      window.open(waLink(summary(data)), "_blank", "noopener");
      done("Abrimos o WhatsApp com as suas respostas. É só enviar a mensagem para combinarmos o diagnóstico.");
    } else {
      setStatus("fail", "O envio ainda não está configurado. Defina FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
      console.warn("[site] Formulário sem destino: configure FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
    }
  });
})();
