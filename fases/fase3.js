import { portal } from "../objetos.js";

const cor1 = 'rgba(208, 226, 210, 0.66)';
const cor2 = 'white';
const cor4 = 'red';
const cor3 = 'rgb(150,3,70)';

const player = {
    position:{
        x: 1,
        y: 30,
    },
    tamanho:{
        width: 2,
        height: 6,
    },
    fisica: {
        velocityX: 0,
        velocityY: 0,
    },
    speedY: 30,
    speedX: 10,
    element: null,
    jump: 50,
};
player.tamanho.heightPlay = player.tamanho.height

const configFase = {
    run: 15,
    gravity: 150,
    velMaxY: player.tamanho.height * 5,
    velMaxX: player.tamanho.width,
    larguraFase: 75,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
configFase.proporcao = window.innerWidth/configFase.larguraFase
configFase.height = configFase.larguraFase/1.76

const elementosDoJogo = [
    {
        position: {
            x: 0,
            y: 0,
        },
        tamanho: {
            width: 8.59,
            height: 24,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 8.55,
            y: 0,
        },
        tamanho: {
            width: 7.5,
            height: 19.5,
        },
        color: cor1,
        element: null,
    },
    {
        position: {
            x: 16.01,
            y: 0,
        },
        tamanho: {
            width: 5.6,
            height: 16,
        },
        color: cor1,
        element: null,
    },
    
];
const elementosFuncionais = [
    portal,
]

elementosFuncionais[0].position.x = 69;
elementosFuncionais[0].position.y = 16;



export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};