const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");
const divHeading = document.querySelector("#heading");
const alertaDiv = document.querySelector("#alerta");



const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarAlerta("Agrega un término de búsqueda");
    return;
  }

  buscarImagenes();
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (!existeAlerta) {
    const alerta = document.createElement("P");

    alerta.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">${mensaje}</span>
            `;

    alertaDiv.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function buscarImagenes() {
  const termino = document.querySelector("#termino").value;

  const key = "27765604-3ac229706030bfff75d97cc25";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual} `;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes(resultado.hits);
      refreshFsLightbox();
    });
}
// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}
function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registroPorPagina));
}
function mostrarImagenes(imagenes) {
  if (!imagenes.length) {
    mostrarAlerta("No hay resultado de la búsqueda");
  } else {
    while (resultado.firstChild) {
      resultado.removeChild(resultado.firstChild);
    }
    headingResultado();
    // Iterar sobre el arreglo de imagenes y contruir el HTML
    imagenes.forEach((imagen) => {
      const { webformatURL, likes, views, largeImageURL } = imagen;

      resultado.innerHTML += `

        
        <div class="rounded overflow-hidden flex flex-col">
        
        <a data-fslightbox href="${largeImageURL}">
                    <div class="relative">
                    
                        <img  loading="lazy" class="w-full h-52" data-fslightbox src="${webformatURL}">
                            
                        <div
                            class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                        </div>
                    </div>
                    </a>
                    <div class="relative px-6 py-1 mx-auto flex  flex-row items-center justify-between bg-white w-3/4 -mt-4">
                    <span class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                        <span class="ml-1 font-sans">${views}</span></span>
            
                    <span class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 stroke-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
                        <span class="ml-1 font-sans">${likes}</span></span>
                </div>
            </div>
        `;
    });
  }

  // Limpiar el paginador previo
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  // Generamos el nuevo hTML
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    // Caso contrario genera un botón por cada elemento en el generador
    const boton = document.createElement("A");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-indigo-400",
      "text-white",
      "px-4",
      "py-1",
      "mr-2",
      "mb-4",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;

      buscarImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
}

function headingResultado() {
  while (divHeading.firstChild) {
    divHeading.removeChild(divHeading.firstChild);
  }

  const terminoBusqueda = document.querySelector("#termino").value;
  const icon = document.createElement("IMG");
  icon.src = "img/photo.svg";
  icon.classList.add("mr-2", "w-8", "h-8");

  const heading = document.createElement("H2");
  heading.classList.add(
    "font-semibold",
    "inline-block",
    "border-b-2",
    "text-rose-800",
    "uppercase",
    "border-rose-800"
  );
  heading.innerHTML = `Imágenes: ${terminoBusqueda}`;

  divHeading.appendChild(icon);
  divHeading.appendChild(heading);
}

