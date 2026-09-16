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

function dadosIniciais() {

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
}

function dadosConfig() {

    const opsComand = {
        direitaOp1 : document.querySelector('div#direita div#dop1'),
        esquerdaOp1 : document.querySelector('div#esquerda div#eop1'),
        pularOp1 : document.querySelector('div#pular div#pop1'),
        correrOp1 : document.querySelector('div#correr div#cop1')
    }

    opsComand.direitaOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.direita + '</p>';
    opsComand.esquerdaOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.esquerda + '</p>';
    opsComand.correrOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.correr + '</p>';
    opsComand.pularOp1.innerHTML = '<p class="text_key">' + dados.comandsKeys.pular + '</p>';
}

function initConfig() {
    const menu = document.querySelector('.menu');

    const observarMudancas = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.id === 'config_box' || node.querySelector?.('#config_box')) {


                    document.querySelectorAll(".key_box").forEach((e)=>{
                        e.addEventListener('click', ()=>{
                            e.style.backgroundColor = 'rgba(122, 133, 144, 0.31)'
                            e.style.border = 'rgb(255, 0, 0) solid 7px'
                            e.style.width = '100%';
                            e.style.height = '100%';
                            e.style.margin = '0';
                            e.style.position = 'fixed';
                            e.style.left = '0';
                            e.style.top = '0';
                            e.style.fontSize = '80px';
                            e.style.zIndex = '9999';

                            document.addEventListener('keydown', (evento)=>{
                                e.innerHTML = '<p class="text_key">' + evento.key + '</p>';
                                e.removeAttribute('style');
                                
                                let dados = JSON.parse(localStorage.getItem('saves'));

                                if(e.closest('#direita')){
                                    dados.comandsKeys.direita = evento.key.toLowerCase()
                                }else
                                if(e.closest('#esquerda')){
                                    dados.comandsKeys.esquerda = evento.key.toLowerCase()
                                }else
                                if(e.closest('#pular')){
                                    dados.comandsKeys.pular = evento.key.toLowerCase()
                                }else
                                if(e.closest('#correr')){
                                    dados.comandsKeys.correr = evento.key.toLowerCase()
                                }

                                localStorage.setItem('saves', JSON.stringify(dados))

                            }, {once: true})
                        })
                    })
                }
            }
        }
    });

    observarMudancas.observe(menu, {
        childList: true,
        subtree: true
    });

    dadosConfig();
}


dadosIniciais();