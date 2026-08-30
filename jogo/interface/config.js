export function exportar(){
    const tela = document.body;
    const config = document.createElement('img');
    const setupConfig = {
        position: {
            x: 2,
            y: 2
        },
        tamanho: {
            width: 3,
            height: 3
        },
        src: './Assets/img-ico/iconeEngrenagem.png',
    };

    {
        config.src = setupConfig.src;
        config.style.position = 'absolute';

        config.style.width = setupConfig.tamanho.width + 'em';
        config.style.height = setupConfig.tamanho.height + 'em';

        config.style.top = setupConfig.position.y + 'em';
        config.style.left = setupConfig.position.x + 'em';

        implantar(config)
    };

    const menuConfig = document.createElement('main');
    {
        menuConfig.style.width = '80%';
        menuConfig.style.height = '80%';

        menuConfig.style.position = 'absolute';

        menuConfig.style.marginRight = '10%';
        menuConfig.style.marginLeft = '10%';

        menuConfig.style.display = 'none';
        menuConfig.style.border = '1px solid black';

        menuConfig.classList.add('menu')

        implantar(menuConfig)
    }
    async function inserçãoConfig() {
        const resposta = await fetch("./interface/config.html")
        const htmlMenuConfig = await resposta.text();
        menuConfig.innerHTML = htmlMenuConfig
    }inserçãoConfig();


    const faceInterna = {
        menuConfig: menuConfig,
    };

    //injetor de elementos
    function implantar(item){
        tela.appendChild(item)
    }

    function fechar(){
        faceInterna.menuConfig.style.display = 'none';
        config.style.display = 'block'
    }

    document.querySelectorAll('.fechar').forEach((element)=>{
        element.addEventListener('click', ()=>fechar())
    })
    config.addEventListener('click', ()=>{
        faceInterna.menuConfig.style.display = 'flex';
        config.style.display = 'none';
    })
    config.addEventListener('pointerenter', ()=>{
        config.style.scale = '1.2';
        config.style.cursor = 'pointer';
    })
    config.addEventListener('pointerout', ()=>{config.style.scale = '1'})
};