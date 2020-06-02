'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const cardCounter = cartBtn.querySelector('.counter');
    const wishListCounter = wishListBtn.querySelector('.counter');
    const cartWrapper = document.querySelector('.cart-wrapper');

    const wishList = [];
    const goodsInCart = {};


    // ------------------- FUNCTIONS -------------------------

    // API fetch
    const getGoods = (handler, filter) => {
        loading(handler.name); 
        fetch('db/db.json')
            .then(response => response.json()) // getting array
            .then(filter)
            .then(handler); 
    };

    
    /*--------SEARCHING BAR */

    // Searching goods by bar
    const searchGoods = (event) => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim(); // trim() - deleting all ' ' before and after string
        if (input.value.trim() !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {  
                search.classList.remove('error');
            }, 2000);
        }
        input.value = '';
    };

    /*-------end SEARCHING BAR*/


    /*---------SPINNER */
   
    // Adding spinner
    const loading = (nameOfFunct) => {
        const spinner = `<div id="spinner"><div class="spinner-loading">
                        <div><div><div></div></div><div><div></div></div>
                        <div><div></div></div><div><div></div></div></div>
                        </div></div>`;
        if (nameOfFunct === "renderCard") { 
            goodsWrapper.innerHTML = spinner;
        } 
        if (nameOfFunct === "renderCart") {
            cartWrapper.innerHTML = spinner;
        }
    };

    /*end SPINNER---------*/


    /*--------CARDS */

    // Creating card
    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${wishList.includes(id) ? 'active': ''}" 
                                    data-goods-id="${id}"></button>
                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price} ₽</div>
                                <div>
                                    <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
                                </div>
                            </div>
                        </div>`;
        return card;
    };

    // Creating cards for products
    const renderCard = (goods) => {
        goodsWrapper.textContent='';
        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                goodsWrapper.append(createCardGoods(id, title, price, imgMin));
            });    
        } else {
            //goodsWrapper.textContent='Sorry, we did not find any products';
            const text = `<table>
                        <tr align="center"><th><img width=300 src="img/tenor.gif"></th></tr>
                        <tr align="center"><th><h2 style="color:red;">Sorry, we did not find any products</th></hd></tr>
                        </table>`;
            goodsWrapper.innerHTML = text;
        }
    };

    /*end CADRS-------*/


    /*---------CART */ 

    // Creating cart
    const createCardInCart = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `<div class="goods-img-wrapper">
                                <img class="goods-img" src="${img}" alt="">
                            </div>
                            <div class="goods-description">
                                <h2 class="goods-title">${title}</h2>
                                <p class="goods-price">${price} ₽</p>
                            </div>
                            <div class="goods-price-count">
                                <div class="goods-trigger">
                                    <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : '' }" 
                                    data-goods-id="${id}"></button>
                                    <button class="goods-delete" data-goods-id="${id}"></button>
                                </div>
                                <div class="goods-count">${goodsInCart[id]}</div>
                            </div>`;
        return card;
    };

    // Creating cart for products
    const renderCart = (goods) => {
        cartWrapper.textContent = '';
        if (goods.length) {
            goods.forEach(({ id, title, price, imgMin }) => {
                cartWrapper.append(createCardInCart(id, title, price, imgMin));
            });    
        } else {
            const text = `<div id="cart-empty">
                            Your cart is empty
                        </div>`;
            cartWrapper.innerHTML = text;
        }
    };

    // Closing cart
    const closeCart = (event) => {
        const target = event.target;
        if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27){
            cart.style.display = '';
            document.removeEventListener('keyup', closeCart);
        }
    };

    // Opening cart
    const openCart = (event) => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keyup', closeCart);
        getGoods(renderCart, showCardsInCart);
    };

    // Adding product to cart
    const addToCart = (id) => {
        if(goodsInCart[id]){
            goodsInCart[id] += 1;
        } else {
            goodsInCart[id] = 1;
        }
        checkCountOfGoods();
        cookieQuery();
    };

    // Calculation total price of goods in cart
    const calcTotalPrice = (goods) => {
        let sum = goods.reduce((accum, item) => {
            return accum + item.price * goodsInCart[item.id];
        }, 0);
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    };

    // Carts in card
    const handlerCart = (event) => {
        const target = event.target;
        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }
        if (target.classList.contains('goods-delete')) {
            removeGoodsFromCart(target.dataset.goodsId);
        }
    };

    /*end CART---------*/ 


    /*---------GOODS */

    // Adding goods to wishlist/to cart
    const handlerGoods = (event) => {
        const target = event.target;
        // Add to wishlist
        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }
        // Add to cart
        if (target.classList.contains('card-add-cart')) {
            addToCart(target.dataset.goodsId);
        }
    };

    // Getting goods by category
    const selectGoodsByCategory = (event) => {
        event.preventDefault();
        const target = event.target;
        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            getGoods(renderCard, (goods) => {
                return goods.filter(item => item.category.includes(category));
            });
        }
    };

    // Getting count of fav goods/goods in basket
    const checkCountOfGoods = () => {
       wishListCounter.textContent = wishList.length;
       cardCounter.textContent = Object.keys(goodsInCart).length;
    };

    // Deleting goods from cart
    const removeGoodsFromCart = (id) => {
        delete goodsInCart[id];
        checkCountOfGoods();
        cookieQuery();
        getGoods(renderCart, showCardsInCart);
    };

    /*end GOODS--------*/



    /*---------WISHLIST */

    // Adding or removing good from wishlist
    const toggleWishList = (id, elem) => {
    //    if(wishList.indexOf(id) != -1){ 
        if (wishList.includes(id)){ 
            // delete product from wishlist
            wishList.splice(wishList.indexOf(id), 1);
            elem.classList.remove('active');
       } else {
            wishList.push(id);
            elem.classList.add('active');
       }
       checkCountOfGoods();
       // save data
       storageQuery();
    };
   
    // Opening wishlist
    const showWishList = () => {
       getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)));
    };

    /*end WISHLIST---------*/


    /*---------FILTERS */

    // Filtering goods in cart
    const showCardsInCart = (goods) => {
        const goodsCart = goods.filter(item => goodsInCart.hasOwnProperty(item.id));
        calcTotalPrice(goodsCart);
        return goodsCart;
    };

    // Filtering goods in random ordering
    const randomSort = (items) => {
        return items.sort(() => Math.random() - 0.5);
    };

    /*end FILTERS---------*/


    /*---------LOCALSTORAGE */

    // Operations with storage
    const storageQuery = (get) => {
        if (get) {
            if (localStorage.getItem('wishList')){
                wishList.push(...JSON.parse(localStorage.getItem('wishList')));
            }   
            checkCountOfGoods();
        } else {
            localStorage.setItem('wishList', JSON.stringify(wishList));
        }
    };

    /*end LOCALSTORAGE--------*/


    /*---------COOKIE */

    // Getting cookie
    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    // Getting/adding data from/to cookie
    const cookieQuery = (get) => {
        if (get) {
            if (getCookie('goodsInCart')){
                Object.assign(goodsInCart, JSON.parse(getCookie('goodsInCart')));
                // goodsInCart = JSON.parse(getCookie('goodsInCart'));
            }
            checkCountOfGoods();
        } else {
            document.cookie = `goodsInCart=${JSON.stringify(goodsInCart)};max-age=86400e3`;
        }
    };

    /*end COOKIE--------*/ 

    {
        getGoods(renderCard, randomSort);
        storageQuery(true);
        cookieQuery(true);

        cartBtn.addEventListener('click', openCart);
        cart.addEventListener('click', closeCart);
        category.addEventListener('click', selectGoodsByCategory);
        search.addEventListener('submit', searchGoods);
        cartWrapper.addEventListener('click', handlerCart);
        goodsWrapper.addEventListener('click', handlerGoods);
        wishListBtn.addEventListener('click', showWishList);
    }
});