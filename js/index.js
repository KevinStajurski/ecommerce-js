//Arreglos
const carrito = JSON.parse(localStorage.getItem("carrito")) ?? []//Consulta del carrito en el local storage, si no existe lo crea vacio
//Funcion que muestra un cartel emergente indicando que el producto se agrego al carrito
function cartelAgregadoAlCarrito() {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, black, gray)",
        },
    }).showToast()
}
//Funcion que muestra un cartel emergente indicando que no hay mas stock disponible
function cartelNoHayMasStock(){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay mas stock disponible!',
    })
}
//Api de productos
fetch (`https://63127002b466aa9b038a2690.mockapi.io/productos`)
.then (respuesta => respuesta.json())
.then (data => {
    //Carga los productos en el HTML
    data.forEach ((elemento) => {
        divProductos.innerHTML += `
        <div class="card cardProducto">
            <img src="${elemento.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <p class="card-text">Marca: ${elemento.marca}</p>
                <p class="card-text">Modelo: ${elemento.modelo}</p>
                <p class="card-text">Precio: $ ${elemento.precio}</p>
                <p class="card-text">ID: ${elemento.id}</p>
                <p class="card-text">Stock: ${elemento.stock}</p>
                <button type="button" class="btn btn-primary" id="btnAgregar${elemento.id}">Agregar al carrito</button>
            </div>
        </div>
    `})
    //Eventos de los botones "Agregar al carrito"
    data.forEach ((elemento) => {
        const btnAgregar = document.getElementById (`btnAgregar${elemento.id}`)
        if (elemento.stock==0){//Si no hay stock desactiva el boton de agregar al carrito
            btnAgregar.disabled=true
            btnAgregar.innerHTML = `Sin stock`
        }
        btnAgregar.addEventListener(`click`, () => {
            const ids = (element) => element.id == elemento.id//Función de prueba para findIndex que busca el elemento que cumpla con el id
            const indice = carrito.findIndex(ids)//Guarda el indice del elemento que tenga el id buscado
            if (indice >= 0) {//Si el indice es mayor o igual a 0 ya hay un producto de este tipo en el carrito
                if (elemento.stock > carrito[indice].agregados) {//"agregados" es la cantidad del mismo producto en carrito
                    carrito[indice].agregados++
                    cartelAgregadoAlCarrito()
                } else {
                    cartelNoHayMasStock()
                }
            } else {//Si entra acá es porque no habia un producto de este tipo em el carrito
                carrito.push(elemento)
                cartelAgregadoAlCarrito()
            }
            localStorage.setItem(`carrito`,JSON.stringify(carrito))//Actualiza el arreglo de productos en el local storage
        })
    })
})