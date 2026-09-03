const cor1 = 'rgb(0, 150, 20)';
const cor2 = 'white';
const cor4 = 'red';
const cor3 = 'rgb(150,3,70)';

const player = {
    position:{
        x: 1,
        y: 3,
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
    jump: 2,
};
const configFase = {
    width: 800,
    height: 600,
    proporcao: 15,
    gravity: 0.2,
    tamanhoMinimo: player.tamanho.height * 0.5,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
const elementosDoJogo = [
    {
        position: {
            x: 0,
            y: 0,
        },
        tamanho: {
            width: emForPx(window.screen.width),
            height: 3,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 13,
            y: 10,
        },
        tamanho: {
            width: 5,
            height: 15,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 58,
            y: 20,
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
            x: 66,
            y: 26,
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
            x: 49,
            y: 30,
        },
        tamanho: {
            width: 11,
            height: 3,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 30,
            y: 30,
        },
        tamanho: {
            width: 11,
            height: 3,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 20,
            y: 3,
        },
        tamanho: {
            width: 50,
            height: 5,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 0,
            y: 14,
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
            y: 8,
        },
        tamanho: {
            width: 5,
            height: 3,
        },
        color: cor3,
        element: null,
    },
];
const elementosFuncionais = [
    {
        position: {
            x: 1,
            y: 17
        },
        tamanho: {
            width: 5,
            height: 7
        },
        src: '../Assets/img-elementos_animados/portal.png',
        nome: 'portal',
        funcao: null,
        animation: null,
    }
]



export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};