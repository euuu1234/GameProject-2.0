import {configuracoes} from "../interface/config_pause-icones_e_menus.js";

const urlParams = new URLSearchParams(window.location.search); 
const fase = "../fases/fase"+parseInt(urlParams.get('fase'))+".js";

const moduloFase = await import(`${fase}`);

const {configFase, elementosDoJogo, player, emForPx, elementosFuncionais} = moduloFase;

const corFimTela = 'black';
let btnRight = false;
let btnLeft = false;
let btnUp = false;
let btnDown = false;
let animationFrameId = null;
let jogoRodando = false;
let btnRun = false;
let jump = false;
let velXTrava = false;


const comandsKeys = {
    direita: null,
    esquerda: null,
    pular: null,
    correr: null
}


player.speedXInicial = player.speedX;
player.speedYInicial = player.speedY;

elementosDoJogo.push(
    {
        position: {
            x: -2.99,
            y: 0,
        },
        tamanho: {
            width: 3,
            height: 100,
        },
        color: corFimTela,
        element: null,
    }
);


function everywherePosition(element) {
    return {
        left: element.position.x,
        right: element.position.x + element.tamanho.width,
        bottom: element.position.y,
        top: element.position.y + element.tamanho.height
    };
}

//funções de objetos funcionais
const elementsFunction = {
    conclusaoFase: function(){
        acoesInterface.stopGame();

        const menuFaseVencida = document.createElement('main');
        menuFaseVencida.classList.add('menu');
        menuFaseVencida.style.display = 'flex';
        menuFaseVencida.style.position = 'fixed';

        async function fetchMenuFaseVencida() {
            const response = await fetch('../interface/menu_fase-vencida.html');
            const html = await response.text();

            menuFaseVencida.innerHTML = html;
        }

        fetchMenuFaseVencida();
        document.body.appendChild(menuFaseVencida);
    }
}

function noChao(){
    const somador = {y: -1/configFase.proporcao, x: 0}
    if(
        gerenciaColisao.checkIntersection(somador)[0] === true
    )return true; else return false;
}

