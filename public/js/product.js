const productImages = document.querySelectorAll(".product-images img");
const productImageSlide = document.querySelector('.image-slider');

let activeImageSlide = 0; // default slider image

productImages.forEach((item, i) => { //looping through each button
    item.addEventListener('click', () => { //adding click event to each
        productImages[activeImageSlide].classList.remove('active'); //removing check class from
        item.classList.add('active'); // adding check class to clicked buttons
        productImageSlide.style.backgroundImage = `url('${item.src}')`; // updating the variable
        activeImageSlide = i; // updating the image slider variable to track current
    })
})

// toggle size buttons

const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0; // current selected button
let size;

sizeBtns.forEach((item, i) => { // looping through each button
    item.addEventListener('click', () => { // adding click event to each
        sizeBtns[checkedBtn].classList.remove('check'); //removing check class
        item.classList.add('check'); // adding check class to clicked button
        checkedBtn = i; // updating the variable
        size = item.innerHTML;
    })
})

const setData = (data) => {
    let title = document.querySelector('title');

    // setup the images 
    productImages.forEach((img, i) => {
        if(data.images[i]){
            img.src = data.images[i];
        } else {
            img.style.display = 'none';
        }
    })
    productImages[0].click();

    // setup size buttons
    sizeBtns.forEach(item => {
        if(!data.sizes.includes(item.innerHTML)){
            item.style.display = 'none';
        }
    })

    //setting up texts
    const name = document.querySelector('.product-brand');
    const shortDes = document.querySelector('.product-short-des');
    const des = document.querySelector('.des');

    title.innerHTML += name.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    des.innerHTML = data.des;

    //pricing
    const sellPrice = document.querySelector('.product-price');
    const actualPrice = document.querySelector('.product-actual-price');
    const discount = document.querySelector('.product-discount');

    sellPrice.innerHTML = `$${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.actualPrice}`;
    discount.innerHTML = `( ${data.discount} % off )`;

    // wishlist and cart btn
    const wishlistBtn = document.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', () => {
        wishlistBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist', data);
    })

    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.addEventListener('click', () => {
        cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart', data);
    })
}

//fetch data
const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({id: productId})
    })
    .then(res => res.json())
    .then(data => {
        setData(data);
        getProducts(data.tags[0]).then(data => createProductSlider(data, '.container-for-card-slider', 'similar products'));
    })
    .catch(err => {
        location.replace('/404');
    })

}

let productId = null;
if(location.pathname != '/products'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}