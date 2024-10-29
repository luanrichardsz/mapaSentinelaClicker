
// Função para pegar os parâmetros da URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lat: params.get('lat'),
        lng: params.get('lng'),
        message: params.get('message')
    };
}

// Pegando os parâmetros e exibindo na página
const params = getQueryParams();
document.getElementById('message').value = `${params.message}`;