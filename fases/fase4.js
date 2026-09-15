import { portal } from "../objetos.js";

const cor1 = 'rgb(0, 150, 20)';
const cor2 = 'white';
const cor4 = 'red';
const cor3 = 'rgb(150,3,70)';

const player = {
    position:{
        x: 51.6,
        y: 30,
    },
    tamanho:{
        width: 2,
        height: 5,
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
    gravity: 0.2,
    velMaxY: player.tamanho.height,
    velMaxX: player.tamanho.width,
    larguraFase: 100,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
configFase.proporcao = window.screen.width/configFase.larguraFase
const elementosDoJogo = [
    {
        position: {
            x: 50,
            y: 27,
        },
        tamanho: {
            width: 10,
            height: 3,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 45,
            y: 27,
        },
        tamanho: {
            width: 4,
            height: 8,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 25.3,
            y: 27,
        },
        tamanho: {
            width: 5,
            height: 3,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 9,
            y: 33,
        },
        tamanho: {
            width: 5,
            height: 7,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 14,
            y: 15,
        },
        tamanho: {
            width: 8,
            height: 21,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 4,
            y: 33,
        },
        tamanho: {
            width: 5,
            height: 13,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 22,
            y: 15,
        },
        tamanho: {
            width: 45,
            height: 3,
        },
        color: cor1,
        element: null,
    },
];
const elementosFuncionais = [
    portal,
]

elementosFuncionais[0].position.x = 93;
elementosFuncionais[0].position.y = 3;


export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};