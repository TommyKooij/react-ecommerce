import { Link } from "react-router-dom";
import type { ProductProps } from "../pages/ProductDetails";

export default function ProductCard({ product }: { product: ProductProps }) {
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
          <button className="btn btn-primary">Add To Cart</button>
        </div>
      </div>
    </div>
  );
}
