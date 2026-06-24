import { Link } from "react-router-dom";
import type { ProductProps } from "../pages/ProductDetails";
import { useCartContext } from "../context/CartContext";

export default function ProductCard({ product }: { product: ProductProps }) {
  const {addToCart, cartItems} = useCartContext();
  const productInCart = cartItems.find((item) => item.id === product.id.toString());

  return (
    <div
      className="product-card"
    >
      <img
        src={product.image}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">€{product.price}</p>
        <div className="product-card-actions">
          <Link className="btn btn-secondary" to={`/products/${product.id}`}>View Details</Link>
          <button className="btn btn-primary" onClick={() => addToCart(product.id.toString())}>
            Add To Cart {productInCart ? `(${productInCart.quantity})` : null}
          </button>
        </div>
      </div>
    </div>
  );
}
