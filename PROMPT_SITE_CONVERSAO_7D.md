# Prompt de implementação — Site do Método Conversão 7D

> Cole este documento inteiro no Claude Code, na pasta do projeto do site.

---

## 1. Seu papel e a tarefa

Você é um desenvolvedor front-end sênior com forte senso de design, copywriting B2B e conversão. Construa a **landing page comercial** do **Método Conversão 7D**: um serviço de implementação consultiva de um agente comercial com IA para o pré-atendimento (pré-venda) de e-commerces.

O site é uma apresentação comercial de alto nível. Em poucos minutos, o visitante deve entender:

1. Qual problema comercial resolvemos.
2. Como o Método Conversão 7D funciona.
3. O que está incluído na implementação (e o que não está).
4. Para quais operações faz sentido, e para quais não faz.
5. Qual é o próximo passo: **solicitar um diagnóstico**.

**Conversão principal:** contato de um potencial cliente qualificado pelo formulário de diagnóstico ou pelo WhatsApp.

Todo o texto do site é em **português do Brasil**.

---

## 2. Stack e entrega técnica

- Página única (one-page) estática, rápida e responsiva. Use **HTML + CSS + JavaScript sem framework**, a menos que a pasta já tenha outra stack configurada. Sem etapa de build obrigatória.
- Estrutura sugerida: `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `assets/img/`, `config.js`.
- **`config.js` centraliza todos os dados variáveis**, para que eu edite sem mexer no layout:
  - `NOME_EMPRESA` (provisório: `"Northum"`; ver seção 9)
  - `WHATSAPP_NUMERO` (placeholder `"55XXXXXXXXXXX"`)
  - `EMAIL_CONTATO` (placeholder)
  - `FORM_ENDPOINT` (placeholder; se vazio, o envio abre o WhatsApp com a mensagem pré-preenchida)
  - `MOSTRAR_PRECO` (booleano, padrão `true`) e `PRECO_IMPLEMENTACAO` (`"R$ 5.000"`)
  - `CIDADE_UF`, `CNPJ`, links de redes sociais (todos opcionais; se vazios, não renderizar)
- Mobile-first. Funcionar bem em 360px, 768px, 1280px e 1440px+. Sem rolagem horizontal.
- Acessibilidade: HTML semântico, contraste AA, foco visível, `aria-expanded` no FAQ, `prefers-reduced-motion` respeitado, labels reais no formulário.
- Performance: sem bibliotecas pesadas. Fontes do Google Fonts com `display=swap`. Imagens em SVG ou WebP. Meta de Lighthouse ≥ 90 em todas as categorias.
- SEO básico: `<title>`, meta description, Open Graph, favicon, `lang="pt-BR"`, um único `<h1>`.
- Não use imagens de banco genéricas (robôs, cérebros, circuitos). Os recursos visuais devem ser **mockups construídos em HTML/CSS** (ver seção 4).

---

## 3. Referência visual: o que estudar em somosdono.ai (e o que NÃO copiar)

A referência é **https://somosdono.ai/**. Use-a como estudo de **estrutura, ritmo e técnica**, nunca de identidade.

**Aproveite estes padrões:**

- **Hero escuro com gradiente sutil**, eyebrow em caixa-alta pequena com um ponto colorido antes do texto, H1 grande com **parte da frase em cor de destaque**, subtítulo curto e **dois CTAs** (primário preenchido + secundário em contorno).
- **Dois mini-cards logo abaixo do hero** resumindo as duas partes da oferta.
- **Mockups de produto feitos em código** (chat no celular, painel) que mostram o mecanismo em vez de descrevê-lo, sempre com o aviso "demonstração com dados fictícios".
- **Alternância de seções escuras e claras** para dar ritmo à leitura.
- **Passos numerados 01–04** com uma linha de progresso.
- **Linha do tempo ilustrativa** ("Agora → 30 s → 5 min → 1 h → Amanhã") que torna o problema concreto.
- **Tabela comparativa** "jeito tradicional × nossa abordagem", em linhas.
- **FAQ em acordeão** respondendo objeções reais, incluindo "Vocês garantem venda?".
- **Seção final de diagnóstico** com formulário curto e promessa honesta do que a pessoa recebe.
- **Botão flutuante de WhatsApp** no canto inferior direito.
- Avisos de transparência junto de qualquer exemplo ("Ilustrativo", "Dados de exemplo").

**Não copie:** textos, nome, logo, paleta verde, ilustração do mapa do Brasil em pontos, ativos, nomes de exemplo ou números. **Também não reproduza** as partes que não temos como sustentar: contadores de resultado ("30.000+ leads"), cases, logos de clientes, blog. Não temos nada disso ainda (ver seção 8).

---

## 4. Direção de arte (identidade própria)

**Personalidade:** consultoria especializada, sóbria, segura e comercialmente orientada. Mais "parceiro de operação" do que "startup de IA". O conceito visual parte do nome Northum: **norte, direção, orientação**, que é exatamente o que o agente faz pelo comprador.

**Paleta sugerida** (defina como tokens CSS em `:root`):

| Token | Uso | Valor sugerido |
|---|---|---|
| `--ink` | fundo das seções escuras | azul-marinho profundo `#0E1B2C` |
| `--ink-2` | cards sobre o escuro | `#16273D` |
| `--paper` | fundo das seções claras | off-white quente `#F6F4EF` |
| `--text` / `--text-muted` | texto | `#0E1B2C` / `#5A6675` |
| `--accent` | destaque, CTA primário | âmbar/ocre `#E3A33B` (o "norte") |
| `--accent-2` | sinais de estado (resolvido, transferido) | azul-petróleo `#2E8C8C` |
| `--line` | bordas | `rgba(14,27,44,.12)` no claro / `rgba(255,255,255,.10)` no escuro |

