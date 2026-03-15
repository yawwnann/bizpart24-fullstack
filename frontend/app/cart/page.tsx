"use client";

import { useCart } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Keranjang Belanja
          </h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items List */}
              <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <ul className="p-6 space-y-6 list-none m-0">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-4 py-4 border-b border-gray-100 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 uppercase">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-[#D92D20] font-bold">
                          Rp {item.price.toLocaleString("id-ID")}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                          <button
                            className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-96 shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Ringkasan Belanja
                  </h2>

                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>
                        Total Harga (
                        {cartItems.reduce(
                          (acc, item) => acc + item.quantity,
                          0,
                        )}{" "}
                        barang)
                      </span>
                      <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimasi Potongan</span>
                      <span className="text-green-600">- Rp 0</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        Total Belanja
                      </span>
                      <span className="font-bold text-xl text-[#D92D20]">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#D92D20] hover:bg-[#b91c1c] h-12 text-md font-bold"
                    asChild
                  >
                    <Link href="/checkout">
                      Lanjut ke Checkout <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Keranjang Anda Kosong
              </h2>
              <p className="text-gray-500 mb-6">
                Sepertinya Anda belum menambahkan produk apapun.
              </p>
              <Button asChild className="bg-[#D92D20] hover:bg-[#b91c1c]">
                <Link href="/products">Mulai Belanja</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
