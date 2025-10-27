# Módulo de Consulta de Cartas (Scryfall API)

Este projeto é a entrega do "Exercício Prático — Reuso de Código com Bibliotecas Externas". O objetivo é demonstrar a seleção e implementação de bibliotecas externas para criar um protótipo funcional que consome a API Scryfall (Magic: The Gathering).

O protótipo permite ao usuário buscar uma carta de duas formas:
1.  Digitando o nome da carta.
2.  Escaneando o nome da carta usando a câmera do dispositivo (via OCR).

---

## Parte 1: Pesquisa e Seleção da Biblioteca (HTTP)

Conforme solicitado pelo exercício, a primeira etapa foi pesquisar e comparar bibliotecas de comunicação HTTP para JavaScript no frontend.

### Tabela de Comparação

As duas opções analisadas foram a biblioteca externa `axios` e a `fetch API` nativa do navegador.

| Biblioteca | Última atualização | Downloads/semana (npm) | Licença | Complexidade da API | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`axios`** | Constante (muito ativo) | ~50 Milhões+ | MIT | Baixa | API muito intuitiva. Trata JSON automaticamente. Suporte a interceptores e *timeout*. |
| **`fetch API`**| Padrão (ES6) | N/A (Nativo) | N/A (Padrão Web) | Baixa/Média | Nativo (sem dependências). Requer passo extra (`.then(res => res.json())`). Não rejeita em erros 4xx/5xx. |

### Decisão Técnica

* **Biblioteca escolhida:** `axios`
* **Motivo:** Para cumprir o requisito do exercício de usar uma biblioteca **externa**, `axios` é a escolha ideal. Sua sintaxe (`axios.get()`) é mais limpa, ela lida com a decodificação do JSON da Scryfall automaticamente e seu tratamento de erros (`catch`) é mais direto para capturar falhas da API (como um 404 - Carta Não Encontrada), algo que a `fetch` API não faz nativamente.
* **Alternativa descartada:** `fetch API`. Embora seja uma excelente API nativa, ela não é uma biblioteca *externa*. Além disso, seu tratamento de resposta exige um passo manual para converter para JSON e um `if (!response.ok)` para capturar erros HTTP, o que adiciona uma leve complexidade.

---

## Parte 3: Documentação Técnica

Esta seção documenta o protótipo funcional implementado (Parte 2 do exercício).

## 📦 Bibliotecas utilizadas

Este projeto demonstra o reuso de **duas** bibliotecas externas principais:

1.  **`axios`**: (Biblioteca principal do exercício) Utilizada para realizar as requisições HTTP (`GET`) para a API Scryfall.
2.  **`Tesseract.js`**: Utilizada para implementar a funcionalidade de "scan", realizando o Reconhecimento Óptico de Caracteres (OCR) 100% no navegador.

## 🧰 Instalação

Nenhuma instalação é necessária. O projeto é composto apenas por arquivos estáticos (`index.html`, `style.css`, `app.js`) [cite: roquefer/atv_reuso_api/atv_reuso_