Os azuis vêm dos próprios documentos estratégicos da empresa. Ajuste os tons se precisar de contraste, mas mantenha a família: marinho + âmbar + petróleo. Nada de verde neon nem de roxo "IA".

**Tipografia:** uma sans geométrica com personalidade para títulos (ex.: *Manrope* ou *Plus Jakarta Sans*, 700–800, tracking levemente negativo) e uma sans neutra para texto (ex.: *Inter*, 400–500). Eyebrows em caixa-alta, 12px, tracking amplo.

**Elementos visuais recorrentes:**

- Um pequeno **símbolo de bússola/seta norte** como marca gráfica e marcador de eyebrow.
- Cards com cantos de 16–20px, bordas finas e sombra mínima.
- Mockups em HTML/CSS (sem imagens), com o selo "Simulação ilustrativa":
  1. **Chat de pré-venda no celular (hero):** um comprador pergunta algo de produto, o agente responde com base nas informações da loja, o comprador pergunta algo fora da base e o agente **encaminha para uma pessoa da equipe**. Mostrar etiquetas de estado como "Resposta com base no catálogo" e "Encaminhado para atendimento humano". Esse é o diferencial do método, e precisa estar visível logo na primeira dobra.
  2. **Painel de acompanhamento (seção de medição):** cartões com "Tempo de primeira resposta", "Conversas resolvidas pelo agente", "Encaminhadas para a equipe", "Principais dúvidas da semana" e "Motivos de transferência". **Usar "—" ou valores claramente fictícios com o aviso "Dados de exemplo"**.
- Animações discretas: fade/slide-up ao entrar na tela, mensagens do chat aparecendo em sequência. Tudo desligado com `prefers-reduced-motion`.

---

## 5. Regras de conteúdo (obrigatórias)

Estas regras vêm dos documentos estratégicos e não são negociáveis:

1. **Nunca** prometa aumento de vendas, faturamento ou conversão. Nada de "garantimos mais vendas", "venda no automático" ou "dobre sua conversão".
2. **Nunca** diga que o agente substitui a equipe. Ele **complementa** o atendimento humano.
3. **Nunca** diga que funciona com qualquer plataforma ou integra com tudo. Integrações são "conforme o escopo acordado e a viabilidade técnica".
4. **Não invente** clientes, depoimentos, logos, números, estatísticas, cases, certificações, prêmios ou integrações específicas (não cite Shopify, VTEX, Nuvemshop etc. como integradas).
5. **"7D" significa disponibilidade 7 dias por semana** como objetivo operacional. Não significa implementação em 7 dias, resultado em 7 dias nem atendimento infalível. Explique isso uma vez, de forma clara, no site.
6. Não use urgência ou escassez falsas: sem contagem regressiva e sem "últimas vagas".
7. Evite jargão técnico (LLM, RAG, tokens, API, prompt). Fale de operação: dúvidas, catálogo, políticas, equipe, encaminhamento.
8. Não trate o visitante como alguém que precisa ser convencido de que IA existe. Não abra com "a IA está revolucionando o e-commerce".
9. Tom: claro, seguro, profissional, objetivo. Frases curtas. Segunda pessoa ("sua loja", "sua equipe").
10. Seja transparente sobre escopo, limites e a participação necessária do cliente. Isso é argumento de venda, não letra miúda.

