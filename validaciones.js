// ---------- "Base de datos" simulada ----------

const getDB = () => JSON.parse(localStorage.getItem("codigosRegistrados") || "[]");
const setDB = (arr) => localStorage.setItem("codigosRegistrados", JSON.stringify(arr));

// Pre-cargar solo la primera vez
if (!localStorage.getItem("codigosRegistrados")) {
  setDB(["PROD01K", "ABC123", "SET100"]);
}

// Opciones de BD simuladas
const bodegasDB = {
  "bodega-1": ["Sucursal 1A", "Sucursal 1B"],
  "bodega-2": ["Sucursal 2A", "Sucursal 2B"],
  "bodega-3": ["Sucursal 3A", "Sucursal 3B"]
};

const monedasDB = ["Peso", "Dólar", "Euro"];

// ------------ Inicialización --------------------

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("form-producto");

const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputDescripcion = document.getElementById("descripcion");

const checkMateriales = document.querySelectorAll("input[name='material']");
const selectBodega = document.getElementById("bodega");
const selectSucursal = document.getElementById("sucursal");
const selectMoneda = document.getElementById("moneda");

// ------------ Cargar opciones dinamicas --------------------

//Bodega
selectBodega.innerHTML = `<option value="">-- Seleccione una bodega --</option>`;
    for (let bodega in bodegasDB) {
        const opt = document.createElement("option");
        opt.value = bodega;
        opt.textContent = bodega.replace("-", " ").toUpperCase();
        selectBodega.appendChild(opt);
        }

// Moneda
selectMoneda.innerHTML = `<option value="">-- Seleccione una moneda --</option>`;
monedasDB.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.toLowerCase();
    opt.textContent = m;
    selectMoneda.appendChild(opt);
    });

// Dependencia Bodega → Sucursal
selectBodega.addEventListener("change", () => {
    selectSucursal.innerHTML = `<option value="">-- Seleccione una sucursal --</option>`;
    if (selectBodega.value && bodegasDB[selectBodega.value]) {
      bodegasDB[selectBodega.value].forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.toLowerCase().replace(" ", "-");
        opt.textContent = s;
        selectSucursal.appendChild(opt);
      });
    }
  });

// ------------ Validaciones --------------------

form.addEventListener("submit", (e) => {
    e.preventDefault();

const codigo = inputCodigo.value.trim();
const nombre = inputNombre.value.trim();
const precio = inputPrecio.value.trim();
const descripcion = inputDescripcion.value.trim();

const db = getDB();

//Validacion de codigo
    if(codigo === "") {
        alert("El código del producto no puede estar en blanco");
        return;
    }

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!regex.test(codigo)) {
        alert ("El código del producto debe contener letras y números, sin otros caracteres.");
        return;
    }

    if (codigo.length < 5 || codigo.length > 15) {
    alert("El código del producto debe tener entre 5 y 15 caracteres.");
    return;
    }

//Validacion de nombre
    if(nombre === "") {
        alert("El nombre del producto no puede estar en blanco");
        return;
    }

    if (nombre.length < 2 || nombre.length > 50) {
        alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
        return;
    }

//Validacion de precio
    if(precio === "") {
        alert("El precio del producto no puede estar en blanco");
        return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(precio) || Number(precio) <= 0) {
        alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
        return;
    }

//Validacion de material
    const seleccionados = Array.from(checkMateriales).filter(chk => chk.checked);
    if (seleccionados.length < 2) {
      alert("Debe seleccionar al menos dos materiales para el producto.");
      return;
    }

//Validacion de bodega
    if (selectBodega.value === "") {
      alert("Debe seleccionar una bodega.");
      return;
    }

//Validacion de sucursal
    if (selectSucursal.value === "") {
      alert("Debe seleccionar una sucursal para la bodega seleccionada.");
      return;
    }

//Validacion de moneda
    if (selectMoneda.value === "") {
      alert("Debe seleccionar una moneda para el producto.");
      return;
    }

//Validacion de descripción
    if (descripcion === "") {
      alert("La descripción del producto no puede estar en blanco.");
      return;
    }
    if (descripcion.length < 10 || descripcion.length > 1000) {
      alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
      return;
    }

// Enviar al servidor si todo esta bien
    const formdata = new FormData(form);

    fetch("procesar.php", {
        method: "POST",
        body: formdata
    })

    .then(res => res.text())
    .then(respuesta => {
        if (respuesta === "OK") {
            alert("Producto guardado correctamente.");
            db.push(codigo);
            setDB(db);
            form.reset();
        } else {
            alert("Error en el servidor: " + respuesta);
        }
    })

    .catch(err => {
        console.error("Error de red: ", err);
        alert("No se pudo conectar con el servidor.");
    });

});
});