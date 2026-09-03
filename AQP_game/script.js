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

player.fisica.velYMax = configFase.tamanhoMinimo;

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
        menuFaseVencida.style.backgroundColor = 'rgba(250, 200, 20, 0.865)';
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

//----------------------------------------------------criação de metodos----------------------------------------//

    const acoesJogo = {
        jump:
            function() {
                const somador = {y: -1/configFase.proporcao, x: 0}
                if(gerenciaColisao.checkIntersection(somador)[0] === true){
                    player.fisica.velocityY = player.jump
                }
            },
        right:
            function() {
                player.fisica.velocityX = player.speed;
            },
        left:
            function() {
                player.fisica.velocityX = -player.speed;
            },
        
    }

    const fisica = {
        gravity:
            function() {
                player.fisica.velocityY -= player.speed * configFase.gravity
            },
        addGravity: 
            function(){
                if(
                    player.fisica.velocityY < player.fisica.velYMax &&
                    player.fisica.velocityY > (-player.fisica.velYMax)
                )fisica.gravity();
            },
        move:
            function(eixo) {
                if(eixo === 'y'){
                    player.position.y += player.fisica.velocityY;
                }else if(
                    eixo === 'x'
                ) {
                    player.position.x += player.fisica.velocityX
                }else if(
                    eixo === 'Ycol' 
                ){
                    player.fisica.velocityY = player.fisica.velocityY > 0 ?
                    -1/configFase.proporcao :
                    1/configFase.proporcao
                }else if(
                    eixo === 'Xcol'
                ){
                    player.fisica.velocityX = player.fisica.velocityX > 0 ?
                    -1/configFase.proporcao :
                    1/configFase.proporcao
                }

                atualizar.updatePlayerPosition();
            },
        
    }

    const atualizar = {
        update://preciso melhorar isso, junto as formas como a velocidade é modificada
            function() {
                if(btnRight) acoesJogo.right(); else
                if(btnLeft) acoesJogo.left(); else {
                    player.fisica.velocityX = 0;
                }

                if(btnUp) acoesJogo.jump();
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
                if(
                    element.tamanho.width > configFase.tamanhoMinimo &&
                    element.tamanho.height > configFase.tamanhoMinimo
                ){
                    const div = document.createElement('div');
                    div.style.width = element.tamanho.width + "em"
                    div.style.height = element.tamanho.height + "em"
                    div.style.background = element.color
                    div.style.position = 'fixed'
                    div.style.bottom = element.position.y + "em"
                    div.style.left = element.position.x + "em"
                    

                    element.element = div
                    document.querySelector('#canvas').appendChild(div)
                }
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
                    switch (event.key) {
                        case 'ArrowRight':
                            btnRight = true;
                            break;
                        case 'ArrowLeft':
                            btnLeft = true;
                            break;
                        case 'ArrowUp':
                            btnUp = true;
                            break;
                        case 'ArrowDown':
                            btnDown = true;
                            break;
                        case 'Escape':
                            if(
                                !document.querySelector('#fases') &&
                                document.querySelector('#volume').closest('.menu').style.display === 'none'
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
                            }
                            break;
                    }
                });

                window.addEventListener('keyup', (event) => {
                    switch (event.key) {
                        case 'ArrowRight':
                            btnRight = false;
                            break;
                        case 'ArrowLeft':
                            btnLeft = false;
                            break;
                        case 'ArrowUp':
                            btnUp = false;
                            break;
                        case 'ArrowDown':
                            btnDown = false;
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
                fisica.move('Ycol')
            }

            if(
                checagemX[0] === false
            ){
                fisica.move('x')
            }else {
                fisica.move('Xcol')
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
elementosDoJogo.push(blocoFim)

onLoad.forEach((element)=>{
    element()
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

    if (jogoRodando) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //..................////...................////................////....................////...............//
   //..................////...................////.................///....................////...............//
   //..................////...................////.................///....................////...............//
   //......      ......////......       ......////.....       ....../////////......///////////......///////////
   //......      ......////......       ......////.....       ....../////////......///////////......///////////
   //......      ......////......       ......////.....       .....//////////......///////////......///////////
   //..................////...................////.................//////////......///////////......///////////
   //..................////...................////................///////////......///////////...............//
   //..................////...................////.....//......//////////////......///////////...............//
   //......////////////////......///////......////.....///....../////////////......///////////...............//
   //......////////////////......///////......////.....////......////////////......///////////......///////////
   //......////////////////......///////......////...../////......///////////......///////////......///////////
   //......////////////////......///////......////.....//////......//////////......///////////...............//
   //......////////////////......///////......////.....///////....../////////......///////////...............//
   //......////////////////......///////......////.....////////......////////......///////////...............//
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //.....................///////////............................/////........//////....................../////
   //......................./////////............................/////........//////....................../////
   //........................////////............................/////........//////....................../////
   //.......       ..........////////........            ......../////........//////.......////////////////////
   //.......        ..........///////........            ......../////........//////.......////////////////////
   //.......         ..........//////........            ......../////........//////....................../////
   //.......         ..........//////........            ......../////........//////....................../////
   //.......         ..........//////........            ......../////........//////....................../////
   //.......         ..........//////........            ......../////......../////////////////////......./////
   //.......         ..........//////........            ......../////......../////////////////////......./////
   //.......        ..........///////........            ......../////......../////////////////////......./////
   //.......       ..........////////........            ......../////......../////////////////////......./////
   //......................//////////............................/////........//////....................../////
   //....................////////////............................/////........//////....................../////
   //.................../////////////............................/////........//////....................../////
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
acoesInterface.startGame()