**Vocabulário-chave a usar com consistência:** pré-venda / pré-atendimento, agente comercial com IA, informações aprovadas pela loja, encaminhamento para a equipe, diagnóstico, critérios de aceite, acompanhamento.

---

## 6. Arquitetura da página e conteúdo de cada seção

Os textos abaixo são a **base aprovada**. Você pode ajustar a forma (ritmo, quebras, microcopy de UI), mas preserve o sentido, as ressalvas e as regras da seção 5.

### 6.0 Header (fixo, translúcido com blur ao rolar)
- Logo (wordmark + símbolo de norte) à esquerda.
- Âncoras: **O problema · Como funciona · O que inclui · Para quem · Investimento · Perguntas**.
- CTA à direita: **Solicitar diagnóstico**.
- No mobile, menu hambúrguer acessível.

### 6.1 Hero (escuro)
- **Eyebrow:** `PRÉ-VENDA ASSISTIDA PARA E-COMMERCE`
- **H1** (destaque em âmbar na segunda parte). Escolha uma, a primeira é a recomendada:
  - "Quem está prestes a comprar **merece uma resposta agora**."
  - "Responda quem está decidindo a compra, **7 dias por semana**."
- **Subtítulo:** "Implementamos um agente comercial com IA que complementa o pré-atendimento do seu e-commerce: responde dúvidas com base nas informações aprovadas pela sua loja, orienta o comprador e encaminha para a sua equipe o que exige uma pessoa."
- **CTAs:** `Solicitar diagnóstico` (primário) · `Como funciona` (secundário, âncora).
- **Mockup:** chat de pré-venda no celular (seção 4, item 1).
- **Mini-cards abaixo do hero:**
  - **O agente atende**: "Dúvidas sobre produtos, uso, entrega e condições, dentro de limites definidos."
  - **Sua equipe assume**: "Casos que exigem julgamento, informação indisponível ou atendimento especializado."
- Microlinha discreta: "Método Conversão 7D · implementação consultiva com diagnóstico, testes e acompanhamento."

### 6.2 O problema (claro): "Vazamento de Intenção de Compra"
- **Eyebrow:** `O PROBLEMA`
- **Título:** "Parte das oportunidades já chega à sua loja e para numa dúvida."
- **Texto:** "Você investe para atrair compradores. Alguns precisam de um esclarecimento antes de decidir: tamanho, compatibilidade, prazo, uso, troca. Quando a resposta demora, não resolve o ponto central ou não chega, a conversa esfria e a decisão fica para depois, ou para outra loja."
- **Sequência visual em 5 passos** (linha horizontal no desktop, vertical no mobile):
  1. O visitante chega à loja.
  2. Demonstra interesse: compara, pergunta.
  3. Surge uma dúvida que influencia a compra.
  4. A resposta demora, é genérica ou não vem.
  5. O comprador não avança.
  - Rótulo do trecho 3→5: "**Vazamento de Intenção de Compra**".
- **Linha do tempo ilustrativa** (inspirada na referência, com rótulo "Ilustrativo"): "Agora: ainda está na página do produto → Alguns minutos: abriu outra aba → Uma hora: já comparou com outra loja → Amanhã: a dúvida perdeu a urgência". Sem números de pesquisa.
- **Sintomas** (grade de cards curtos):
  - Conversas que esperam demais por uma resposta.
  - Respostas genéricas que não ajudam a escolher o produto.
  - Perguntas repetidas consumindo o tempo da equipe.
  - Atendimento limitado fora do horário comercial.
  - Pouca visibilidade sobre quantas conversas terminam sem próximo passo.
- **Nota de honestidade** (pequena, em itálico ou caixa lateral): "Nem toda venda perdida vem do atendimento. Preço, frete, estoque e checkout também pesam. Por isso começamos com diagnóstico, não com suposição."

