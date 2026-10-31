// Dados editáveis do site. Altere aqui sem mexer no layout.
// Campos vazios ("") não são exibidos.
window.SITE_CONFIG = {
  NOME_EMPRESA: "Northum", // provisório: confirmar marca
  NOME_METODO: "Método Conversão 7D", // provisório: verificar marca e domínio

  WHATSAPP_NUMERO: "55XXXXXXXXXXX", // formato: 55 + DDD + número, só dígitos
  EMAIL_CONTATO: "",
  CIDADE_UF: "",
  CNPJ: "",
  INSTAGRAM_URL: "",
  LINKEDIN_URL: "",

  // URL que recebe o formulário via POST (JSON). Se vazio, o envio abre o WhatsApp.
  FORM_ENDPOINT: "",

  // ---------- Landing page da VSL (/vsl) ----------
  // Link do vídeo. Aceita link do YouTube, do Vimeo ou uma URL de embed (iframe)
  // de outro player. Se vazio, a página mostra um espaço reservado.
  VSL_URL: "",
  // Segundos até o botão abaixo do vídeo aparecer. 0 = aparece desde o início.
  VSL_ATRASO_CTA_SEGUNDOS: 0,

  // Preço não é exibido no site.
  MOSTRAR_PRECO: false,
  PRECO_IMPLEMENTACAO: "",
};
