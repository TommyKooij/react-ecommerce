import { createContext, useState, useContext, type ReactNode } from "react";
import { getProductById } from "../../data/products";

type CartItem = {
  id: string;
  quantity: number;
};

function useCartStore() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // {id: 2, quantity: 7}

  function addToCart(productId: string) {
    const existing = cartItems.find((item: CartItem) => item.id === productId);

    if (existing) {
      setCartItems(
        cartItems.map((item: CartItem) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );

      return;
    }

    const product = getProductById(productId);

    if (!product) return;

    setCartItems((prev) =>
      prev.map((item: CartItem) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function getCartItemsWithProducts() {
    return cartItems
      .map((item: CartItem) => ({
        ...item,
        product: getProductById(item.id),
      }))
      .filter((item) => item.product);
  }

  function removeFromCart(productId: string) {
    setCartItems(cartItems.filter((item: CartItem) => item.id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(
      cartItems.map((item: CartItem) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  function getCartTotal() {
    const total = cartItems.reduce((total, item) => {
      const product = getProductById(item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
    return total;
  }

  function clearCart() {
    setCartItems([]);
  }

  return {
    cartItems,
    setCartItems,
    addToCart,
    getCartItemsWithProducts,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  };
}

type CartContextType = ReturnType<typeof useCartStore>;

const CartContext = createContext<CartContextType | null>(null);

export default function CartProvider({ children }: { children: ReactNode }) {
  const store = useCartStore();

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("CartContext is not valid!");
  }

  return context;
}
