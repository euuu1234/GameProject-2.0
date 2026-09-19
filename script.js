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
                dadosConfig();
                initConfig();
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
                menu_fase.querySelectorAll('img').forEach((e)=>{
                    switch(e.closest('[id]')?.id){
                        case 'fase_1':
                            e.src = './Assets/img-fases/fase1.jpg';
                            e.addEventListener('click', ()=>{window.location.replace('./AQP_game/?fase=1')});
                            break;
                        case 'fase_2':
                            e.src = './Assets/img-fases/fase2.jpg'
                            e.addEventListener('click', ()=>{window.location.replace('./AQP_game/?fase=2')});
                            break;
                        case 'fase_3':
                            e.src = './Assets/img-fases/fase3.jpg'
                            e.addEventListener('click', ()=>{window.location.replace('./AQP_game/?fase=3')});
                            break;
                        case 'fase_4':
                            e.src = './Assets/img-fases/fase4.jpg'
                            e.addEventListener('click', ()=>{window.location.replace('./AQP_game/?fase=4')});
                            break;
                    }
                })
            })
            .catch(error => {
                console.error("Erro ao carregar o arquivo HTML:", error);
            });

    } else if(event.target.closest(".fechar")) {
        document.querySelector('main').remove()
    }

});

let dados = JSON.parse(localStorage.getItem('saves'))

function dadosIniciais() {

    if(dados === null || dados === undefined){
        dados = {
            comandsKeys: {
                direita: ['d', 'ArrowRight'],
                esquerda: ['a', 'ArrowLeft'],
                pular: ['w', 'ArrowUp'],
                correr: ['shift', 'Space']
            }
        };

        localStorage.setItem('saves', JSON.stringify(dados))
    }

}

function dadosConfig() {

    const opsComand = {
        direitaOp1 : document.querySelector('div#direita div#dop1'),
        esquerdaOp1 : document.querySelector('div#esquerda div#eop1'),
        pularOp1 : document.querySelector('div#pular div#pop1'),
        correrOp1 : document.querySelector('div#correr div#cop1'),

        direitaOp2 : document.querySelector('div#direita div#dop2'),
        esquerdaOp2 : document.querySelector('div#esquerda div#eop2'),
        pularOp2 : document.querySelector('div#pular div#pop2'),
        correrOp2 : document.querySelector('div#correr div#cop2')
    }

    opsComand.direitaOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.direita[0] + '</p>';
    opsComand.esquerdaOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.esquerda[0] + '</p>';
    opsComand.correrOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.correr[0] + '</p>';
    opsComand.pularOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.pular[0] + '</p>';

    opsComand.direitaOp2.innerHTML = '<p class="text_key">' + dados.comandsKeys.direita[1] + '</p>';
    opsComand.esquerdaOp2.innerHTML = '<p class="text_key">' + dados.comandsKeys.esquerda[1] + '</p>';
    opsComand.correrOp2.innerHTML = '<p class="text_key">' + dados.comandsKeys.correr[1] + '</p>';
    opsComand.pularOp2.innerHTML = '<p class="text_key">' + dados.comandsKeys.pular[1] + '</p>';
}

function initConfig() {
    const observarMudancas = (() => {
        document.querySelectorAll(".key_box").forEach((e)=>{
            e.addEventListener('click', ()=>{
                e.style.backgroundColor = 'rgba(0, 0, 4, 0.65)'
                e.style.width = '100%';
                e.style.height = '100%';
                e.style.margin = '0';
                e.style.padding = '0';
                e.style.position = 'fixed';
                e.style.left = '0';
                e.style.top = '0';
                e.style.zIndex = '9999';
                

                e.querySelector('p').style.fontSize = '200px'

                document.addEventListener('keydown', (evento)=>{
                    e.innerHTML = '<p class="text_key">' + evento.key + '</p>';
                    e.removeAttribute('style');

                    if(e.closest('#dop1')){
                        dados.comandsKeys.direita[0] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#eop1')){
                        dados.comandsKeys.esquerda[0] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#pop1')){
                        dados.comandsKeys.pular[0] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#cop1')){
                        dados.comandsKeys.correr[0] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#dop2')){
                        dados.comandsKeys.direita[1] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#eop2')){
                        dados.comandsKeys.esquerda[1] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#pop2')){
                        dados.comandsKeys.pular[1] = evento.key.toLowerCase()
                    }else
                    if(e.closest('#cop2')){
                        dados.comandsKeys.correr[1] = evento.key.toLowerCase()
                    }

                    localStorage.setItem('saves', JSON.stringify(dados))

                }, {once: true})
            })
        })
    })

    observarMudancas()
    
    dadosConfig();
}


dadosIniciais();