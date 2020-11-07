// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
  if (user) {
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// setup guides
const setupGuides = (data) => {

  if (data.length) {
    let html = '';
    bus1 = `
    <div class="container valign-wrapper" style="margin-top: 40px;">
    <a
          id="btnBuscar"
          onclick="ReiniciarFiltro()"
          class="waves-effect waves-light red btn-small"
          >Reiniciar Búsqueda</a
        >
        <a
        id="btnBuscar"
        onclick="Filtrar()"
        class="waves-effect waves-light green btn-small"
        >Filtrar Búsqueda</a
      >
    <form id="filtro-form" style="margin-left: 40px; width:400px;">
      <input type="text" id="busqueda" required/>
      <label for="busqueda">Buscar</label>
    </form>
    <div class="input-field col s12" style="margin-left: 40px; margin-right: 40px">
            <select class="Filtro" id="Filtro">
              <option value="" disabled selected
                >Filtro</option
              >
              <option value="name">Nombre</option>
              <option value="cost">Costo</option>
              <option value="price">Precio</option>
            </select>
            <label>Filtrar por</label>
          </div>
          
    </div>
  `;

    data.forEach(doc => {
      if (doc.get("active") == true && doc.get("Filtro") == "Dentro") {
      const item = doc.data();
      var gan = item.price - item.cost
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${item.name} </div>
          <div class="collapsible-body white"> 
          Descripción:  ${item.description} <br>
          Costo:  ${item.cost} <br>
          Precio de Venta:  ${item.price} <br>
          Cantidad:  ${item.quantity} <br>
          Ganancia por Unidad:  ${gan} <br>
          Ganancia total:  ${gan * item.quantity} <br>
          <a id="btnAct${item.name}" onclick="ActItem('${item.name}')" class="waves-effect waves-light btn"
          >Actualizar</a><br><br>
          <a id="btnElim${item.name}" onclick="ElimItem('${item.name}')" class="red darken-4 btn"
          >Eliminar</a><br>
          </div>
        </li>
        
      `;
      html += li;
      }
    });
    guideList.innerHTML = bus1 + html
    const filtro = document.getElementById("Filtro");
    var instances = M.FormSelect.init(filtro, {});
  } else {
    guideList.innerHTML = '<h5 class="center-align">Inicie sesión para ver los items</h5>';
  }
  

};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

//ACt Items

var ItemName = "";

function ActItem(name) {
  ItemName = name;
  const modal = document.querySelector("#modal-act-item");
  M.Modal.getInstance(modal).open();
}

const Items = db.collection("items");
const ActItemForm = document.querySelector("#act-item-form");

ActItemForm.addEventListener("submit", e => {
  e.preventDefault();

  var doc_item = Items.where("name", "==", ItemName.toString());
  doc_item
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
        // Contents of first document
        querySnapshot.forEach(function(doc) {
          if (ActItemForm["name"].value.length != 0) {
            doc.ref.update({
              name: ActItemForm["name"].value
            });
          }
          if (ActItemForm["description"].value.length != 0) {
            doc.ref.update({
              description: ActItemForm["description"].value
            });
          }
          if (ActItemForm["cost"].value.length != 0) {
            doc.ref.update({
              cost: ActItemForm["cost"].value
            });
          }
          if (ActItemForm["price"].value.length != 0) {
            doc.ref.update({
              price: ActItemForm["price"].value
            });
          }
          if (ActItemForm["quantity"].value.length != 0) {
            doc.ref.update({
              quantity: ActItemForm["quantity"].value
            });
          }
        });
      } else {
        console.log("No such document!");
      }
    })
    .then(() => {
      const modal = document.querySelector("#modal-act-item");
      M.Modal.getInstance(modal).close();
      ActItemForm.reset();
    });
});

//Delete Items

function ElimItem(name) {
  var item_query = Items.where("name", "==", name.toString());
  item_query.get().then(function(querySnapshot) {
    if (querySnapshot.size > 0) {
      querySnapshot.forEach(function(doc) {
        Items.doc(doc.id).update({ active: false });
      });
    } else {
      console.log("No such document!");
    }
  });
}

//FILTROS

function Filtrar() {
  const FiltroForm = document.querySelector("#filtro-form");

  var selectFiltro = document.getElementById("Filtro");
  var instances = M.FormSelect.init(selectFiltro);
  var seleccionadoSec = instances.getSelectedValues();
  console.log(seleccionadoSec);
  var filtro = seleccionadoSec[0].toString();

  console.log("items");
  console.log(filtro);
  console.log(FiltroForm["busqueda"].value.toString());

  var doc_filtrar = db
    .collection("items")
    .where(filtro, "!=", FiltroForm["busqueda"].value.toString());
  doc_filtrar
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
        // Contents of first document
        querySnapshot.forEach(function(doc) {
          db.collection("items")
            .doc(doc.id)
            .update({ Filtro: "Fuera" });
        });
      } else {
        console.log("No such document!");
      }
    })
    .then(function() {
      console.log("Ya");
    });

  var doc_filtrar2 = db
    .collection("items")
    .where(filtro, ">", FiltroForm["busqueda"].value.toString());
  doc_filtrar2
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
        // Contents of first document
        querySnapshot.forEach(function(doc) {
          db.collection("items")
            .doc(doc.id)
            .update({ Filtro: "Fuera" });
        });
      } else {
        console.log("No such document!");
      }
    })
    .then(function() {
      console.log("Ya");
    });
}

function ReiniciarFiltro() {
  var doc_rei = db.collection("items").where("Filtro", "==", "Fuera");
  doc_rei
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
       
        // Contents of first document
        querySnapshot.forEach(function(doc) {
          console.log(doc.data());
          db.collection("items")
            .doc(doc.id)
            .update({ Filtro: "Dentro" });
        });
      } else {
        console.log("No such document!");
      }
    })
    .then(function() {
      console.log("Filtro reiniciado!");
    });
}