"use strict";
let products = [];
const cart = [];
let total = 0;

async function loadProducts() {
    const response = await fetch('db/products.json');
    products = await response.json();
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
        let isDiscounted = false
        if (element.offer && element.quantity >= element.offer.number) {
            subtotalWithDiscount = element.quantity * (element.price * ((100 - element.offer.percent) /100))
            isDiscounted = true
        } 
        element.subtotalWithDiscount = subtotalWithDiscount
        element.isDiscounted = isDiscounted
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
            <th class="text-center  col-2">Price</th>
            <th class="text-center col-2">Quantity</th>
            <th class="text-center  col-2">Total</th>
            <th class="text-end col-2"></th>
        </tr>
        </thead>
        <tbody>`;

        cart.forEach(element => {
            let discount = '';
            if (element.isDiscounted) {
                let percent = element.offer.percent
                discount = ` <span class="badge bg-success">${percent}% Discount</span>`
            }

            html += `<tr class="align-middle">
                <th scope="row">${element.name}</th>
                <td class="text-center">$${element.price}</td>
                <td class="text-center"><a href="#" onclick="removeFromCart(${element.id})"> <i class="fa-solid fa-minus me-2 text-danger"></i></a> ${element.quantity} <a href="#" onclick="increaseQuantity(${element.id})"> <i class="fa-solid fa-plus ms-2 text-success"></i></a></td>
                <td class="text-center">$${element.subtotalWithDiscount.toFixed(2)}</td>
                <td class="text-end">${discount}</td>
            </tr>`
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



