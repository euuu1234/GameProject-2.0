document.addEventListener("click", function(event) {
    if (event.target.closest("#configuracoes")) {
        const configuracoes = document.createElement("main");
        configuracoes.classList.add('menu');
        
        configuracoes.id = "menu-config";

        fetch("./interface/config.html")
            .then(response => response.text())
            .then(html => {
                configuracoes.innerHTML = html;
                document.body.appendChild(configuracoes);
            })
            .catch(error => {
                console.error("Erro ao carregar o arquivo HTML:", error);
            });
        
    }else if(event.target.closest("#escolher_fase")) {
        const menu_fase = document.createElement("main");
        menu_fase.id = "menu-config";
        menu_fase.classList.add('menu')

        fetch("./interface/menu_fase-vencida.html")
            .then(response => response.text())
            .then(html => {
                menu_fase.innerHTML = html;
                document.body.appendChild(menu_fase);
                document.querySelector(".fechar").innerText = "fechar";
            })
            .catch(error => {
                console.error("Erro ao carregar o arquivo HTML:", error);
            });

    } else if(event.target.closest(".fechar")) {
        document.querySelector('main').remove()
    }
});

let dados = JSON.parse(localStorage.getItem('saves'))

if(dados === null || dados === undefined){
    dados = {
        comandsKeys: {
            direita: 'd',
            esquerda: 'a',
            pular: 'w',
            correr: 'shift'
        }
    };

    localStorage.setItem('saves', JSON.stringify(dados))
}