### 6.3 A pergunta que muda a análise (faixa escura, curta)
- Frase grande centralizada: "Você sabe quais dúvidas seus clientes fazem antes de comprar e **quantas dessas conversas terminam sem uma resposta ou um próximo passo claro?**"
- Linha de apoio: "Aumentar o tráfego não é a única alavanca. Às vezes, a oportunidade está nas conversas que já acontecem."
- CTA texto: `Descobrir no diagnóstico →`

### 6.4 A solução: o que o agente faz e o que não faz (claro)
- **Eyebrow:** `A SOLUÇÃO`
- **Título:** "Um agente de pré-venda configurado para a sua operação, não um chatbot genérico."
- **Duas colunas:**
  - **O agente faz:**
    - Responde dúvidas sobre produtos com base em informações aprovadas pela loja.
    - Ajuda o comprador a encontrar e entender o produto adequado.
    - Faz perguntas de esclarecimento quando precisa.
    - Informa condições, disponibilidade e entrega, quando houver integração confiável.
    - Conduz o comprador ao próximo passo da compra.
    - Registra as conversas para análise e melhoria.
  - **O agente não faz:**
    - Inventar resposta quando não tem informação confiável.
    - Decidir casos que exigem julgamento humano.
    - Substituir a sua equipe.
    - Prometer o que a loja não confirmou.
  - Fecho: "**Quando não sabe, encaminha.** Situações complexas, sensíveis ou sem informação disponível vão para uma pessoa da sua equipe."
- **Explicação do 7D** (caixa pequena com o símbolo de norte): "**Por que 7D?** Porque as dúvidas não respeitam horário comercial. O agente fica disponível 7 dias por semana, dentro do escopo, do canal e das condições técnicas acordadas. 7D não é prazo de implementação nem promessa de resultado."

### 6.5 Como funciona: a metodologia (escuro)
- **Eyebrow:** `COMO FUNCIONA`
- **Título:** "Quatro etapas, um processo de implementação com critérios claros."
- **Passos numerados 01–04** com linha de progresso; cada um com "O que fazemos" e "O que você recebe":
  - **01 · Mapear**: Analisamos o pré-atendimento atual: canais, dúvidas recorrentes, produtos mais complexos, fluxo da equipe e pontos em que uma pessoa precisa assumir. → *Mapa do processo e lista priorizada de oportunidades e riscos.*
  - **02 · Preparar**: Organizamos e validamos as informações de produtos, políticas e perguntas frequentes. Configuramos tom de voz, fluxos, limites, integrações acordadas e regras de encaminhamento. → *Agente configurado com conhecimento aprovado e limites claros.*
  - **03 · Assistir**: Testamos com cenários reais, validamos com você, orientamos a equipe e colocamos o agente em operação no canal definido, acompanhando as primeiras conversas. → *Assistência ativa e observável, não só um sistema instalado.*
  - **04 · Aprimorar**: Revisamos respostas, dúvidas não resolvidas e motivos de transferência; atualizamos informações e ajustamos fluxos. → *Processo de melhoria contínua.*
- Rodapé da seção: "Nada vai ao ar sem testes e sem os critérios de aceite combinados com você."

### 6.6 O que está incluído (claro)
- **Eyebrow:** `O QUE INCLUI`
- **Título:** "O que entregamos na implementação."
- **Lista com ícones de check:**
  - Diagnóstico do processo atual de pré-atendimento.
  - Mapa de oportunidades: dúvidas, fricções e pontos de perda percebidos.
  - Organização e preparação das informações comerciais e dos produtos.
  - Configuração do agente: linguagem, limites e fluxos de atendimento.
  - Integração com o canal e os sistemas acordados, conforme viabilidade técnica.
  - Fluxos de pré-venda e critérios de encaminhamento para humanos documentados.
  - Testes com cenários representativos e critérios de aceite antes do lançamento.
  - Orientação da equipe para supervisão, exceções e atualização de informações.
  - Período inicial de observação e ajustes.
- **Bloco "Fora do escopo"** (visual neutro, não escondido):
  - Desenvolvimento de plataforma própria ou integrações não previstas.
  - Gestão de anúncios, produção completa de catálogo ou operação humana do atendimento.
  - Garantia de aumento de vendas sem linha de base e critérios de medição acordados.
  - Uso ilimitado de ferramentas e serviços de terceiros, salvo se incluído na proposta.
