var map; // Defina o mapa fora da função para que ele seja acessível globalmente
let messages = {}; // Variável para armazenar mensagens do JSON

function sucess(pos) {
    console.log(pos.coords.latitude, pos.coords.longitude);

    // Função para carregar mensagens do arquivo JSON
    function loadMessages() {
        return fetch('ocorrencias.json')
            .then(response => response.json())
            .then(data => {
                messages = data; // Armazena as mensagens na variável
            })
            .catch(error => console.error("Erro ao carregar mensagens:", error));
    }

    // Inicializando o mapa apenas se ele ainda não existir
    if (!map) {
        map = L.map('mapid').setView([pos.coords.latitude, pos.coords.longitude], 15);
    } else {
        // Removendo o mapa anterior, se ele existir
        map.off();
        map.remove();
        map = L.map('mapid').setView([pos.coords.latitude, pos.coords.longitude], 15);
    }

    // Adicionando o tile layer ao mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 13
    }).addTo(map);

    // Criando um marcador nas coordenadas atuais
    L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map)
        .bindPopup('Tas errado pirraia louco')
        .openPopup();

    // Adicionando o evento de clique no mapa
    map.on('click', function(e) {
        if (e.latlng) {
            var lat = e.latlng.lat;
            var lng = e.latlng.lng;

            // Fazer a requisição para o serviço de geocodificação reversa (OpenStreetMap Nominatim)
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                // Montar o endereço no formato desejado
                var road = data.address.road || ""; // Nome da rua
                var suburb = data.address.suburb || ""; // Subúrbio
                var city = data.address.city || data.address.town || ""; // Cidade
                var state = data.address.state || ""; // Estado

                // Formatar o endereço
                var userMessage = `${road}, ${suburb}, ${city}, ${state}`;

                // Criando um objeto JSON para armazenar
                var addressData = {
                    latitude: lat,
                    longitude: lng,
                    address: userMessage
                };

                // Armazenar o endereço em um array no localStorage
                var addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                addresses.push(addressData);
                localStorage.setItem('addresses', JSON.stringify(addresses));

                // Criando um marcador onde o usuário clicou
                L.marker([lat, lng]).addTo(map)
                    .bindPopup(userMessage) // Mostra o nome da rua no popup
                    .openPopup();

                // Redirecionando para outra página com o endereço
                window.location.href = `../Postar/index.html?lat=${lat}&lng=${lng}&message=${encodeURIComponent(userMessage)}`;

                console.log(addressData)

                console.log(lat, lng)
            })
            .catch(error => {
                console.error("Erro ao obter o endereço:", error);
            });
        } else {
            console.error("Erro: Coordenadas não encontradas!");
        }
    });
}


//se nao
function error( err ){
    console.log(err.message)
}

//para atualizar a loc em tempo real
var whatchID = navigator.geolocation.watchPosition( sucess, error, {
    //pegar maior precisão da loc
    enableHighAccuracy: true,
} );

/* função para parar de ver a loc
navigator.geolocation.clearWatch(whatchID); 
*/

