"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Loader2,
  ArrowRight,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_MAP: Record<
  string,
  { label: string; cls: string; color: string }
> = {
  menunggu_ongkir: {
    label: "Menunggu Ongkir",
    cls: "bg-gray-100 text-gray-600",
    color: "#9CA3AF",
  },
  menunggu_pembayaran: {
    label: "Menunggu Bayar",
    cls: "bg-amber-50 text-amber-700",
    color: "#F59E0B",
  },
  diproses: {
    label: "Diproses",
    cls: "bg-blue-50 text-blue-700",
    color: "#3B82F6",
  },
  dikirim: {
    label: "Dikirim",
    cls: "bg-violet-50 text-violet-700",
    color: "#8B5CF6",
  },
  selesai: {
    label: "Selesai",
    cls: "bg-emerald-50 text-emerald-700",
    color: "#10B981",
  },
  batal: { label: "Batal", cls: "bg-red-50 text-red-600", color: "#EF4444" },
};

const formatRp = (v: number) =>
  v >= 1_000_000
    ? `Rp ${(v / 1_000_000).toFixed(1)}jt`
    : `Rp ${v.toLocaleString("id-ID")}`;

interface AnalyticsData {
  summary: {
    revenue30Days: number;
    orders30Days: number;
    ordersThisMonth: number;
    ordersLastMonth: number;
    orderGrowth: number;
    uniqueCustomers: number;
    avgOrderValue: number;
    lowStockCount: number;
  };
  dailyData: { date: string; label: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { name: string; qty: number; revenue: number }[];
  lowStockProducts: { id: string; name: string; stock: number }[];
}

function CustomTooltipRevenue({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-md px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-emerald-600">
          Pendapatan: {`Rp ${payload[0]?.value?.toLocaleString("id-ID")}`}
        </p>
      </div>
    );
  }
  return null;
}