//----------------------------------------------------criação de metodos----------------------------------------//

    const acoesJogo = {
        jump:
            function() {
                const verificar = noChao();
                if(
                    verificar &&
                    !jump
                ){
                    player.fisica.velocityY = player.jump;
                    if(btnRight){
                        player.fisica.velocityX = player.speedX;
                    }
                    if(btnLeft)player.fisica.velocityX = -player.speedX
                    jump = true;
                    velXTrava = true;
                }else{
                    if(verificar){
                        velXTrava = false;
                        jump = false;
                    }
                }
            },
        right:
            function() {
                let somador
                if(
                    player.fisica.velocityX < player.speedX &&
                    !velXTrava
                ){
                    somador = 1/configFase.proporcao;
                }else somador = 0;
                player.fisica.velocityX += somador;
            },
        left:
            function() {
                let somador
                if(
                    player.fisica.velocityX > (-player.speedX) &&
                    !velXTrava
                ){
                    somador = 1/configFase.proporcao;
                }else somador = 0;
                player.fisica.velocityX -= somador;
            },
        run:
            function(){
                if(player.speedXInicial >= player.speedX){player.speedX += 0.2}
            },
        noRun:
            function(){
                if(player.speedXInicial < player.speedX){player.speedX = player.speedXInicial;}
            }
        
    }

    const fisica = {
        gravity:
            function() {
                player.fisica.velocityY -= player.speedY * configFase.gravity
            },
        addGravity: 
            function(){
                if(
                    player.fisica.velocityY < configFase.velMaxY &&
                    player.fisica.velocityY > (-configFase.velMaxY)
                )fisica.gravity();else 
                if(player.fisica.velocityY > 0)player.fisica.velocityY = configFase.velMaxY;else
                if(player.fisica.velocityY < 0)player.fisica.velocityY = (-configFase.velMaxY)
            },
        move:
            function(eixo, objeto = null) {
                if(eixo === 'y'){
                    player.position.y += player.fisica.velocityY;
                }else if(
                    eixo === 'x'
                ) {
                    player.position.x += player.fisica.velocityX
                }else if(
                    eixo === 'Ycol' 
                ){
                    if(
                        player.fisica.velocityY > 0
                    ){
                        if(objeto.length <= 2){
                            player.position.y = objeto[1].position.y - player.tamanho.height
                        }//...
                    }else if(
                        player.fisica.velocityY < 0
                    ){
                        if(objeto.length <= 2){
                            player.position.y = objeto[1].position.y + objeto[1].tamanho.height
                        }
                    }
                    player.fisica.velocityY = 0
                }else if(
                    eixo === 'Xcol'
                ){
                    
                    if(
                        player.fisica.velocityX > 0
                    ){
                        if(objeto.length <= 2){
                            player.position.x = objeto[1].position.x - player.tamanho.width
                        }//...
                    }else if(
                        player.fisica.velocityX < 0
                    ){
                        if(objeto.length <= 2){
                            player.position.x = objeto[1].position.x + objeto[1].tamanho.width
                        }
                    }
                    player.fisica.velocityX = 0
                }

                atualizar.updatePlayerPosition();
            },
        
    }

    const atualizar = {
        update:
            function() {
                if(btnRight) acoesJogo.right(); else
                if(btnLeft) acoesJogo.left(); else {
                    if(!velXTrava)player.fisica.velocityX = 0;
                }
                if(btnRun) acoesJogo.run();
                if(!btnRun) acoesJogo.noRun()

                if(jump || btnUp) acoesJogo.jump();
            },
        updatePlayerPosition:
            function() {
                player.element.style.left = player.position.x + 'em';
                player.element.style.bottom = player.position.y + 'em';
            },
        render:
            function() {
                /* const element = document.getElementById('canvas').firstChild;
                element.style.position = 'absolute';
                element.style.left = player.x + 'em';
                element.style.bottom = player.y + 'em'; */
            },
    }

    const acoesInterface = {
        startGame:
            function() {
                if (!jogoRodando) {
                    jogoRodando = true;
                    animationFrameId = requestAnimationFrame(gameLoop);
                }
            },

        stopGame:
            function() {
                jogoRodando = false;

                if (animationFrameId !== null) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            },

        resetGame:
            function() {
                player.position.x = configFase.positionInitial.x;
                player.position.y = configFase.positionInitial.y;
                player.fisica.velocityX = 0;
                player.fisica.velocityY = 0;
            },

        restartGame:
            function() {
                acoesInterface.resetGame();
                acoesInterface.startGame();
            },
        carregarDados:
            function(){
                const dados = JSON.parse(localStorage.getItem('saves'));
                
                comandsKeys.direita = dados.comandsKeys.direita;
                comandsKeys.esquerda = dados.comandsKeys.esquerda;
                comandsKeys.pular = dados.comandsKeys.pular;
                comandsKeys.correr = dados.comandsKeys.correr;
            }
    }

    const onLoad = [
        configuracoes,
        function() {
            document.querySelectorAll('*').forEach ((element) => {
                element.style.fontSize = configFase.proporcao + "px"
            })
        },
        function() {
            elementosDoJogo.forEach(element => {
                const div = document.createElement('div');
                div.style.width = element.tamanho.width + "em"
                div.style.height = element.tamanho.height + "em"
                div.style.background = element.color
                div.style.position = 'fixed'
                div.style.bottom = element.position.y + "em"
                div.style.left = element.position.x + "em"
                

                element.element = div
                document.querySelector('#canvas').appendChild(div)
            });
        },
        function() {
            const element = document.createElement('div');
            player.element = element;
            document.getElementById('canvas').appendChild(element);

            element.style.width = player.tamanho.width + "em";
            element.style.height = player.tamanho.height + "em";

            element.style.backgroundColor = 'yellow';
            element.style.position = 'absolute';

            element.style.zIndex = '9999';

            element.style.left = player.position.x +'em';
            element.style.bottom = player.position.y +'em';
        },
        function() {
                window.addEventListener('keydown', (event) => {
                    switch (event.key.toLowerCase()) {
                        case comandsKeys.direita:
                            btnRight = true;
                            break;
                        case comandsKeys.esquerda:
                            btnLeft = true;
                            break;
                        case comandsKeys.pular:
                            btnUp = true;
                            break;
                        case 'ArrowDown':
                            btnDown = true;
                            break;
                        case comandsKeys.correr:
                            btnRun = true;
                            break;
                        case '=':
                            (()=>{
                                console.log('executou')
                                document.addEventListener("mousemove", (event)=>{
                                    const x = event.clientX
                                    const y = event.clientY
                                    player.position.x = emForPx(x)
                                    player.position.y = emForPx(window.screen.height-y)
                                })
                            })();
                            break;
                        case 'escape':
                            const menuConfig = document.querySelector("#menu-config")
                            if(
                                !document.querySelector('#fases') &&
                                menuConfig.style.display === 'none'
                            ){
                                const menuPause = document.querySelector('.menu-pause');
                                if(menuPause.style.display === 'flex'){
                                    menuPause.style.display = 'none';
                                    document.querySelectorAll('.parador').forEach((element)=>{
                                        element.style.display = 'flex';
                                    })
                                    acoesInterface.startGame();
                                }else{ 
                                    menuPause.style.display = 'flex';
                                    document.querySelectorAll('.parador').forEach((element)=>{
                                        element.style.display = 'none';
                                    })
                                    acoesInterface.stopGame();
                                }
                            }else if(
                                menuConfig.style.display === 'flex'
                            ){
                                menuConfig.style.display = 'none';
                                document.querySelectorAll('.parador').forEach((element)=>{
                                    element.style.display = 'flex';
                                });
                                acoesInterface.startGame();
                            }
                            break;
                    }
                });

                window.addEventListener('keyup', (event) => {
                    switch (event.key.toLowerCase()) {
                        case comandsKeys.direita:
                            btnRight = false;
                            break;
                        case comandsKeys.esquerda:
                            btnLeft = false;
                            break;
                        case comandsKeys.pular:
                            btnUp = false;
                            break;
                        case 'ArrowDown':
                            btnDown = false;
                            break;
                        case comandsKeys.correr:
                            btnRun = false;
                            break;
                    }
                });

                document.addEventListener('click', (event)=>{
                    if(event.target.closest('.parador')){
                        acoesInterface.stopGame()
                    }
                    if(event.target.closest('.startador')){
                        acoesInterface.startGame()
                    }
                    if(event.target.closest('.resetador')){
                        acoesInterface.restartGame();
                        if(document.querySelector('#fases')){
                            document.querySelector('#fases').closest('.menu').remove();
                        }
                    }
                });
        },
        function() {
            acoesInterface.carregarDados();

            const menu = document.querySelector('.menu');

            const observarMudancas = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.id === 'config_box' || node.querySelector?.('#config_box')) {
                            const opsComand = {
                                direitaOp1 : document.querySelector('div#direita div#dop1'),
                                esquerdaOp1 : document.querySelector('div#esquerda div#eop1'),
                                pularOp1 : document.querySelector('div#pular div#pop1'),
                                correrOp1 : document.querySelector('div#correr div#cop1')
                            }

                            opsComand.direitaOp1.innerHTML = '<p class="text_key">' + comandsKeys.direita + '</p>';
                            opsComand.esquerdaOp1.innerHTML = '<p class="text_key">' + comandsKeys.esquerda + '</p>';
                            opsComand.correrOp1.innerHTML = '<p class="text_key">' + comandsKeys.correr + '</p>';
                            opsComand.pularOp1.innerHTML = '<p class="text_key">' + comandsKeys.pular + '</p>';

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

                                        acoesInterface.carregarDados()
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
        }
    ]

    const gerenciaColisao = {
        checkIntersection: function(somar, grupoDeElementos = elementosDoJogo){
            const ladosPlayer = everywherePosition(player);
            let verificacao = [
                false
            ]
            
            for (const element of grupoDeElementos) {
                const ladosObjeto = everywherePosition(element);

                if (
                    ladosPlayer.left + somar.x < ladosObjeto.right &&
                    ladosPlayer.right + somar.x > ladosObjeto.left &&
                    ladosPlayer.bottom + somar.y < ladosObjeto.top &&
                    ladosPlayer.top + somar.y > ladosObjeto.bottom
                ) {
                    verificacao[0] = true;
                    verificacao[verificacao.length] = element
                }
            }

            return verificacao;
        },

        futureX: function(){
            const valores = {
                x: player.fisica.velocityX,
                y: 0
            }

            return valores;
        },

        futureY: function(){
            const valores = {
                x: 0,
                y: player.fisica.velocityY
            }

            return valores;
        },

        chekingCollison: function(){

            const checagemY = gerenciaColisao.checkIntersection(
                gerenciaColisao.futureY()
            );

            const checagemX = gerenciaColisao.checkIntersection(
                gerenciaColisao.futureX()
            );

            if(
                checagemY[0] === false
            ){
                fisica.move('y')
            }else {
                fisica.move('Ycol', checagemY)
            }

            if(
                checagemX[0] === false
            ){
                fisica.move('x')
            }else {
                fisica.move('Xcol', checagemX)
            }
        },

        ativarFuncaoObjeto: function(){
            const resultado = this.checkIntersection({ x: 0, y: 0 }, elementosFuncionais);
            if(resultado[0] === true){
                resultado.forEach((element)=>{
                    if(element.nome === "portal"){
                        if(element.funcao === null){
                            element.funcao = elementsFunction.conclusaoFase
                        };
                        element.funcao();
                    }
                });
            }
        }
    }

