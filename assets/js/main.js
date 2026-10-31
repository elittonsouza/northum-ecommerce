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
    a.href = waLink("Olá! Quero conversar sobre o Método Conversão 7D.");
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

  // ---------- CTAs: rastrear e focar o formulário ----------
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      track("cta_click", { origem: el.getAttribute("data-cta") });
      if (el.classList.contains("js-whatsapp")) track("whatsapp_click", { origem: el.getAttribute("data-cta") });
      if (el.getAttribute("href") === "#diagnostico") {
        setTimeout(function () {
          var first = document.getElementById("f-nome");
          if (first) first.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 500);
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
    function mark(name) { if (!marks[name]) { marks[name] = true; track(name, { video: "apresentacao" }); } }

    // Assistir com som, do início, com os controles do navegador.
    function playWithSound() {
      var wasPreview = heroPlayer.classList.contains("is-preview");
      heroPlayer.classList.remove("is-preview");
      heroPlayer.classList.add("is-playing");
      heroVideo.loop = false;
      heroVideo.muted = false;
      heroVideo.controls = true;
      if (wasPreview) { heroVideo.currentTime = 0; track("video_unmute", { video: "apresentacao" }); }
      if (heroTrack) heroTrack.mode = "disabled";
      var p = heroVideo.play();
      if (p && p.then) p.then(function () { mark("video_play"); });
      if (p && p.catch) p.catch(function () { heroPlayer.classList.remove("is-playing"); });
      heroVideo.focus({ preventScroll: true });
    }
    heroPlay.addEventListener("click", playWithSound);
    heroVideo.addEventListener("click", function () { if (heroPlayer.classList.contains("is-preview")) playWithSound(); });

    // Começa sozinho, sem som e com legendas: os navegadores só permitem autoplay mudo.
    // Não inicia para quem pediu menos movimento ou economia de dados.
    // O som só é ligado por um clique (playWithSound); a prévia nunca perde o mudo sozinha.
    var saveData = navigator.connection && navigator.connection.saveData;
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
        track("video_autoplay", { video: "apresentacao" });
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
        // Autoplay bloqueado: fica a capa com o botão de play.
        heroVideo.pause();
        heroVideo.loop = false;
        if (heroTrack) heroTrack.mode = "disabled";
        heroPlay.setAttribute("aria-label", heroPlayText);
      });
    }
    if (!reduceMotion && !saveData) {
      if (document.hidden) {
        document.addEventListener("visibilitychange", function firstShow() {
          if (document.hidden) return;
          document.removeEventListener("visibilitychange", firstShow);
          startPreview();
        });
      } else {
        startPreview();
      }
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

  // ---------- Formulário ----------
  var form = document.getElementById("diag-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  var rules = {
    nome: function (v) { return v.trim().length >= 2 || "Informe seu nome."; },
    contato: function (v) {
      v = v.trim();
      var email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      var phone = digits(v).length >= 10;
      return email || phone || "Informe um e-mail válido ou um WhatsApp com DDD.";
    },
    loja: function (v) { return v.trim().length >= 2 || "Informe o nome da loja ou o endereço do site."; },
    papel: function (v) { return !!v || "Selecione o seu papel."; },
    canal: function (v) { return !!v || "Selecione o principal canal de dúvidas."; },
    volume: function (v) { return !!v || "Selecione uma faixa de volume, ou \"Não sei\"."; },
    lgpd: function (_, el) { return el.checked || "Para entrarmos em contato, marque a concordância."; },
  };

  function check(name) {
    var el = form.elements[name];
    var res = rules[name](el.value, el);
    var err = document.getElementById("e-" + name);
    var ok = res === true;
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) {
      err.textContent = ok ? "" : res;
      if (!ok) el.setAttribute("aria-describedby", err.id); else el.removeAttribute("aria-describedby");
    }
    return ok;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "blur", function () {
      if (el.getAttribute("aria-invalid") !== null || el.value) check(name);
    });
  });

  function setStatus(kind, msg) {
    status.className = "form-status " + kind;
    status.textContent = msg;
  }

  function summary(d) {
    return [
      "Olá! Quero solicitar um diagnóstico do Método Conversão 7D.",
      "",
      "Nome: " + d.nome,
      "Contato: " + d.contato,
      "Loja/site: " + d.loja,
      "Papel: " + d.papel,
      "Canal principal: " + d.canal,
      "Conversas de pré-venda/mês: " + d.volume,
      d.desafio ? "Maior desafio: " + d.desafio : "",
    ].filter(Boolean).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      if (!check(name) && !firstBad) firstBad = form.elements[name];
    });
    if (firstBad) { firstBad.focus(); return; }

    var data = {
      nome: form.nome.value.trim(),
      contato: form.contato.value.trim(),
      loja: form.loja.value.trim(),
      papel: form.papel.value,
      canal: form.canal.value,
      volume: form.volume.value,
      desafio: form.desafio.value.trim(),
      consentimento_lgpd: true,
      origem: "site",
      enviado_em: new Date().toISOString(),
    };

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;

    function done() {
      track("form_submit", { volume: data.volume, canal: data.canal });
      form.reset();
      form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
      setStatus("ok", "Recebemos seu pedido. Vamos entrar em contato para combinar o diagnóstico.");
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
      done();
      setStatus("ok", "Abrimos o WhatsApp com os seus dados. É só enviar a mensagem para combinarmos o diagnóstico.");
    } else {
      setStatus("fail", "O envio ainda não está configurado. Defina FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
      console.warn("[site] Formulário sem destino: configure FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
    }
  });
})();
