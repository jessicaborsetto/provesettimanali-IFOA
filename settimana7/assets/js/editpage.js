const url= "https://striveschool-api.herokuapp.com/api/product/"
const token= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc0N2ZhODJjNmEwZDAwMTg0OTVmNmIiLCJpYXQiOjE3MDIzNzM0NzIsImV4cCI6MTcwMzU4MzA3Mn0.GNRVyRZO8sOoKcWkzoz7kYIcGr2pV16SChAmfealR14"
const headers = {
    "Authorization": token,
    "Accept": "application/json",
    "Content-Type": "application/json"
}

let products = [];
let editingProductId = null; 

const getProducts = async () => {
    try {
        const response = await fetch(url, {
            headers: headers
        });
        if (!response.ok) {
            throw new Error("la risposta al server non è andata a buon fine");
        }
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error("c'è un problema con l'operazione fetch", error);
    }
};

const displayProducts = () => {
    const productList = document.getElementById("productList");
    productList.classList.add('productList')
    productList.innerHTML = "";

    products.forEach(el => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <input type="checkbox" id="${el._id}" value="${el._id}">
            <label for="${el._id}">${el.name} - $${el.price}</label>
        `;

        const editBtn = document.createElement("button");
        editBtn.classList.add('editBtn', 'btn', 'btn-warning', 'col-2')
        editBtn.setAttribute('onclick', `editProduct('${el._id}')`);
        editBtn.innerText = 'Modifica';

        productList.appendChild(listItem);
        listItem.appendChild(editBtn);
    });
};

// Gestire modifica
const editProduct = (elId) => {
    editingProductId = elId;
    const productToEdit = products.find(product => product._id === elId);
    document.getElementById("name").value = productToEdit.name;
    document.getElementById("description").value = productToEdit.description;
    document.getElementById("price").value = productToEdit.price;
    document.getElementById("imageUrl").value = productToEdit.imageUrl;
    document.getElementById("brand").value = productToEdit.brand;
};

// Annullare modifica
const deleteEdit = () => {
    editingProductId = null;
    resetForm();
};

const addOrUpdateProduct = async () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const brand = document.getElementById("brand").value;

    const newProduct = {
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
        brand: brand
    };

    try {
        let response;
        if (editingProductId) {
            response = await fetch(url + editingProductId, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(newProduct)
            });
        } else {
            response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(newProduct)
            });
        }

        if (!response.ok) {
            throw new Error("La risposta al server non è andata a buon fine ;( riprova più tardi");
        }

        const updatedProduct = await response.json();

        if (editingProductId) {
            const index = products.findIndex(product => product._id === editingProductId);
            products[index] = updatedProduct;
        } else {
            products.push(updatedProduct); // Aggiunta del nuovo elemento
        }

        displayProducts(); // Aggiornamento dell'interfaccia
        resetForm();
    } catch (error) {
        console.error("Compila tutti i campi per favore", error);
    }
};


const resetEdit = () => {
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("imageUrl").value = "";
    document.getElementById("brand").value = "";
};

const deleteSelectedProducts = async () => {
    const selectedProducts = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    if (selectedProducts.length === 0) {
        alert("seleziona il prodotto da eliminare");
        return;
    }

    try {
        const promises = selectedProducts.map(productId => {
            return fetch(url + productId, {
                method: "DELETE",
                headers: headers
            });
        });
        await Promise.all(promises);
        getProducts();
    } catch (error) {
        console.error("c'è un problema con l'eliminazione del prodotto", error);
    }
};

const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', goToHomePage);

function goToHomePage() {
    window.location.href = "homepage.html";
}

window.onload = () => {
    getProducts();
};