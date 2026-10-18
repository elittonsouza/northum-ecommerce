(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  var waNumber = digits(C.WHATSAPP_NUMERO);
  var hasWhatsApp = waNumber.length >= 12 && !/X/i.test(C.WHATSAPP_NUMERO || "");
  function waLink(text) { return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : ""); }

  window.dataLayer = window.dataLayer || [];
  function track(event, data) { window.dataLayer.push(Object.assign({ event: event, pagina: "vsl" }, data || {})); }

  // ---------- Dados do config.js ----------
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var v = C[el.getAttribute("data-config")];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-show-if="whatsapp"]').forEach(function (el) { el.classList.toggle("is-hidden", !hasWhatsApp); });
  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.href = waLink("Olá! Vim pela página do Método Conversão 7D e quero conversar sobre meu e-commerce.");
    a.target = "_blank";
    a.rel = "noopener";
    a.addEventListener("click", function () { track("whatsapp_click", { origem: a.getAttribute("data-cta") }); });
  });
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // ---------- Vídeo ----------
  // Converte links comuns (YouTube, Vimeo, .mp4) no formato de incorporação.
  function toEmbed(url) {
    url = String(url || "").trim();
    if (!/^https:\/\//i.test(url)) return null;
    var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
    if (m) return { type: "iframe", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?rel=0&modestbranding=1&playsinline=1" };
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m) return { type: "iframe", src: "https://player.vimeo.com/video/" + m[1] + "?dnt=1&title=0&byline=0&portrait=0" };
    if (/\.(mp4|webm)(\?|$)/i.test(url)) return { type: "video", src: url };
    return { type: "iframe", src: url }; // outro player que já forneça URL de embed
  }

  var player = document.getElementById("vsl-player");
  var embed = toEmbed(C.VSL_URL);
  if (player && embed) {
    var el;
    if (embed.type === "video") {
      el = document.createElement("video");
      el.controls = true;
      el.preload = "metadata";
      el.playsInline = true;
      el.src = embed.src;
    } else {
      el = document.createElement("iframe");
      el.src = embed.src;
      el.title = "Vídeo de apresentação do Método Conversão 7D";
      el.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      el.allowFullscreen = true;
      el.loading = "lazy";
      el.referrerPolicy = "strict-origin-when-cross-origin";
    }
    player.innerHTML = "";
    player.appendChild(el);
  } else if (C.VSL_URL) {
    console.warn("[vsl] VSL_URL precisa começar com https://");
  } else {
    console.info("[vsl] Vídeo não configurado: defina VSL_URL em config.js.");
  }

  // CTA abaixo do vídeo com atraso opcional (só quando há vídeo)
  var cta = document.getElementById("vsl-cta");
  var delay = Number(C.VSL_ATRASO_CTA_SEGUNDOS) || 0;
  if (cta && embed && delay > 0) {
    cta.classList.add("is-waiting");
    setTimeout(function () {
      cta.classList.remove("is-waiting");
      cta.classList.add("is-revealed");
    }, delay * 1000);
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
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); });
        var i = siblings.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 5) * 70 : 0) + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ---------- Janela do formulário ----------
  var dialog = document.getElementById("diag-dialog");
  var form = document.getElementById("diag-form");
  var status = document.getElementById("form-status");
  var lastTrigger = null;

  function openDialog(trigger) {
    lastTrigger = trigger || null;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
    var first = document.getElementById("f-nome");
    if (first) first.focus();
  }
  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  dialog.addEventListener("close", function () {
    document.body.classList.remove("dialog-open");
    if (lastTrigger) lastTrigger.focus();
  });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
  document.getElementById("diag-close").addEventListener("click", closeDialog);

  document.querySelectorAll(".js-open-diag").forEach(function (btn) {
    btn.addEventListener("click", function () {
      track("cta_click", { origem: btn.getAttribute("data-cta") });
      openDialog(btn);
    });
  });

  // ---------- Validação e envio ----------
  var rules = {
    nome: function (v) { return v.trim().length >= 2 || "Informe seu nome."; },
    contato: function (v) {
      v = v.trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || digits(v).length >= 10 || "Informe um e-mail válido ou um WhatsApp com DDD.";
    },
    loja: function (v) { return v.trim().length >= 2 || "Informe o nome da loja ou o endereço do site."; },
    papel: function (v) { return !!v || "Selecione o seu papel."; },
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
      if (ok) el.removeAttribute("aria-describedby"); else el.setAttribute("aria-describedby", err.id);
    }
    return ok;
  }
  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "blur", function () {
      if (el.getAttribute("aria-invalid") !== null || el.value) check(name);
    });
  });

  function setStatus(kind, msg) { status.className = "form-status " + kind; status.textContent = msg; }

  function summary(d) {
    return [
      "Olá! Vim pela página do Método Conversão 7D e quero solicitar um diagnóstico.",
      "",
      "Nome: " + d.nome,
      "Contato: " + d.contato,
      "Loja/site: " + d.loja,
      "Papel: " + d.papel,
      "Conversas de pré-venda/mês: " + d.volume,
    ].join("\n");
  }

  // Mantém UTMs para saber de onde veio o contato
  function utms() {
    var p = new URLSearchParams(window.location.search), out = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"].forEach(function (k) {
      if (p.get(k)) out[k] = p.get(k);
    });
    return out;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(rules).forEach(function (name) { if (!check(name) && !firstBad) firstBad = form.elements[name]; });
    if (firstBad) { firstBad.focus(); return; }

    var data = Object.assign({
      nome: form.nome.value.trim(),
      contato: form.contato.value.trim(),
      loja: form.loja.value.trim(),
      papel: form.papel.value,
      volume: form.volume.value,
      consentimento_lgpd: true,
      origem: "vsl",
      pagina: window.location.href,
      enviado_em: new Date().toISOString(),
    }, utms());

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;

    function done(msg) {
      track("form_submit", { volume: data.volume });
      form.reset();
      form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
      setStatus("ok", msg || "Recebemos seu pedido. Vamos entrar em contato para combinar o diagnóstico.");
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
      done("Abrimos o WhatsApp com os seus dados. É só enviar a mensagem para combinarmos o diagnóstico.");
    } else {
      setStatus("fail", "O envio ainda não está configurado. Defina FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
      console.warn("[vsl] Formulário sem destino: configure FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
    }
  });
})();
