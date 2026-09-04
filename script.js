document.addEventListener("click", function(event) {
    if (event.target.closest("#configuracoes")) {
        const configuracoes = document.createElement("main");
        configuracoes.id = "menu_container";

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
        menu_fase.id = "menu_container";

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