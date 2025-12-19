"use strict";
let products = [];
const cart = [];
let total = 0;
const productsContainer = document.getElementById('product-list');


const getProductsByCategory = (productsFiltered) => {
    let html = ``;
    productsFiltered.forEach(product => {

        let offerText = '';
        if (product.offer) {
            offerText = `<div class="badge bg-warning position-absolute w-100"> ${product.offer.percent}% off buying ${product.offer.number} </div>`;
        }

        if (!product.image) {
            product.image = './images/product.svg';
        }

        html += `<div class="col mb-5">
            <article class="card product-card h-100 shadow border-primary border-opacity-25">
                ${offerText}
                <img class="card-img-top p-4" src="${product.image}" alt="${product.name} product image" loading="lazy" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h3 class="h5 fw-bolder text-capitalize">${product.name}</h3>
                        <p class="price">$${product.price}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="row text-center">
                        <button type="button" class="btn btn-sm btn-primary add-to-cart text-white" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">
                            Add to cart
                        </button>
                    </div>
                </div>
            </article>
        </div>`;
    });
    return html;
}

async function loadProducts() {
    const response = await fetch('db/products.json');
    products = await response.json();

    let categories = await products.map(product => product.type);
    categories = [...new Set(categories)]
    
    let html = '';
    categories.forEach(category => {

        let productsFiltered = products.filter(product => product.type === category);

        html += `<article class="product-section pt-5" id="${category}">
            <h2 class="text-center text-teal text-capitalize">
                <i class="fas fa-shopping-basket pe-3 text-primary" aria-hidden="true"></i>
                <span>${category}</span>
            </h2>
            <div class="container px-4 px-lg-5 mt-5">
                <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                ${getProductsByCategory(productsFiltered)}
                </div>
            </div>
        </article>`;

    })

    productsContainer.innerHTML = html;

}

const buy = (id) => {
    const product = products.find(element => element.id == id)
    const newItem = {...product}

    let cartProduct = cart.find(element => element.id == id)
    if (cartProduct) {
        cartProduct.quantity++
    } else {
        newItem.quantity = 1
        cart.push(newItem)
    }

    updateCartBadge();
}

const cleanCart = () =>  {
    cart.length = 0;
    total = 0;
    printCart();
}


const calculateTotal = () =>  {
    // Calculate total price of the cart using the "cartList" array
    total = cart.reduce((total, item) => total + item.subtotalWithDiscount, 0).toFixed(2)
}

const applyPromotionsCart = () =>  {
    // Apply promotions to each item in the array "cart"
    cart.forEach(element => {
        let subtotalWithDiscount = element.quantity * element.price
        
        if (element.offer) {
            element.itemsRequired = element.offer.number - element.quantity
        }

        if (element.offer && element.quantity >= element.offer.number) {
            subtotalWithDiscount = element.quantity * (element.price * ((100 - element.offer.percent) /100))
        }

        element.subtotalWithDiscount = subtotalWithDiscount
    });
}

const increaseQuantity = (id) => {
    buy(id)
    printCart()
}

const removeFromCart = (id) => {
    let item = cart.find(element => element.id == id)

    if (item.quantity == 1) {
        let index = cart.findIndex(element => element.id == id)
        cart.splice(index, 1)
    } else {
        item.quantity--
    }

    printCart()
}

const updateCartBadge = () => {
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    document.getElementById('count_product').innerText = totalItems
}

const printCart = () => {
    // Fill the shopping cart modal manipulating the shopping cart dom

    let html = ''

    if (cart.length > 0) {

        applyPromotionsCart();
        calculateTotal();

        html = `<thead><tr class="align-middle">
            <th class="col-4"></th>
            <th class="text-center col">Price</th>
            <th class="text-center col-2">Quantity</th>
            <th class="text-center col">Total</th>
        </tr>
        </thead>
        <tbody>`;

        cart.forEach(element => {
            let discount = '';
            if (element.itemsRequired <= 0) {
                let percent = element.offer.percent
                discount = `<tr><td> <span class="badge bg-success mb-3">${percent}% Discount</span> </td></tr>`
            }
            if (element.itemsRequired > 0) {
                discount = `<tr><td> <span class="badge bg-info mb-3">${element.itemsRequired} more for discount</span> </td></tr>`
            }

            html += `<tr class="align-middle">
                <th scope="row">${element.name}</th>
                <td class="text-center">$${element.price}</td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm text-center" role="group" aria-label="Small button group">
                        <button type="button" class="btn btn-outline-primary d-flex align-items-center justify-content-center" onclick="removeFromCart(${element.id})"><i class="fa-solid fa-minus"></i></button>
                        <button type="button" class="btn btn-outline-primary d-flex align-items-center justify-content-center">${element.quantity}</button>
                        <button type="button" class="btn btn-outline-primary d-flex align-items-center justify-content-center" onclick="increaseQuantity(${element.id})"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
                <td class="text-center">$${element.subtotalWithDiscount.toFixed(2)}</td>
            </tr>${discount}`
        });

        html += '</tbody>';

        document.getElementById('total_div').classList.remove('d-none')
        document.getElementById('checkout-btn').classList.remove('d-none')
        document.getElementById('clean-cart').classList.remove('d-none')
    } else {

        html = '<tr><th class="text-center">Add products to your shoping cart</th></tr>'
        document.getElementById('total_div').classList.add('d-none')
        document.getElementById('checkout-btn').classList.add('d-none')
        document.getElementById('clean-cart').classList.add('d-none')
        showProductsPage()
    }

    document.getElementById('cart_list').innerHTML = html;
    document.getElementById('total_price').innerHTML = total;
    updateCartBadge()
}

const showProductsPage = () => {
    document.getElementById('checkout-page').classList.add('d-none')
    document.getElementById('product-page').classList.remove('d-none')
}

const showCheckoutPage = () => {
    document.getElementById('form-checkout').reset()
    document.getElementById('checkout-page').classList.remove('d-none')
    document.getElementById('product-page').classList.add('d-none')
}

function initShop() {

    const addToCartButtons = document.getElementsByClassName('add-to-cart')
    for (let i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', () => {
            buy(addToCartButtons[i].getAttribute('data-product-id'))
        })
    }

    document.getElementById('cartModal').addEventListener('show.bs.modal', printCart);
    document.getElementById('clean-cart').addEventListener('click', cleanCart);
    document.getElementById('checkout-btn').addEventListener('click', showCheckoutPage);

    const navLinks = document.getElementsByClassName('nav-link')
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', showProductsPage);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  initShop();
});



