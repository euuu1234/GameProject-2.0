import { portal } from "../objetos.js";

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
        height: 6,
    },
    fisica: {
        velocityX: 0,
        velocityY: 0,
    },
    speedY: 0.5,
    speedX: 0.5,
    element: null,
    jump: 1.2,
};
const configFase = {
    width: 800,
    height: 600,
    gravity: 12,
    velMaxY: player.tamanho.height,
    velMaxX: player.tamanho.width,
    larguraFase: 75,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
configFase.proporcao = window.screen.width/configFase.larguraFase
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
            x: 10,
            y: 19,
        },
        tamanho: {
            width: 5,
            height: 8,
        },
        color: cor3,
        element: null,
    },
    {
        position: {
            x: 15,
            y: 19,
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
            x: 64,
            y: 8,
        },
        tamanho: {
            width: 6,
            height: 8,
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
            y: 16,
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
            width: 9,
            height: 3,
        },
        color: cor3,
        element: null,
    },
];
const elementosFuncionais = [
    portal,
    
]

elementosFuncionais[0].position.x = 1;
elementosFuncionais[0].position.y = 19;



export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};