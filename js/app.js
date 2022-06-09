const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const divHeading = document.querySelector('#heading');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
    
    
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {

        const alerta = document.createElement('P');
    
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">${mensaje}</span>
            `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes() {
    headingResultado();
    const termino = document.querySelector('#termino').value;
    
    const key = '27765604-3ac229706030bfff75d97cc25';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual} `;

    fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => {
                totalPaginas = calcularPaginas(resultado.totalHits);
                mostrarImagenes(resultado.hits); 
                refreshFsLightbox();
            })
    
}
// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function *crearPaginador(total) {
    for(let i = 1; i <= total; i++){
        yield i;
    }
}
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registroPorPagina));
}
function mostrarImagenes(imagenes) {
    
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y contruir el HTML
    imagenes.forEach( imagen => {
        
        const { webformatURL, likes, views, largeImageURL } = imagen;
        

        resultado.innerHTML += `

        
        <div class="rounded overflow-hidden shadow-lg flex flex-col">
        
        <a data-fslightbox href="${largeImageURL}">
                    <div class="card-img relative">
                    
                        <img  loading="lazy" class="w-full" data-fslightbox src="${webformatURL}">
                            
                        <div
                            class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                        </div>
                    </div>
                    </a>
                <div class="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                    <span href="#" class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                        <img loading="lazy" class="icon" src="img/views.svg">
                        <span class="ml-1">${views}</span></span>

                    <span href="#" class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                        <img loading="lazy" class="icon" src="img/like.svg">
                        <span class="ml-1">${likes}</span></span>
                </div>
            </div>
        `;
        
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    // Generamos el nuevo hTML
    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    
    while(true){
        const { value, done } = iterador.next();
        if(done) return;

        // Caso contrario genera un botón por cada elemento en el generador
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-indigo-400', 'text-white', 'px-4', 'py-1', 'mr-2', 'mb-4', 'rounded');


        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}

function headingResultado() {
    while(divHeading.firstChild){
        divHeading.removeChild(divHeading.firstChild);
    }
    
    const terminoBusqueda = document.querySelector('#termino').value;
    const icon = document.createElement('IMG');
    icon.src = 'img/photo.svg';
    icon.classList.add('title-photo', 'mr-2');

    const heading = document.createElement('H2');
    heading.classList.add('font-semibold', 'inline-block','border-b-2','border-indigo-600');
    heading.innerHTML = `Imagenes: ${terminoBusqueda}`;
   
    divHeading.appendChild(icon);
    divHeading.appendChild(heading);  
}