function CustomTooltipOrders({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-md px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-blue-600">Pesanan: {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    recentOrders: [] as any[],
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [productsRes, ordersRes, analyticsRes] = await Promise.all([
          api.get("/products"),
          api.get("/orders/admin/list", config),
          api.get("/orders/admin/analytics", config),
        ]);
        const products = productsRes.data.success
          ? productsRes.data.count || productsRes.data.data.length
          : 0;
        const orders = ordersRes.data.success ? ordersRes.data.data : [];
        setStats({ products, recentOrders: orders.slice(0, 5) });
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-gray-300" />
      </div>
    );

  const summary = analytics?.summary;
  const dailySlice = analytics?.dailyData.slice(-revenueRange) ?? [];

  const statCards = [
    {
      label: "Pendapatan (30 Hari)",
      value: summary ? formatRp(summary.revenue30Days) : "—",
      icon: DollarSign,
      iconCls: "text-emerald-600",
      iconBg: "bg-emerald-50",
      sub: summary
        ? `Rata-rata/order: ${formatRp(summary.avgOrderValue)}`
        : null,
    },
    {
      label: "Pesanan Bulan Ini",
      value: summary?.ordersThisMonth ?? 0,
      icon: ShoppingCart,
      iconCls: "text-blue-600",
      iconBg: "bg-blue-50",
      sub: summary
        ? summary.orderGrowth >= 0
          ? `+${summary.orderGrowth}% vs bulan lalu`
          : `${summary.orderGrowth}% vs bulan lalu`
        : null,
      subCls: summary
        ? summary.orderGrowth >= 0
          ? "text-emerald-500"
          : "text-red-500"
        : "",
      subIcon: summary
        ? summary.orderGrowth >= 0
          ? TrendingUp
          : TrendingDown
        : null,
    },
    {
      label: "Total Produk",
      value: stats.products,
      icon: Package,
      iconCls: "text-[#D92D20]",
      iconBg: "bg-red-50",
      sub: summary ? `${summary.lowStockCount} stok rendah` : null,
      subCls:
        summary && summary.lowStockCount > 0
          ? "text-amber-500"
          : "text-gray-400",
    },
    {
      label: "Pelanggan Unik (30 Hari)",
      value: summary?.uniqueCustomers ?? 0,
      icon: Users,
      iconCls: "text-violet-600",
      iconBg: "bg-violet-50",
      sub: summary ? `${summary.orders30Days} total pesanan` : null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Selamat datang kembali, Admin.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          const SubIcon = s.subIcon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-start justify-between"
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                {s.sub && (
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${s.subCls ?? "text-gray-400"}`}
                  >
                    {SubIcon && <SubIcon className="w-3 h-3" />}
                    {s.sub}
                  </p>
                )}
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}
              >
                <Icon className={`w-5 h-5 ${s.iconCls}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue Area + Orders Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Tren Pendapatan
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Dari pesanan selesai
              </p>
            </div>
            <div className="flex gap-1">
              {([7, 14, 30] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRevenueRange(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    revenueRange === r
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {r}H
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={dailySlice}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : `${v}`
                }
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders per Day */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900">
              Jumlah Pesanan Harian
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {revenueRange} hari terakhir
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={dailySlice}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              barSize={revenueRange <= 7 ? 24 : revenueRange <= 14 ? 14 : 8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                width={24}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltipOrders />} />
              <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Status Pie + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900">
              Status Pesanan
            </p>
            <p className="text-xs text-gray-400 mt-0.5">30 hari terakhir</p>
          </div>
          {analytics?.ordersByStatus && analytics.ordersByStatus.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie
                    data={analytics.ordersByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {analytics.ordersByStatus.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={STATUS_MAP[entry.status]?.color ?? "#D1D5DB"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      STATUS_MAP[name]?.label ?? name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {analytics.ordersByStatus.map((entry, idx) => {
                  const total = analytics.ordersByStatus.reduce(
                    (s, e) => s + e.count,
                    0,
                  );
                  const pct =
                    total > 0 ? Math.round((entry.count / total) * 100) : 0;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            background:
                              STATUS_MAP[entry.status]?.color ?? "#D1D5DB",
                          }}
                        />
                        <span className="text-xs text-gray-600 truncate">
                          {STATUS_MAP[entry.status]?.label ?? entry.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-gray-900">
                          {entry.count}
                        </span>
                        <span className="text-xs text-gray-400">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">
              Belum ada data.
            </div>
          )}
        </div>

        {/* Top 5 Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-900">
              Produk Terlaris
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Berdasarkan jumlah terjual
            </p>
          </div>
          {analytics?.topProducts && analytics.topProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.topProducts.map((p, idx) => {
                const maxQty = analytics.topProducts[0]?.qty ?? 1;
                const pct = maxQty > 0 ? (p.qty / maxQty) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {p.name}
                      </p>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D92D20] rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-gray-900">
                        {p.qty} pcs
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatRp(p.revenue)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-300 text-sm">
              Belum ada data.
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Low Stock + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-gray-900">Stok Rendah</p>
          </div>
          {analytics?.lowStockProducts &&
          analytics.lowStockProducts.length > 0 ? (
            <div className="space-y-2">
              {analytics.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-xs text-gray-700 truncate flex-1 mr-2">
                    {p.name}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      p.stock === 0
                        ? "bg-red-50 text-red-600"
                        : p.stock <= 2
                          ? "bg-orange-50 text-orange-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {p.stock === 0 ? "Habis" : `${p.stock} stok`}
                  </span>
                </div>
              ))}
              <Link
                href="/admin/products"
                className="text-xs text-[#D92D20] hover:underline mt-1 inline-flex items-center gap-1"
              >
                Kelola produk <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="h-24 flex flex-col items-center justify-center text-gray-300">
              <BarChart2 className="w-8 h-8 mb-1" />
              <p className="text-xs">Semua stok aman</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden xl:col-span-2">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Pesanan Terbaru
            </p>
            <Link
              href="/admin/orders"
              className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Pelanggan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order: any) => {
                    const s = STATUS_MAP[order.status] ?? {
                      label: order.status,
                      cls: "bg-gray-100 text-gray-600",
                    };
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-semibold text-gray-900 text-xs">
                          {order.orderId}
                        </td>
                        <td className="px-5 py-3.5 text-gray-700 text-xs">
                          {order.customerName}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900 text-xs">
                          Rp {order.grandTotal?.toLocaleString("id-ID")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}
                          >
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-10 text-center text-gray-300 text-sm"
                    >
                      Belum ada pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
