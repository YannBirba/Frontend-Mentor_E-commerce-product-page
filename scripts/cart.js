import { cloneTemplate, getTag } from "./dom.js";
import { Ls } from "./localStorage.js";

const cloneAndAppendMobile = () => {
  const node = cloneTemplate("#cart-template");
  if (!node) {
    return false;
  }
  document.body.appendChild(node);
  return true;
};

const cloneAndAppendDesktop = () => {
  const node = cloneTemplate("#cart-template");
  const cartButton = getTag(".cart-button");
  if (!node || !cartButton) {
    return false;
  }
  cartButton.appendChild(node);
  return true;
};

const closeCart = (/** @type {HTMLDivElement} */ cart) => {
  cart.remove();
};

const displayEmptyText = (/** @type {HTMLDivElement} */ cartProducts) => {
  const cartEmptyTextTemplate = getTag("#cart-empty-text-template");

  if (!cartEmptyTextTemplate) {
    return;
  }

  const cartEmptyText = cloneTemplate("#cart-empty-text-template");

  if (!cartEmptyText) {
    return;
  }

  cartProducts.appendChild(cartEmptyText);
};

const deleteProductFromCart = (/** @type {number} */ id) => {
  const lsProducts = Ls.get("cart");

  if (!lsProducts) {
    return;
  }

  const products = JSON.parse(lsProducts);
  const newProducts = products.filter((product) => product.id !== id);

  Ls.set("cart", JSON.stringify(newProducts));

  updateCartItemNumber();

  if (newProducts.length === 0) {
    const cartProducts = getTag(".cart_products");
    if (!cartProducts) {
      return;
    }
    // @ts-ignore
    displayEmptyText(cartProducts);
    const cartCheckoutButton = getTag(".cart-checkout-button");
    console.log(cartCheckoutButton);
    if (!cartCheckoutButton) {
      return;
    }
    cartCheckoutButton.classList.add("exit");
    setTimeout(() => {
      cartCheckoutButton.remove();
    }, 125);
  }
};

const deleteCartProductButtonClicked = (
  /** @type {HTMLElement} */ deleteButton
) => {
  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    const productId = Number(deleteButton.dataset.id);
    deleteProductFromCart(productId);
    const cartProduct = deleteButton.parentElement;
    if (!cartProduct) {
      return;
    }
    cartProduct.classList.add("exit");
    setTimeout(() => {
      cartProduct.remove();
    }, 125);
  });
};

const displayCartProducts = () => {
  const cartProducts = getTag(".cart_products");

  if (!cartProducts) {
    return;
  }

  cartProducts.innerHTML = "";

  const lsProducts = Ls.get("cart");
  let products = [];
  if (lsProducts) {
    products = JSON.parse(lsProducts);
  }
  if (!lsProducts || products.length === 0 || !products) {
    // @ts-ignore
    displayEmptyText(cartProducts);
    return;
  }
  const cartButtonCheckout = getTag(".cart-checkout-button");

  if (!cartButtonCheckout) {
    displayCartCheckoutButton();
  }

  products.forEach((product) => {
    const cartProductTemplate = cloneTemplate("#cart-product-template");
    if (!cartProductTemplate) {
      throw new Error("Failed to clone cart product template");
    }

    cartProducts.appendChild(cartProductTemplate);
    const cartProduct = getTag(".cart_product:last-child");

    if (!cartProduct) {
      throw new Error("Failed to get cart product");
    }

    // @ts-ignore
    const cartProductImage = getTag(".cart_product__image img", cartProduct);
    const cartProductName = getTag(
      ".cart_product__description__name",
      // @ts-ignore
      cartProduct
    );
    const cartProductPrice = getTag(
      ".cart_product__description__price",
      // @ts-ignore
      cartProduct
    );
    const cartProductQuantity = getTag(
      ".cart_product__description__count",
      // @ts-ignore
      cartProduct
    );
    const cartProductTotalPrice = getTag(
      ".cart_product__description__total",
      // @ts-ignore
      cartProduct
    );
    const cartProductRemoveButton = getTag(
      ".cart_product__remove",
      // @ts-ignore
      cartProduct
    );

    if (
      !cartProductName ||
      !cartProductPrice ||
      !cartProductQuantity ||
      !cartProductTotalPrice ||
      !cartProductImage ||
      !cartProductRemoveButton
    ) {
      throw new Error("Failed to get cart product elements");
    }

    // @ts-ignore
    cartProductRemoveButton.setAttribute("data-id", String(product.id));
    // @ts-ignore
    deleteCartProductButtonClicked(cartProductRemoveButton);
    cartProductImage.setAttribute(
      "src",
      `/images/image-product-${product.id}-thumbnail.jpg`
    );
    cartProductImage.setAttribute("alt", product.name);
    cartProductImage.setAttribute("title", product.name);
    cartProductName.textContent = product.name;
    cartProductPrice.textContent = `$${String(product.price)}.00`;
    cartProductQuantity.textContent = String(product.quantity);
    cartProductTotalPrice.textContent = `$${String(
      product.price * product.quantity
    )}.00`;
  });
};

