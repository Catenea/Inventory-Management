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
    data.forEach(doc => {
      if (doc.get("active") == true) {
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
    guideList.innerHTML = html
  } else {
    guideList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
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