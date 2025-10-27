// Espera o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- Parte 1: Referências aos Elementos ---
    const searchButton = document.getElementById('search-button');
    const cardInput = document.getElementById('card-name');
    const resultadoDiv = document.getElementById('resultado');
    const video = document.getElementById('video');
    const scanButton = document.getElementById('scan-button');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // --- Parte 2: A Lógica Principal da API (REFATORADA) ---

    /**
     * REFATORAÇÃO: Esta função agora recebe 'cardName' como um argumento.
     * Isso permite que ela seja REUTILIZADA tanto pelo input de texto
     * quanto pelo resultado do Tesseract (OCR).
     */
    async function buscarCarta(cardName) {
        // 1. Validação (agora usa o argumento)
        if (!cardName) {
            exibirErro("Nome da carta não fornecido.");
            return;
        }

        // 2. Feedback para o usuário
        resultadoDiv.innerHTML = `<p>Buscando "${cardName}" na Scryfall...</p>`;

        // 3. Chamada com Axios (exatamente como antes)
        try {
            const apiURL = `https://api.scryfall.com/cards/named?fuzzy=${cardName}`;
            const response = await axios.get(apiURL);
            const cardData = response.data;
            exibirResultados(cardData); // Função auxiliar (sem mudanças)

        } catch (error) {
            // Tratamento de erro (sem mudanças)
            if (error.response && error.response.status === 404) {
                exibirErro(`A carta "${cardName}" não foi encontrada.`);
            } else {
                exibirErro(`Ocorreu um erro: ${error.message}`);
            }
        }
    }

    // --- Parte 3: Funções Auxiliares (Sem mudanças) ---

    function exibirResultados(data) {
        const nome = data.name;
        const precoUSD = data.prices.usd ? `$${data.prices.usd}` : 'N/A';
        const legalidade = data.legalities.commander;
        const imagemURI = data.image_uris.small;

        resultadoDiv.innerHTML = `
            <h3>${nome}</h3>
            <img src="${imagemURI}" alt="Imagem da carta ${nome}" style="width: 200px;">
            <p><strong>Preço (USD):</strong> ${precoUSD}</p>
            <p><strong>Legalidade (Commander):</strong> ${legalidade}</p>
        `;
    }

    function exibirErro(mensagem) {
        resultadoDiv.innerHTML = `<p style="color: red;">${mensagem}</p>`;
    }

    // --- Parte 4: Event Listeners e Funções da Câmera ---

    // 1. O "Ouvinte" do botão de busca por TEXTO
    //    (Este era o bloco que estava faltando)
    searchButton.addEventListener('click', () => {
        const cardNameFromInput = cardInput.value;
        buscarCarta(cardNameFromInput);
    });

    // 2. O "Ouvinte" do NOVO botão de ESCANEAR (CORRIGIDO)
    scanButton.addEventListener('click', async () => {
        // a. Pega as dimensões do vídeo
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
 
        // b. Calcula as coordenadas de recorte
        const sWidth = videoWidth * 0.90; 
        const sHeight = videoHeight * 0.15;
        const sx = videoWidth * 0.05;
        const sy = videoHeight * 0.425;

        // c. Ajusta o tamanho do canvas para ser IGUAL ao recorte
        canvas.width = sWidth;
        canvas.height = sHeight;

        // d. Desenha o quadro no canvas USANDO O RECORTE
        //    (imagem_fonte, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        // e. Feedback imediato
        resultadoDiv.innerHTML = '<p style="color: blue;">Processando imagem com Tesseract.js... (Isso pode demorar)</p>';

        // f. Chama a biblioteca Tesseract.js
        try {
            const result = await Tesseract.recognize(
                canvas,
                'eng+por', 
                { logger: m => console.log(m) }
            );
            
            const cardNameFromOCR = result.data.text.trim();
            console.log(`Texto reconhecido: ${cardNameFromOCR}`);
            
            // e. REUTILIZA nossa função de busca!
            buscarCarta(cardNameFromOCR);

        } catch (ocrError) {
            console.error(ocrError);
            exibirErro("Falha ao processar a imagem com Tesseract.");
        }
    });

    // 3. Função para INICIAR a câmera
    async function iniciarCamera() {
        try {
            // Pede permissão ao usuário
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } // Pede a câmera traseira
            });
            // Joga o feed da câmera no elemento <video>
            video.srcObject = stream;
        } catch (err) {
            console.error("Erro ao acessar a câmera: ", err);
            exibirErro("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
        }
    }

    // --- Parte 5: Inicialização ---
    // Inicia a câmera assim que a página carregar
    iniciarCamera();

});