const displayCartCheckoutButton = () => {
  const cartButtonTemplate = getTag("#cart-product-checkout-button-template");

  if (!cartButtonTemplate) {
    return;
  }

  const cartButton = cloneTemplate("#cart-product-checkout-button-template");

  if (!cartButton) {
    return;
  }

  const cart = getTag(".cart");

  if (!cart) {
    return;
  }

  cart.appendChild(cartButton);
};

const cloningConditions = () => {
  if (window.innerWidth <= 500) {
    if (!cloneAndAppendMobile()) {
      throw new Error("Failed to clone and append mobile");
    }
  } else {
    if (!cloneAndAppendDesktop()) {
      throw new Error("Failed to clone and append desktop");
    }
    handleCartPosition();
  }
};

const openCart = () => {
  cloningConditions();
  displayCartProducts();
};

const cartButtonClicked = () => {
  const cartButton = getTag(".cart-button");

  if (!cartButton) {
    return;
  }

  cartButton.addEventListener("click", () => {
    const cart = getTag(".cart");

    if (!cart) {
      openCart();
      return;
    } else {
      cart.classList.add("exit");
      setTimeout(() => {
        // @ts-ignore
        closeCart(cart);
      }, 125);
    }
  });

  window.addEventListener("click", (e) => {
    const cart = getTag(".cart");
    const addToCartButton = getTag(".add-to-cart");

    if (cart && addToCartButton) {
      if (
        e.target === cart ||
        // @ts-ignore
        cart?.contains(e.target) ||
        e.target === cartButton ||
        // @ts-ignore
        cartButton?.contains(e.target) ||
        e.target === addToCartButton ||
        // @ts-ignore
        addToCartButton?.contains(e.target)
      ) {
        return;
      }

      cart.classList.add("exit");
      setTimeout(() => {
        // @ts-ignore
        closeCart(cart);
      }, 125);
    }
  });
};

const addProductToCart = ({
  /** @type {number} */ id,
  /** @type {string} */ name,
  /** @type {string} */ price,
  /** @type {number} */ quantity,
}) => {
  const lsProducts = Ls.get("cart");

  if (!lsProducts) {
    Ls.set("cart", JSON.stringify([{ id, name, price, quantity }]));
    updateCartItemNumber();
    return;
  }

  const products = JSON.parse(lsProducts);
  const product = products.find((product) => product.id === id);

  if (!product) {
    products.push({ id, name, price, quantity });
    Ls.set("cart", JSON.stringify(products));
  } else {
    product.quantity += quantity;
    Ls.set("cart", JSON.stringify(products));
  }

  updateCartItemNumber();
  displayCartProducts();
};

