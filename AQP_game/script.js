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

//----------------------------------------------------criação de metodos----------------------------------------//

    const acoesJogo = {
        jump:
            function() {
                const somador = {y: -1/configFase.proporcao, x: 0}
                if(
                    gerenciaColisao.checkIntersection(somador)[0] === true &&
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
                    if(gerenciaColisao.checkIntersection(somador)[0] === true){
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
                        case 'Shift':
                            btnRun = true;
                            break;
                        case 'P':
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
                        case 'Shift':
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