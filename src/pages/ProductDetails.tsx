import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../data/products";
import { useCartContext } from "../context/CartContext";

export type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const { addToCart, cartItems } = useCartContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const foundProduct = getProductById(id);

    if (!foundProduct) {
      navigate("/");
      return;
    }

    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return <h1>Loading...</h1>;
  }

  const productInCart = cartItems.find(
    (item) => item.id === product.id.toString(),
  );

  return (
    <div className="page">
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-content">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">€{product.price}</p>
            <p className="product-detail-description">{product.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product.id.toString())}
            >
              Add To Cart {productInCart ? `(${productInCart.quantity})` : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