- **Bloco "O que precisamos de você"**: acesso às informações de produtos e políticas; uma pessoa responsável por aprovar respostas e regras; participação nos testes e na validação; acesso aos canais e sistemas que serão integrados.
- Nota: "O escopo exato é definido no diagnóstico, de acordo com seus canais, sistemas e volume."

### 6.7 Para quem faz sentido (escuro ou claro, conforme o ritmo)
- **Eyebrow:** `PARA QUEM É`
- **Título:** "Feito para e-commerces que já têm operação e conversas de sobra."
- **Faz sentido se:**
  - Sua loja tem vendas recorrentes e operação ativa.
  - Recebe volume relevante de perguntas antes da compra (WhatsApp, chat ou outros canais).
  - Investe em aquisição ou tem fluxo consistente de visitantes.
  - Sua equipe está sobrecarregada ou há pressão para contratar.
  - Você já tentou respostas prontas, FAQ ou chatbot e não resolveu.
  - Consegue disponibilizar informações de catálogo, políticas e atendimento.
- **Provavelmente não é o momento se:**
  - A loja ainda está começando e recebe poucas perguntas.
  - O gargalo principal é tráfego, preço, frete ou checkout.
  - As informações de produtos e políticas não podem ser organizadas agora.
- Linha final: "Na dúvida, o diagnóstico serve justamente para isso."

### 6.8 Controle e confiança (claro)
- **Eyebrow:** `CONTROLE`
- **Título:** "O agente fala em nome da sua loja. Por isso, ele trabalha com limites."
- **Grade de 4–6 cards:**
  - **Informação aprovada**: o agente responde a partir de uma base validada por você.
  - **Limites definidos**: regras claras do que pode responder, esclarecer ou recusar.
  - **Encaminhamento humano**: critérios documentados de quando e como a equipe assume.
  - **Testes antes de operar**: cenários representativos e critérios de aceite combinados.
  - **Acompanhamento**: monitoramento de falhas, transferências e dúvidas não resolvidas.
  - **Cuidado com dados**: tratamento das informações dos clientes conforme responsabilidades definidas em contrato.

### 6.9 Comparativo (claro, tabela em linhas como na referência)
- **Título:** "Três caminhos para o mesmo problema."
- Colunas: **Só contratar mais atendentes** · **Chatbot genérico** · **Método Conversão 7D**.
- Linhas sugeridas (tom respeitoso, sem atacar alternativas):
  - *Disponibilidade:* horário da equipe · contínua, com respostas limitadas · 7 dias por semana, no escopo acordado.
  - *Base das respostas:* conhecimento de cada pessoa · respostas prontas ou genéricas · informações aprovadas pela loja.
  - *Dúvidas complexas:* resolvidas pela equipe · frequentemente travam · encaminhadas para a equipe com critério.
  - *Implementação:* recrutar e treinar · instalar e configurar sozinho · diagnóstico, preparação, testes e acompanhamento.
  - *Visibilidade:* depende de controle manual · relatórios genéricos · dúvidas recorrentes, transferências e qualidade acompanhadas.
- Nota: "Não é uma escolha excludente: o agente complementa a equipe."

### 6.10 Como avaliamos (escuro, com o mockup de painel)
- **Eyebrow:** `MEDIÇÃO`
- **Título:** "Medimos o que dá para medir, sem atribuir toda venda ao agente."
- Texto: "Antes de falar em impacto financeiro, definimos com você a linha de base, a janela de medição e as fontes de dados."
- Indicadores (cards): tempo de primeira resposta e cobertura fora do horário; conversas resolvidas pelo agente × encaminhadas; qualidade das respostas e motivos de transferência; conversão de conversas qualificadas em pedidos, quando houver rastreamento confiável.
- Mockup do painel com o aviso "Dados de exemplo".

### 6.11 Investimento (claro), renderizar só se `MOSTRAR_PRECO = true`
- **Eyebrow:** `INVESTIMENTO`
- **Título:** "Um projeto com escopo, prazo e critérios definidos."
- **Dois cards lado a lado:**
  - **Implementação (valor único):** "Pacote essencial **a partir de R$ 5.000**, com escopo delimitado: canal principal, fluxos, base de conhecimento e período de ajustes definidos em proposta." Lista curta do que o pacote especifica.
  - **Manutenção (recorrente, obrigatória):** "Contratada separadamente, por período definido. Inclui monitoramento, correções no escopo implementado e atualizações dentro de um limite acordado. Valor apresentado na proposta."
