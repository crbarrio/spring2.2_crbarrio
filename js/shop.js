// If you have time, you can move this variable "products" to a json or js file and load the data in this js. It will look more professional
const products = [
    {
        id: 1,
        name: 'cooking oil',
        price: 10.5,
        type: 'grocery',
        offer: {
            number: 3,
            percent: 20
        }
    },
    {
        id: 2,
        name: 'Pasta',
        price: 6.25,
        type: 'grocery'
    },
    {
        id: 3,
        name: 'Instant cupcake mixture',
        price: 5,
        type: 'grocery',
        offer: {
            number: 10,
            percent: 30
        }
    },
    {
        id: 4,
        name: 'All-in-one',
        price: 260,
        type: 'beauty'
    },
    {
        id: 5,
        name: 'Zero Make-up Kit',
        price: 20.5,
        type: 'beauty'
    },
    {
        id: 6,
        name: 'Lip Tints',
        price: 12.75,
        type: 'beauty'
    },
    {
        id: 7,
        name: 'Lawn Dress',
        price: 15,
        type: 'clothes'
    },
    {
        id: 8,
        name: 'Lawn-Chiffon Combo',
        price: 19.99,
        type: 'clothes'
    },
    {
        id: 9,
        name: 'Toddler Frock',
        price: 9.99,
        type: 'clothes'
    }
]

// => Reminder, it's extremely important that you debug your code. 
// ** It will save you a lot of time and frustration!
// ** You'll understand the code better than with console.log(), and you'll also find errors faster. 
// ** Don't hesitate to seek help from your peers or your mentor if you still struggle with debugging.

// Improved version of cartList. Cart is an array of products (objects), but each one has a quantity field to define its quantity, so these products are not repeated.
const cart = [];

let total = 0;

// Exercise 1
const buy = (id) => {
    // 1. Loop for to the array products to get the item to add to cart
    const product = products.find(element => element.id == id)
    let newItem = {...product}

    // 2. Add found product to the cart array
    let cartProduct = cart.find(element => element.id == id)
    if (cartProduct) {
        cartProduct.quantity++
    } else {
        newItem.quantity = 1
        cart.push(newItem)
    }

    updateCartBadge();
}

// Exercise 2
const cleanCart = () =>  {
    cart.length = 0;
    total = 0;
    printCart();
    showProductsPage()
}

// Exercise 3
const calculateTotal = () =>  {
    // Calculate total price of the cart using the "cartList" array
    total = cart.reduce((total, item) => total + item.subtotalWithDiscount, 0).toFixed(2)
}

// Exercise 4
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

// Exercise 5
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
    }

    document.getElementById('cart_list').innerHTML = html;
    document.getElementById('total_price').innerHTML = total;
    updateCartBadge()
}


// ** Nivell II **

// Exercise 7
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

const open_modal = () =>  {
    printCart();
}


// Extra

const updateCartBadge = () => {
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    document.getElementById('count_product').innerText = totalItems
}


// Event Listeners

const showProductsPage = () => {
    document.getElementById('checkout-page').classList.add('d-none')
    document.getElementById('product-page').classList.remove('d-none')
}

const showCheckoutPage = () => {
    document.getElementById('form-checkout').reset()
    document.getElementById('checkout-page').classList.remove('d-none')
    document.getElementById('product-page').classList.add('d-none')
}


const addToCartButtons = document.getElementsByClassName('add-to-cart')
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener('click', () => {
        buy(addToCartButtons[i].getAttribute('data-product-id'))
    })
}


document.getElementById('cartModal').addEventListener('show.bs.modal', () => {
    printCart()
})


document.getElementById('clean-cart').addEventListener('click', () => {
    cleanCart()
})

document.getElementById('checkout-btn').addEventListener('click', () => {
    showCheckoutPage()
})

const navLinks = document.getElementsByClassName('nav-link')
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', () => {
        showProductsPage()
    })
}