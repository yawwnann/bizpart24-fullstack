"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

/* =========================
   Types
========================= */

export interface Product {
  id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

/* =========================
   Context
========================= */

const CartContext = createContext<CartContextType | null>(null);

/* =========================
   Provider
========================= */

export function CartProvider({ children }: { children: ReactNode }) {
  /* =========================
     Initialize cart from localStorage
  ========================= */

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedCart = localStorage.getItem("biz24_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  /* =========================
     Save cart to localStorage
  ========================= */

  useEffect(() => {
    localStorage.setItem("biz24_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /* =========================
     Add item
  ========================= */

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* =========================
     Remove item
  ========================= */

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /* =========================
     Update quantity
  ========================= */

  const updateQuantity = (id: number | string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  };

  /* =========================
     Clear cart
  ========================= */

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("biz24_cart");
  };

  /* =========================
     Total price
  ========================= */

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  /* =========================
     Provider
  ========================= */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   Hook
========================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
