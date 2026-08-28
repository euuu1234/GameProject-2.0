const cor1 = 'rgb(0, 150, 20)';
const cor2 = 'white';
const cor3 = 'rgb(150,3,70)';
const cor4 = 'red';
const corFimTela = 'black';
let btnRight = false;
let btnLeft = false;
let btnUp = false;
let btnDown = false;


const player = {
    position:{
        x: 1,
        y: 5,
    },
    tamanho:{
        width: 2,
        height: 5,
    },
    fisica: {
        velocityX: 0,
        velocityY: 0,
    },
    speed: 0.5,
    element: null,
    jump: 1.1,
};
const elementosDoJogo = [
    {
        position: {
            x: 0,
            y: 0,
        },
        tamanho: {
            width: 120,
            height: 5,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 20,
            y: 5.1,
        },
        tamanho: {
            width: 50,
            height: 3,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 0.1,
            y: 14.5,
        },
        tamanho: {
            width: 50,
            height: 3,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 55,
            y: 8.2,
        },
        tamanho: {
            width: 5,
            height: 3,
        },
        color: cor3,
        element: null,
    },
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
];
const configFase = {
    width: 800,
    height: 600,
    proporcao: 15,
    gravity: 0.2,
    tamanhoMinimo: player.tamanho.height * 0.5,
};

player.fisica.velYMax = configFase.tamanhoMinimo;

function everywherePosition(element) {
    return {
        left: element.position.x,
        right: element.position.x + element.tamanho.width,
        bottom: element.position.y,
        top: element.position.y + element.tamanho.height
    };
}

//converter do px
function emForPx(number){
    return (number / configFase.proporcao)
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
                requestAnimationFrame(gameLoop);
            },

        stopGame:
            function() {
                cancelAnimationFrame(gameLoop);
            },

        resetGame:
            function() {
                player.position.x = 0;
                player.position.y = 0;
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
                    div.style.border = '1px solid black'
                    

                    element.element = div
                    document.querySelector('#canvas').appendChild(div)
                }
            });
        },
        function() {
            const element = document.createElement('div');
            player.element = element;
            document.getElementById('canvas').appendChild(element);

            //atributos do element (player)
            element.style.width = player.tamanho.width + "em";
            element.style.height = player.tamanho.height + "em";
            element.style.backgroundColor = 'red';
            element.style.position = 'absolute';
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
            } 
    ]

    const gerenciaColisao = {
        checkIntersection: function(somar){
            const ladosPlayer = everywherePosition(player);
            let verificacao = [
                false
            ]

            for (const element of elementosDoJogo) {
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
        }
    }

//----------------------------------------------------criação de metodos----------------------------------------//

const pixelsTela = window.screen.width
const emTela = emForPx(pixelsTela)
console.log(emTela)

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
    fisica.addGravity()
    atualizar.update();
    
    gerenciaColisao.chekingCollison()
    requestAnimationFrame(gameLoop);
}

acoesInterface.startGame();