- Nota: "Projetos com múltiplos canais, integrações customizadas ou regras complexas são diagnosticados e orçados à parte. Custos de plataformas e serviços de terceiros são detalhados na proposta."
- **Selo de segurança (garantia de execução):** "Critérios de aceite definidos antes do início. Falhas de implementação dentro do escopo que impeçam cumprir esses critérios são corrigidas sem custo adicional." *(Ver pendência jurídica na seção 9.)*
- CTA: `Solicitar diagnóstico`.
- Se `MOSTRAR_PRECO = false`: substituir a seção por um card "Investimento definido após o diagnóstico, de acordo com canais, integrações e volume", mantendo a explicação implementação + manutenção.

### 6.12 Perguntas frequentes (claro, acordeão)
Use estas perguntas e respostas:
- **O agente substitui minha equipe?** Não. Ele complementa o atendimento: responde o que tem base para responder e encaminha para a equipe o que exige uma pessoa.
- **Vocês garantem aumento de vendas?** Não. Garantimos a execução do que foi contratado, com critérios de aceite. O efeito em vendas depende de vários fatores (tráfego, preço, estoque, oferta) e é medido com linha de base acordada.
- **O que significa "7D"?** Disponibilidade 7 dias por semana, dentro do escopo, do canal e das condições técnicas acordadas. Não é prazo de implementação.
- **Funciona com a minha plataforma e o meu canal?** Depende. Avaliamos canais e sistemas no diagnóstico e definimos as integrações viáveis na proposta.
- **E se o agente não souber a resposta?** Ele não inventa. Faz uma pergunta de esclarecimento ou encaminha a conversa para a sua equipe, conforme as regras configuradas.
- **De onde vêm as informações que o agente usa?** De uma base preparada com você: produtos, políticas, perguntas frequentes e informações operacionais, validadas antes de entrar em operação.
- **Quanto tempo leva a implementação?** O prazo é definido na proposta, conforme escopo, integrações e disponibilidade das informações. *(Ver pendência na seção 9.)*
- **Preciso participar do projeto?** Sim. Precisamos de alguém da sua equipe para fornecer informações, aprovar respostas e participar dos testes.
- **Como é cobrado?** Implementação em valor único e manutenção recorrente contratada à parte, por período definido.
- **O que é o diagnóstico?** Uma conversa para entender seu pré-atendimento, verificar se a solução faz sentido para a sua operação e quais seriam os requisitos.

### 6.13 CTA final: Diagnóstico (escuro, seção de destaque)
- **Eyebrow:** `DIAGNÓSTICO`
- **Título:** "Vamos olhar o seu pré-atendimento juntos."
- **Texto:** "Uma conversa para entender como sua loja atende antes da compra, onde estão as dúvidas recorrentes e se o Método Conversão 7D faz sentido para a sua operação. Se não fizer, a gente diz."
- **Formulário curto** (qualificação sem interrogatório):
  - Nome*
  - E-mail ou WhatsApp*
  - Nome da loja / site*
  - Seu papel: *Proprietário(a) · Gestor(a) comercial ou de e-commerce · Responsável pelo atendimento · Outro*
  - Principal canal de dúvidas: *WhatsApp · Chat do site · Instagram · Outro*
  - Volume aproximado de conversas de pré-venda por mês: *Até 300 · 300–1.000 · 1.000–3.000 · Mais de 3.000 · Não sei*
  - Campo opcional: "Qual é o maior desafio no seu atendimento antes da compra?"
  - Checkbox de consentimento LGPD com link para a política de privacidade.
  - Botão: `Solicitar diagnóstico`
- Validação no cliente, estados de carregando/sucesso/erro, mensagem de sucesso: "Recebemos seu pedido. Vamos entrar em contato para combinar o diagnóstico."
- Envio: se `FORM_ENDPOINT` estiver configurado, `POST` JSON; senão, abrir `wa.me/` com os dados formatados.
- Alternativa ao lado: "Prefere conversar direto? **Falar no WhatsApp**".

