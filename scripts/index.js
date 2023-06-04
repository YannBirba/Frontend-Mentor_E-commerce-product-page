import { cart } from "./cart.js";
import { menu } from "./menu.js";
import { mobileMenu } from "./menu.js";
import { productImages } from "./productImages.js";

if ("content" in document.createElement("template")) {
} else {
  throw new Error("Your browser does not support templates");
}
mobileMenu();
productImages();
cart();
menu();