//----------------------------------------------------criação de metodos----------------------------------------//

const pixelsTela = window.screen.width
const emTela = emForPx(pixelsTela)

const blocoFim = {
    tamanho:{
        width: 3,
        height: 100,
    },
    position: {
        x: parseFloat(emTela)-0.2,
        y: 0,
    },
    color: corFimTela,
    element: null,
}
elementosDoJogo.push(blocoFim);

onLoad.forEach((element)=>{
    element()
})

elementosFuncionais.forEach((element)=>{
    const newElement = document.createElement('div');
    
    newElement.style.width = element.tamanho.width + 'em'
    newElement.style.height = element.tamanho.height + 'em'
    newElement.style.position = 'absolute'
    newElement.style.bottom = element.position.y + 'em'
    newElement.style.left = element.position.x + 'em'
    newElement.style.backgroundImage = `url(${element.src})`
    newElement.style.backgroundSize = '100% 100%'
    newElement.style.backgroundRepeat = 'no-repeat'

    document.querySelector('#canvas').appendChild(newElement)
})

function gameLoop() {
    if (!jogoRodando) {
        animationFrameId = null;
        return;
    }

    fisica.addGravity();
    atualizar.update();

    gerenciaColisao.chekingCollison();

    gerenciaColisao.ativarFuncaoObjeto();





    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    
    
    
    if(player.position.y <= 0){
        acoesInterface.resetGame();
    }
    
    
    
    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    //--------------------------------morte-----------------------------------//
    
    






    if (jogoRodando) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

acoesInterface.startGame()