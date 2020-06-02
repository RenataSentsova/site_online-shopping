'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  var search = document.querySelector('.search');
  var cartBtn = document.getElementById('cart');
  var wishListBtn = document.getElementById('wishlist');
  var goodsWrapper = document.querySelector('.goods-wrapper');
  var cart = document.querySelector('.cart');
  var category = document.querySelector('.category');
  var cardCounter = cartBtn.querySelector('.counter');
  var wishListCounter = wishListBtn.querySelector('.counter');
  var cartWrapper = document.querySelector('.cart-wrapper');
  var wishList = [];
  var goodsInCart = {}; // ------------------- FUNCTIONS -------------------------
  // API fetch

  var getGoods = function getGoods(handler, filter) {
    loading(handler.name);
    fetch('db/db.json').then(function (response) {
      return response.json();
    }) // getting array
    .then(filter).then(handler);
  };
  /*--------SEARCHING BAR */
  // Searching goods by bar


  var searchGoods = function searchGoods(event) {
    event.preventDefault();
    var input = event.target.elements.searchGoods;
    var inputValue = input.value.trim(); // trim() - deleting all ' ' before and after string

    if (input.value.trim() !== '') {
      var searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      search.classList.add('error');
      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    }

    input.value = '';
  };
  /*-------end SEARCHING BAR*/

  /*---------SPINNER */
  // Adding spinner


  var loading = function loading(nameOfFunct) {
    var spinner = "<div id=\"spinner\"><div class=\"spinner-loading\">\n                        <div><div><div></div></div><div><div></div></div>\n                        <div><div></div></div><div><div></div></div></div>\n                        </div></div>";

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


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "<div class=\"card\">\n                            <div class=\"card-img-wrapper\">\n                                <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"\">\n                                <button class=\"card-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\" \n                                    data-goods-id=\"").concat(id, "\"></button>\n                            </div>\n                            <div class=\"card-body justify-content-between\">\n                                <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n                                <div class=\"card-price\">").concat(price, " \u20BD</div>\n                                <div>\n                                    <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n                                </div>\n                            </div>\n                        </div>");
    return card;
  }; // Creating cards for products


  var renderCard = function renderCard(goods) {
    goodsWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref) {
        var id = _ref.id,
            title = _ref.title,
            price = _ref.price,
            imgMin = _ref.imgMin;
        goodsWrapper.append(createCardGoods(id, title, price, imgMin));
      });
    } else {
      //goodsWrapper.textContent='Sorry, we did not find any products';
      var text = "<table>\n                        <tr align=\"center\"><th><img width=300 src=\"img/tenor.gif\"></th></tr>\n                        <tr align=\"center\"><th><h2 style=\"color:red;\">Sorry, we did not find any products</th></hd></tr>\n                        </table>";
      goodsWrapper.innerHTML = text;
    }
  };
  /*end CADRS-------*/

  /*---------CART */
  // Creating cart


  var createCardInCart = function createCardInCart(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = "<div class=\"goods-img-wrapper\">\n                                <img class=\"goods-img\" src=\"".concat(img, "\" alt=\"\">\n                            </div>\n                            <div class=\"goods-description\">\n                                <h2 class=\"goods-title\">").concat(title, "</h2>\n                                <p class=\"goods-price\">").concat(price, " \u20BD</p>\n                            </div>\n                            <div class=\"goods-price-count\">\n                                <div class=\"goods-trigger\">\n                                    <button class=\"goods-add-wishlist ").concat(wishList.includes(id) ? 'active' : '', "\" \n                                    data-goods-id=\"").concat(id, "\"></button>\n                                    <button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n                                </div>\n                                <div class=\"goods-count\">").concat(goodsInCart[id], "</div>\n                            </div>");
    return card;
  }; // Creating cart for products


  var renderCart = function renderCart(goods) {
    cartWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref2) {
        var id = _ref2.id,
            title = _ref2.title,
            price = _ref2.price,
            imgMin = _ref2.imgMin;
        cartWrapper.append(createCardInCart(id, title, price, imgMin));
      });
    } else {
      var text = "<div id=\"cart-empty\">\n                            Your cart is empty\n                        </div>";
      cartWrapper.innerHTML = text;
    }
  }; // Closing cart


  var closeCart = function closeCart(event) {
    var target = event.target;

    if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeCart);
    }
  }; // Opening cart


  var openCart = function openCart(event) {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderCart, showCardsInCart);
  }; // Adding product to cart


  var addToCart = function addToCart(id) {
    if (goodsInCart[id]) {
      goodsInCart[id] += 1;
    } else {
      goodsInCart[id] = 1;
    }

    checkCountOfGoods();
    cookieQuery();
  }; // Calculation total price of goods in cart


  var calcTotalPrice = function calcTotalPrice(goods) {
    var sum = goods.reduce(function (accum, item) {
      return accum + item.price * goodsInCart[item.id];
    }, 0);
    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
  }; // Carts in card


  var handlerCart = function handlerCart(event) {
    var target = event.target;

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


  var handlerGoods = function handlerGoods(event) {
    var target = event.target; // Add to wishlist

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishList(target.dataset.goodsId, target);
    } // Add to cart


    if (target.classList.contains('card-add-cart')) {
      addToCart(target.dataset.goodsId);
    }
  }; // Getting goods by category


  var selectGoodsByCategory = function selectGoodsByCategory(event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      });
    }
  }; // Getting count of fav goods/goods in basket


  var checkCountOfGoods = function checkCountOfGoods() {
    wishListCounter.textContent = wishList.length;
    cardCounter.textContent = Object.keys(goodsInCart).length;
  }; // Deleting goods from cart


  var removeGoodsFromCart = function removeGoodsFromCart(id) {
    delete goodsInCart[id];
    checkCountOfGoods();
    cookieQuery();
    getGoods(renderCart, showCardsInCart);
  };
  /*end GOODS--------*/

  /*---------WISHLIST */
  // Adding or removing good from wishlist


  var toggleWishList = function toggleWishList(id, elem) {
    //    if(wishList.indexOf(id) != -1){ 
    if (wishList.includes(id)) {
      // delete product from wishlist
      wishList.splice(wishList.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishList.push(id);
      elem.classList.add('active');
    }

    checkCountOfGoods(); // save data

    storageQuery();
  }; // Opening wishlist


  var showWishList = function showWishList() {
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishList.includes(item.id);
      });
    });
  };
  /*end WISHLIST---------*/

  /*---------FILTERS */
  // Filtering goods in cart


  var showCardsInCart = function showCardsInCart(goods) {
    var goodsCart = goods.filter(function (item) {
      return goodsInCart.hasOwnProperty(item.id);
    });
    calcTotalPrice(goodsCart);
    return goodsCart;
  }; // Filtering goods in random ordering


  var randomSort = function randomSort(items) {
    return items.sort(function () {
      return Math.random() - 0.5;
    });
  };
  /*end FILTERS---------*/

  /*---------LOCALSTORAGE */
  // Operations with storage


  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('wishList')) {
        wishList.push.apply(wishList, _toConsumableArray(JSON.parse(localStorage.getItem('wishList'))));
      }

      checkCountOfGoods();
    } else {
      localStorage.setItem('wishList', JSON.stringify(wishList));
    }
  };
  /*end LOCALSTORAGE--------*/

  /*---------COOKIE */
  // Getting cookie


  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }; // Getting/adding data from/to cookie


  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsInCart')) {
        Object.assign(goodsInCart, JSON.parse(getCookie('goodsInCart'))); // goodsInCart = JSON.parse(getCookie('goodsInCart'));
      }

      checkCountOfGoods();
    } else {
      document.cookie = "goodsInCart=".concat(JSON.stringify(goodsInCart), ";max-age=86400e3");
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