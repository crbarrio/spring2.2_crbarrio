# ShopNow - Online Shopping

A modern, responsive e-commerce frontend application for shopping grocery, beauty, and clothing products.

## Live Demo

🔗 [View Live Demo](https://it-springs.crbarrio.es/assets/demos/spring2_2/)

## Features

- **Product Catalog**: Browse products organized by categories (Grocery, Beauty, Clothes)
- **Shopping Cart**: Add products to cart with real-time updates
- **Special Offers**: Displays discount offers for bulk purchases
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Checkout System**: Complete checkout flow with order summary
- **Accessibility**: ARIA labels, skip navigation, and semantic HTML

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3/SCSS**: Custom styling with Bootstrap integration
- **JavaScript (ES6+)**: Vanilla JavaScript for dynamic functionality
- **Bootstrap 5.3.8**: Responsive UI framework
- **Font Awesome 6.4.0**: Icon library

## Project Structure

```
starter-code-frontend-shop/
├── index.html              # Main HTML page
├── package.json            # Project dependencies
├── css/
│   └── main.css           # Compiled CSS styles
├── db/
│   └── products.json      # Product database
├── images/                # Product and UI images
├── js/
│   ├── bootstrap.bundle.min.js
│   ├── checkout.js        # Checkout functionality
│   └── shop.js            # Shop and cart logic
└── scss/
    └── main.scss          # SCSS source files
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/crbarrio/spring2.2_crbarrio.git
cd starter-code-frontend-shop
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development

Simply open `index.html` in your web browser, or use a local development server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

Then navigate to `http://localhost:8000` (or the appropriate port).

### Building SCSS

If you make changes to the SCSS files, compile them to CSS:

```bash
# Using Sass compiler
sass scss/main.scss css/main.css
```

## Product Data Structure

Products are stored in `db/products.json` with the following structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 10.5,
  "type": "grocery|beauty|clothes",
  "image": "path/to/image.jpg",
  "offer": {
    "number": 3,
    "percent": 20
  }
}
```

- `offer` field is optional and represents bulk purchase discounts

## Features in Detail

### Shopping Cart
- Add/remove products
- Real-time price calculation
- Cart badge counter
- Modal-based cart view

### Product Categories
- Dynamic filtering by category
- Visual category navigation
- Product cards with images and prices

### Checkout
- Order summary
- Total price calculation with offers applied
- Form validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

Carlos Ramirez

## License

This project is part of IT Academy specialization coursework.