const getCartProductsNumber = () => {
  const lsProducts = Ls.get("cart");

  if (!lsProducts) {
    return 0;
  }

  const products = JSON.parse(lsProducts);
  return products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);
};

const displayCartItemNumber = () => {
  const number = getCartProductsNumber();
  if (number === 0) {
    return;
  }
  const cartButton = getTag(".cart-button");
  const cartItemNumberTemplate = getTag("#cart-count-template");
  if (!cartItemNumberTemplate || !cartButton) {
    return;
  }

  const cartItemNumber = cloneTemplate("#cart-count-template");
  if (!cartItemNumber) {
    return;
  }

  cartButton.appendChild(cartItemNumber);
  const cartCount = getTag(".cart-button .cart-count");

  if (!cartCount) {
    return;
  }

  cartCount.textContent = String(number);
};

const updateCartItemNumber = () => {
  const cartItemNumber = getTag(".cart-button .cart-count");

  if (!cartItemNumber) {
    displayCartItemNumber();
    return;
  }

  const number = getCartProductsNumber();

  if (number > 0) {
    cartItemNumber.textContent = String(number);
    return;
  }

  cartItemNumber.remove();
};

const addToCart = () => {
  const addToCartButton = getTag(".add-to-cart");

  if (!addToCartButton) {
    return;
  }

  addToCartButton.addEventListener("click", (e) => {
    e.preventDefault();
    const productName = getTag(".product__description h1");
    const productPrice = getTag(".price .current-price");
    const productQuantity = getTag("#product-number");
    // random between 1 and 4
    const productId = Math.floor(Math.random() * 4) + 1;

    if (!productName || !productPrice || !productQuantity) {
      return;
    }

    addProductToCart({
      id: productId,
      name: productName.textContent
        ?.replaceAll("\n", "")
        .replace(/\s\s+/g, " ")
        .trim(),
      price: Number(
        productPrice.textContent
          ?.replace("$", "")
          .replace("€", "")
          .replace("£", "")
          .replace(",", "")
          .replace(" ", "")
          .trim()
      ),
      // @ts-ignore
      quantity: Number(productQuantity.value),
    });

    const cart = getTag(".cart");
    if (!cart) {
      openCart();
      return;
    }
  });
};

const increaseProductQuantity = () => {
  const button = getTag(".plus");

  if (!button) {
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const productQuantity = getTag("#product-number");
    if (!productQuantity) {
      return;
    }
    // @ts-ignore
    if (Number(productQuantity.value) >= 10) {
      return;
    }
    // @ts-ignore
    productQuantity.value = Number(productQuantity.value) + 1;
  });
};

const decreaseProductQuantity = () => {
  const button = getTag(".minus");

  if (!button) {
    return;
  }

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const productQuantity = getTag("#product-number");
    if (!productQuantity) {
      return;
    }

    // @ts-ignore
    if (Number(productQuantity.value) <= 1) {
      return;
    }
    // @ts-ignore
    productQuantity.value = Number(productQuantity.value) - 1;
  });
};

const handleCartPosition = () => {
  const cart = getTag(".cart");
  if (!cart) {
    return;
  }

  // @ts-ignore
  const rightPosition = cart.getBoundingClientRect().left + cart.offsetWidth;
  const diff = rightPosition - window.innerWidth;
  if (rightPosition > window.innerWidth) {
    const offsetLeft = `calc(50% - ${diff + 25}px)`;

    // @ts-ignore
    cart.style.left = offsetLeft;

    const transform = offsetLeft.replace("50%", "-50%");

    // @ts-ignore
    cart.style.setProperty("--offset-x", transform);

    // @ts-ignore
    cart.style.transform = `translateX(${transform})`;
  }
};

export const cart = () => {
  cartButtonClicked();
  displayCartItemNumber();
  addToCart();
  increaseProductQuantity();
  decreaseProductQuantity();
  if (window.innerWidth > 500) {
    window.addEventListener("resize", handleCartPosition);
  }
};
