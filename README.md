# Módulo de Consulta de Cartas (Scryfall API)

Este projeto é a entrega do "Exercício Prático — Reuso de Código com Bibliotecas Externas". O objetivo é demonstrar a seleção e implementação de bibliotecas externas para criar um protótipo funcional que consome a API Scryfall (Magic: The Gathering).

O protótipo permite ao usuário buscar uma carta de duas formas:
1.  Digitando o nome da carta.
2.  Escaneando o nome da carta usando a câmera do dispositivo (via OCR).

---

## Parte 1: Pesquisa e Seleção de Bibliotecas

Conforme solicitado pelo exercício, a primeira etapa foi pesquisar, comparar e justificar a escolha das bibliotecas externas.

### Parte 1.1: Pesquisa e Seleção (Comunicação HTTP)

A primeira análise foi para a biblioteca de comunicação HTTP.

#### Tabela de Comparação (HTTP)

As duas opções analisadas foram a biblioteca externa `axios` e a `fetch API` nativa do navegador.

| Biblioteca | Última atualização | Downloads/semana (npm) | Licença | Complexidade da API | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`axios`** | Constante (muito ativo) | ~50 Milhões+ | MIT | Baixa | API muito intuitiva. Trata JSON automaticamente. Suporte a interceptores e *timeout*. |
| **`fetch API`**| Padrão (ES6) | N/A (Nativo) | N/A (Padrão Web) | Baixa/Média | Nativo (sem dependências). Requer passo extra (`.then(res => res.json())`). Não rejeita em erros 4xx/5xx. |

#### Decisão Técnica (HTTP)

* **Biblioteca escolhida:** `axios`
* **Motivo:** Para cumprir o requisito do exercício de usar uma biblioteca **externa**, `axios` é a escolha ideal. Sua sintaxe (`axios.get()`) é mais limpa, ela lida com a decodificação do JSON da Scryfall automaticamente e seu tratamento de erros (`catch`) é mais direto para capturar falhas da API (como um 404 - Carta Não Encontrada), algo que a `fetch` API não faz nativamente.
* **Alternativa descartada:** `fetch API`. Embora seja uma excelente API nativa, ela não é uma biblioteca *externa*. Além disso, seu tratamento de resposta exige um passo manual para converter para JSON e um `if (!response.ok)` para capturar erros HTTP, o que adiciona uma leve complexidade.

---

### Parte 1.2: Pesquisa e Seleção (OCR / Visão Computacional)

Para a funcionalidade bônus de "scan", foi feita uma análise similar para bibliotecas de Reconhecimento Óptico de Caracteres (OCR) que rodam 100% no *frontend*.

#### Tabela de Comparação (OCR)

| Biblioteca | Última atualização | Downloads/semana (npm) | Licença | Complexidade da API | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Tesseract.js`** | Constante (ativo) | ~750.000+ | Apache 2.0 | Média | *Port* do Tesseract (Google). Muito preciso, suporta 100+ idiomas. Padrão da indústria. |
| **`Ocrad.js`** | Antiga (~2014) | ~3.000+ | GPL v3 | Baixa | 100% JavaScript, muito leve e rápido. Precisão significativamente menor, ideal apenas para fontes muito limpas. |

#### Decisão Técnica (OCR)

* **Biblioteca escolhida:** `Tesseract.js`
* **Motivo:** Embora seja mais "pesada" que a alternativa, sua **taxa de precisão é vastamente superior**, especialmente para fontes variadas como as encontradas em cartas de Magic. O suporte a idiomas e a manutenção constante da comunidade garantem a viabilidade do projeto. A API, apesar de complexa (exige `async/await` e `worker`), é bem documentada.
* **Alternativa descartada:** `Ocrad.js`. Sua leveza e simplicidade eram atraentes, mas a baixa precisão tornaria a funcionalidade de scan frustrante para o usuário.

---

## Parte 3: Documentação Técnica

Esta seção documenta o protótipo funcional implementado (Parte 2 do exercício).

## 📦 Bibliotecas utilizadas

Este projeto demonstra o reuso de **duas** bibliotecas externas principais:

1.  **`axios`**: (Biblioteca principal do exercício) Utilizada para realizar as requisições HTTP (`GET`) para a API Scryfall.
2.  **`Tesseract.js`**: Utilizada para implementar a funcionalidade de "scan", realizando o Reconhecimento Óptico de Caracteres (OCR) 100% no navegador.

## 🧰 Instalação

Nenhuma instalação é necessária. O projeto é composto apenas por arquivos estáticos (`index.html`, `style.css`, `app.js`) e as bibliotecas são carregadas via CDN.

## ⚙️ Execução

**IMPORTANTE:** Este projeto **não funciona** abrindo o `index.html` diretamente do disco (`file:///...`). O navegador exige um contexto seguro (HTTPS) para dar permissão de acesso à câmera (`getUserMedia`).

**Como rodar:**
1.  **Localmente (Recomendado):**
    * Use a extensão **"Live Server"** do VS Code.
    * Clique com o botão direito no `index.html` e selecione "Open with Live Server".
2.  **Via Web (GitHub Pages):**
    * Faça o deploy do repositório no GitHub Pages. Ele fornece HTTPS automaticamente.

**Modo de Uso:**
* **Via Texto:** Digite o nome da carta (ex: "Sol Ring") no campo de busca e clique em "Buscar".
* **Via Câmera:** Dê permissão para a câmera. Posicione o **nome da carta** dentro da guia retangular vermelha e clique em "Escanear Carta".

## 🧩 Motivação

O módulo foi criado para demonstrar o reuso de código através de bibliotecas externas, conforme solicitado no exercício.

A escolha do **`axios`** se deu por sua API simples para requisições GET e facilidade de integração via CDN, permitindo consumir a API Scryfall de forma rápida e eficiente.

A adição do **`Tesseract.js`** foi um *stretch goal* (objetivo extra) para demonstrar como o reuso de uma biblioteca complexa (OCR) pode viabilizar uma funcionalidade avançada (scan de câmera) 100% no *frontend*, sem necessidade de um *backend* para processamento de imagem.

## 🔍 Saída esperada

Após uma busca bem-sucedida (via texto ou câmera), a seção "Resultados" será preenchida com a imagem da carta, seu preço em dólar (USD) e sua legalidade no formato Commander (conforme implementado na função `exibirResultados`):

```html
<h3>Sol Ring</h3>
<img src="[url_da_imagem_do_scryfall]" alt="Imagem da carta Sol Ring" style="width: 200px;">
<p><strong>Preço (USD):</strong> $1.49</p>
<p><strong>Legalidade (Commander):</strong> legal</p>