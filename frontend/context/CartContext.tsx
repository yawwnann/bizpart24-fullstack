"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: number | string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("biz24_cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart data", e)
      }
    }
  }, [])

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem("biz24_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        category: product.category,
        quantity: 1 
      }]
    })
    // Optional: Toast notification here
  }

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity < 1) return
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

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
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
