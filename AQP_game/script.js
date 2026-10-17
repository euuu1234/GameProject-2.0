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

const idsBoxKey = {
    '#dop': 'direita',
    '#eop': 'esquerda',
    '#pop': 'pular',
    '#cop': 'correr',
}

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
        menuFaseVencida.style.zIndex = '9999';

        async function fetchMenuFaseVencida() {
            const response = await fetch('../interface/menu_fase-vencida.html');
            const html = await response.text();

            menuFaseVencida.innerHTML = html;


            menuFaseVencida.querySelectorAll('img').forEach((e)=>{
                    const elemento = e.closest('[id]');
                    const id = elemento ? elemento.id : '';
                    const ultimosDois = parseInt(id.slice(-2));

                    if(ultimosDois > 0){
                        e.src = `../Assets/img-fases/fase_0${ultimosDois}.png`;
                        e.addEventListener('click', ()=>{window.location.replace(`./?fase=${ultimosDois}`)});
                    }
                })
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
            function(chao = noChao()) {
                if(
                    chao &&
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
                    if(chao){
                        if(!btnRun){
                           acoesJogo.noRun()
                        }
                        if (btnRight) {
                            player.fisica.velocityX = player.speedX
                        }
                        if (btnLeft) {
                            player.fisica.velocityX = -player.speedX
                        }
                        velXTrava = false;
                        jump = false;
                    }
                }
            },
        right:
            function() {
                let somador;

                if(
                    player.fisica.velocityX < player.speedX &&
                    !velXTrava
                ){
                    somador = 10 / configFase.proporcao;
                }else{
                    somador = 0;
                }

                player.fisica.velocityX += somador;
            },
        left:
            function() {
                let somador;

                if(
                    player.fisica.velocityX > (-player.speedX) &&
                    !velXTrava
                ){
                    somador = 10 / configFase.proporcao;
                }else{
                    somador = 0;
                }

                player.fisica.velocityX -= somador;
            },
        run:
            function(){
                if(player.speedXInicial >= player.speedX){
                    player.speedX += configFase.run;
                }
            },
        noRun:
            function(){
                if(player.speedXInicial < player.speedX){player.speedX = player.speedXInicial;}
            }
        
    }

    const fisica = {
        gravity:
            function(tempo) {
                player.fisica.velocityY -= configFase.gravity * tempo;
            },
        addGravity:
            function(tempo, chao){
                if(
                    !chao
                ){
                    fisica.gravity(tempo);
                }
            },
        move:
            function(t, eixo, objeto = null) {
                if(eixo === 'y'){
                    player.position.y += player.fisica.velocityY * t;
                }else if(
                    eixo === 'x'
                ) {
                    player.position.x += player.fisica.velocityX  * t;
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
                        (player.fisica.velocityX > 0 || player.fisica.velocityX < 0) &&
                        everywherePosition(player).bottom == everywherePosition(objeto[1]).top
                    ){
                        player.position.x += player.fisica.velocityX  * t * 2;
                        player.position.y = objeto[1].position.y + objeto[1].tamanho.height;
                    }else if(
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
            function(tempo, chao) {
                if(btnRight) acoesJogo.right(tempo);
                else if(btnLeft) acoesJogo.left(tempo);
                else {
                    if(!velXTrava){
                        player.fisica.velocityX = 0;
                    }
                }

                if(btnRun) acoesJogo.run(tempo);
                if(!btnRun) acoesJogo.noRun();

                if(jump || btnUp) acoesJogo.jump(chao);
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
                if(element.id !== undefined)
                /* div.style.backgroundImage = 
                `url('../Assets/img-objetos/OBJETO${element.id}.png')`; else
                div.style.backgroundColor = element.color */
                div.style.backgroundSize = 'cover'
                div.style.position = 'absolute'
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

            element.style.position = 'absolute';
            element.style.backgroundColor = 'yellow '

            element.style.left = player.position.x +'em';
            element.style.bottom = player.position.y +'em';

            const img = document.createElement('img');
            
            img.style.height = '100%';
            img.style.position = 'absolute';
            img.style.right = '0';

            player.element.appendChild(img);
        },
        function() {
                window.addEventListener('keydown', (event) => {
                    switch (event.key.toLowerCase()) {
                        case comandsKeys.direita[0].toLowerCase():
                        case comandsKeys.direita[1].toLowerCase():
                            btnRight = true;
                            break;
                        case comandsKeys.esquerda[0].toLowerCase():
                        case comandsKeys.esquerda[1].toLowerCase():
                            btnLeft = true;
                            break;
                        case comandsKeys.pular[0].toLowerCase():
                        case comandsKeys.pular[1].toLowerCase():
                            btnUp = true;
                            break;
                        case 'ArrowDown':
                            btnDown = true;
                            break;
                        case comandsKeys.correr[0].toLowerCase():
                        case comandsKeys.correr[1].toLowerCase():
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
                        case comandsKeys.direita[0].toLowerCase():
                        case comandsKeys.direita[1].toLowerCase():
                            btnRight = false;
                            break;
                        case comandsKeys.esquerda[0].toLowerCase():
                        case comandsKeys.esquerda[1].toLowerCase():
                            btnLeft = false;
                            break;
                        case comandsKeys.pular[0].toLowerCase():
                        case comandsKeys.pular[1].toLowerCase():
                            btnUp = false;
                            break;
                        case 'ArrowDown':
                            btnDown = false;
                            break;
                        case comandsKeys.correr[0].toLowerCase():
                        case comandsKeys.correr[1].toLowerCase():
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
                                correrOp1 : document.querySelector('div#correr div#cop1'),

                                direitaOp2 : document.querySelector('div#direita div#dop2'),
                                esquerdaOp2 : document.querySelector('div#esquerda div#eop2'),
                                pularOp2 : document.querySelector('div#pular div#pop2'),
                                correrOp2 : document.querySelector('div#correr div#cop2')
                            }

                            opsComand.direitaOp1.innerHTML = '<p class="text_key">' + comandsKeys.direita[0] + '</p>';
                            opsComand.esquerdaOp1.innerHTML = '<p class="text_key">' + comandsKeys.esquerda[0] + '</p>';
                            opsComand.correrOp1.innerHTML = '<p class="text_key">' + comandsKeys.correr[0] + '</p>';
                            opsComand.pularOp1.innerHTML = '<p class="text_key">' + comandsKeys.pular[0] + '</p>';

                            opsComand.direitaOp2.innerHTML = '<p class="text_key">' + comandsKeys.direita[1] + '</p>';
                            opsComand.esquerdaOp2.innerHTML = '<p class="text_key">' + comandsKeys.esquerda[1] + '</p>';
                            opsComand.correrOp2.innerHTML = '<p class="text_key">' + comandsKeys.correr[1] + '</p>';
                            opsComand.pularOp2.innerHTML = '<p class="text_key">' + comandsKeys.pular[1] + '</p>';

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
                                        
                                        let dados = JSON.parse(localStorage.getItem('saves'));
                                        
                                        for(let elemento in idsBoxKey){
                                            if(e.closest(elemento + 1)){
                                                dados.comandsKeys[idsBoxKey[elemento]][0] = evento.key.toLowerCase()
                                            }else if(e.closest(elemento + 2)){
                                                dados.comandsKeys[idsBoxKey[elemento]][1] = evento.key.toLowerCase()
                                            }
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
        },
        function() {
            document.querySelector('#canvas').style.height = configFase.height + 'em';
            document.querySelector('#canvas').style.backgroundImage = 'url(../Assets/img-fases/fase_1.jpg)';
            document.querySelector('#canvas').style.backgroundSize = '100%';
            
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

        futureX: function(t){
            const valores = {
                x: player.fisica.velocityX * t,
                y: 0
            }

            return valores;
        },

        futureY: function(t){
            const valores = {
                x: 0,
                y: player.fisica.velocityY * t
            }

            return valores;
        },

        chekingCollison: function(t){

            const checagemY = gerenciaColisao.checkIntersection(
                gerenciaColisao.futureY(t)
            );

            const checagemX = gerenciaColisao.checkIntersection(
                gerenciaColisao.futureX(t)
            );

            if(
                checagemY[0] === false
            ){
                fisica.move(t, 'y')
            }else {
                fisica.move(t, 'Ycol', checagemY)
            }

            if(
                checagemX[0] === false
            ){
                fisica.move(t, 'x')
            }else {
                fisica.move(t, 'Xcol', checagemX)
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
    /* newElement.style.backgroundImage = `url(${element.src})` */
    newElement.style.backgroundSize = '100% 100%'
    newElement.style.backgroundRepeat = 'no-repeat'

    document.querySelector('#canvas').appendChild(newElement)
})

let ultimoTempo = performance.now();
function gameLoop(tempoAtual) {
    if (!jogoRodando) {
        animationFrameId = null;
        return;
    }

    // Tempo passado desde o último frame, em segundos
    const deltaTime = (tempoAtual - ultimoTempo) / 1000;

    ultimoTempo = tempoAtual;

    const verificar = noChao();

    fisica.addGravity(deltaTime, verificar);
    atualizar.update(deltaTime, verificar);

    gerenciaColisao.chekingCollison(deltaTime);

    gerenciaColisao.ativarFuncaoObjeto();

    //--------------------------------morte-----------------------------------//

    if (player.position.y <= 0) {
        acoesInterface.resetGame();
    }

    atualizarAnimacao(verificar);

    //--------------------------------morte-----------------------------------//

    if (jogoRodando) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

















function atualizarAnimacao(verificar = noChao()){
    
    if(
        player.fisica.velocityX > 0
    ){
        player.element.style.transform = 'scaleX(1)'
    }else
    if(
        player.fisica.velocityX < 0
    ){
        player.element.style.transform = 'scaleX(-1)'
    }
    if(verificar === true){
        if(btnUp){
            animar("pular_")
        }else if(
            player.fisica.velocityX > 0 ||
            player.fisica.velocityX < 0
        ){
            animar("andar_");
        }else animar('parar_')
    }else {
        if(player.fisica.velocityY > 0){
            animar("pular_")
        }else if(player.fisica.velocityY < 0){
            animar("cair_")
        }
    }
}

function animar(acao){
    if(player.animacao.imagem[0] !== acao){
        player.animacao.imagem[0] = acao;
        player.animacao.imagem[1] = 1;
        player.animacao.imagem[2] = 1;
    }
    

    player.element.querySelector('img').src = "../Assets/img-animacoes/" + acao + player.animacao.imagem[1] + ".png";

    player.animacao.imagem[2] += 1;

    if(
        player.animacao.imagem[2] %
        player.animacao.caracteristicasImg[acao].duracao === 0

    ){
        if(acao !== "pular_" && acao !== "cair_")player.animacao.imagem[1] += 1;

        else if(player.animacao.caracteristicasImg[acao].quantidade > player.animacao.imagem[1]){
            player.animacao.imagem[1] += 1;
        }
    }


    if(
        (player.animacao.imagem[2] >=
        (player.animacao.caracteristicasImg[acao].duracao * player.animacao.caracteristicasImg[acao].quantidade)) &&
        acao !== "pular_" &&
        acao !== "cair_" 
    ){
        player.animacao.imagem[1] = 1;
        player.animacao.imagem[2] = 1;
    }
    
}
































player.animacao = {
    caracteristicasImg: {
        "andar_": {
            duracao: 3,
            quantidade: 24
        },
        "pular_": {
            duracao: 7, 
            quantidade: 3
        },
        "cair_": {
            duracao: 3,
            quantidade: 9
        },
        "parar_": {
            duracao: 3, 
            quantidade: 7
        },
    },
    imagem: [
        'andar_',
        1,
        1
    ]
};
acoesInterface.startGame();