### 6.14 Rodapé
- Logo, uma frase de posicionamento: "Implementação de agente comercial com IA para o pré-venda do e-commerce."
- Âncoras, contato, cidade/UF e CNPJ (se preenchidos), link para a **política de privacidade** (criar `privacidade.html` com um texto-modelo marcado como "rascunho — revisar juridicamente").
- "© {ano} {NOME_EMPRESA}".

### 6.15 Botão flutuante de WhatsApp
- Canto inferior direito: "Fale conosco · WhatsApp". Não pode cobrir o CTA do formulário no mobile.

---

## 7. Comportamento e qualidade

- Rolagem suave nas âncoras, compensando a altura do header.
- Chat do hero: as mensagens aparecem em sequência uma vez ao carregar (com opção de repetir); estático com `prefers-reduced-motion`.
- Todos os CTAs "Solicitar diagnóstico" levam à seção 6.13 e focam o primeiro campo.
- Eventos de analytics preparados (funções vazias ou `dataLayer.push`) para: clique em CTA (com a seção de origem), envio do formulário e clique no WhatsApp. Não instale nenhuma ferramenta de analytics sem eu pedir.
- Antes de concluir, verifique a página em 375px e 1440px, confira contraste, navegação por teclado e se o console fica sem erros.
- **Revisão final de texto:** procure no HTML e remova qualquer ocorrência de "garantimos", "aumente suas vendas", "substitui", "revolucion", "100%", "infalível" ou números que não estejam neste prompt.

---

## 8. O que NÃO entra no site agora

Não existem ainda e **não devem ser simulados**:
- Depoimentos, cases, logos de clientes, contadores de resultados.
- Nomes de plataformas e ferramentas integradas.
- Certificações, selos, parcerias, prêmios.
- Blog/conteúdos.
- Fotos da equipe ou história do fundador (a seção "Autoridade/Epifania" só deve existir com uma história real; deixe um componente comentado `<!-- SEÇÃO SOBRE: aguardando conteúdo real -->` para o futuro).

Deixe a estrutura pronta para receber uma seção de "Resultados de pilotos" no futuro, **comentada e fora da página publicada**.

---

## 9. Pendências: informações ausentes nos documentos

Não invente estas informações. Use placeholders visíveis no `config.js` e me liste no final do trabalho o que ficou pendente:

1. **Nome da empresa e marca.** Os documentos usam "Northum" apenas como nome do plano; confirmar se é a marca do site. O nome "Método Conversão 7D" é provisório e ainda depende de verificação de marca e domínio.
2. **Logo:** não existe. Crie um wordmark tipográfico provisório com o símbolo de norte, fácil de substituir.
3. **Contatos:** WhatsApp, e-mail, cidade/UF, CNPJ, redes sociais.
4. **Prazo da implementação** e duração do período inicial de ajustes: não definidos.
5. **Preço e duração da manutenção** (ex.: 6 meses, a confirmar): não definidos. Por isso o site diz "valor apresentado na proposta".
6. **Exibir ou não o preço de R$ 5.000:** é um preço de entrada ainda em validação. Controlado por `MOSTRAR_PRECO`.
7. **Canal principal do pacote essencial** (WhatsApp, chat do site, Instagram): não definido. O texto fala em "canal definido no diagnóstico".
8. **Redação da garantia de execução e da política de privacidade:** precisam de revisão jurídica antes da publicação.
9. **Nicho prioritário** (moda, saúde e beleza, casa e decoração etc.): em aberto. O site fala com e-commerce em geral.
10. **Destino do formulário** (e-mail, CRM, planilha): definir `FORM_ENDPOINT`.

---

## 10. Critérios de pronto

- [ ] Página única com todas as seções da seção 6, na ordem indicada.
- [ ] Identidade própria (marinho + âmbar + petróleo), sem nenhum elemento copiado da referência.
- [ ] Mockup do chat no hero mostrando resposta **e** encaminhamento para humano, com selo "Simulação ilustrativa".
- [ ] Nenhuma promessa proibida, número inventado ou integração nomeada.
- [ ] "7D" explicado corretamente.
- [ ] Escopo, exclusões e responsabilidades do cliente visíveis.
- [ ] Formulário funcional com validação, LGPD e fallback para WhatsApp.
- [ ] Responsivo de 360px a 1440px+, acessível e sem erros no console.
- [ ] `config.js` com todos os dados editáveis e a lista de pendências entregue no final.
