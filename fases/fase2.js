import { portal } from "../objetos.js";

const cor1 = 'rgb(0, 150, 20)';
const cor2 = 'white';
const cor4 = 'red';
const cor3 = 'rgb(150,3,70)';

const player = {
    position:{
        x: 20,
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
    speedX: 0.5,
    speedY: 0.5,
    element: null,
    jump: 1.2,
};
const configFase = {
    width: 800,
    height: 600,
    gravity: 11,
    larguraFase: 150,
    velMaxY: player.tamanho.height,
    velMaxX: player.tamanho.width,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
configFase.proporcao = window.screen.width/configFase.larguraFase
const elementosDoJogo = [
    {
        position: {
            x: 17,
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
            x: 27,
            y: 30,
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
            x: 35,
            y: 37.5,
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
            x: 50,
            y: 25,
        },
        tamanho: {
            width: 43,
            height: 3,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 130,
            y: 0,
        },
        tamanho: {
            width: 20,
            height: 14,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 106.5,
            y: 30,
        },
        tamanho: {
            width: 20,
            height: 4,
        },
        color: cor1,
        element: null,
    },
];
const elementosFuncionais = [
    portal,
]

elementosFuncionais[0].position.x = 144;
elementosFuncionais[0].position.y = 14;


export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};