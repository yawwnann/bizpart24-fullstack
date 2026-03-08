"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Loader2, Save, Upload, X, ImagePlus } from "lucide-react";
import api from "@/lib/api";

export default function AdminProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const isEditMode = params.id && params.id !== "new";

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [makes, setMakes] = useState<{ id: string; name: string }[]>([]);
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);

  // Add form states
  const [isAddingMake, setIsAddingMake] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newMakeName, setNewMakeName] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingMake, setAddingMake] = useState(false);
  const [addingModel, setAddingModel] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    make: "",
    model: "",
    year: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [detailFiles, setDetailFiles] = useState<File[]>([]);
  const [detailPreviews, setDetailPreviews] = useState<string[]>([]);
  const [existingDetailImages, setExistingDetailImages] = useState<
    { id: string; url: string; order: number }[]
  >([]);
  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories
    api.get("/categories").then((res) => {
      if (res.data.success) setCategories(res.data.data);
    });

    // Fetch makes
    api.get("/makes").then((res) => {
      if (res.data.success) setMakes(res.data.data);
    });

    // Fetch models
    api.get("/models").then((res) => {
      if (res.data.success) setModels(res.data.data);
    });

    if (isEditMode) {
      fetchProduct();
    }
  }, [isEditMode]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${params.id}`);
      if (res.data.success) {
        const p = res.data.data;
        setFormData({
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category,
          make: p.make,
          model: p.model,
          year: p.year,
          stock: p.stock,
        });
        setPreviewImage(p.image);
        if (p.images && p.images.length > 0) {
          setExistingDetailImages(p.images);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDetailFiles((prev) => [...prev, ...files]);
      setDetailPreviews((prev) => [
        ...prev,
        ...files.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const removeNewDetailImage = (index: number) => {
    setDetailFiles((prev) => prev.filter((_, i) => i !== index));
    setDetailPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingDetailImage = (imageId: string) => {
    setDeleteImageIds((prev) => [...prev, imageId]);
    setExistingDetailImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleCreateMake = async () => {
    if (!newMakeName) return;

    setAddingMake(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.post(
        "/makes",
        { name: newMakeName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMakes([...makes, response.data.data]);
        setFormData({ ...formData, make: response.data.data.name });
        setNewMakeName("");
        setIsAddingMake(false);
      }
    } catch (error) {
      console.error("Failed to create make", error);
      alert("Failed to create make");
    } finally {
      setAddingMake(false);
    }
  };

  const handleCreateModel = async () => {
    if (!newModelName) return;

    setAddingModel(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.post(
        "/models",
        { name: newModelName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setModels([...models, response.data.data]);
        setFormData({ ...formData, model: response.data.data.name });
        setNewModelName("");
        setIsAddingModel(false);
      }
    } catch (error) {
      console.error("Failed to create model", error);
      alert("Failed to create model");
    } finally {
      setAddingModel(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    setAddingCategory(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.post(
        "/categories",
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setCategories([...categories, response.data.data]);
        setFormData({ ...formData, category: response.data.data.name });
        setNewCategoryName("");
        setIsAddingCategory(false);
      }
    } catch (error) {
      console.error("Failed to create category", error);
      alert("Gagal membuat kategori");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formPayload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value as string);
      });

      if (imageFile) {
        formPayload.append("profile", imageFile);
      }

      // Append detail images
      detailFiles.forEach((file) => {
        formPayload.append("details", file);
      });

      // Append image IDs to delete
      if (deleteImageIds.length > 0) {
        formPayload.append("deleteImageIds", JSON.stringify(deleteImageIds));
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await api.put(`/admin/products/${params.id}`, formPayload, config);
      } else {
        await api.post(`/admin/products`, formPayload, config);
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Gagal menyimpan produk");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className=" text-gray-900 mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2 text-gray-50" />{" "}
          <span className="text-gray-50"> Kembali</span>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Produk" : "Produk Baru"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Informasi Dasar
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nama Produk
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Kampas Rem Depan"
                className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Harga (Rp)
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Stock
                </label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#D92D20] placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full min-h-[150px] p-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D92D20] focus:border-[#D92D20] transition-all"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Kompatibilitas
            </h3>

            {/* Make Dropdown with Add */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Merek
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingMake(!isAddingMake)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isAddingMake ? "Batal" : "+ Tambah Merek"}
                </button>
              </div>

              {isAddingMake ? (
                <div className="flex gap-2">
                  <Input
                    value={newMakeName}
                    onChange={(e) => setNewMakeName(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="flex-1 bg-gray-50 border-gray-200 text-gray-900"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleCreateMake())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleCreateMake}
                    disabled={addingMake}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addingMake ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Tambah"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 appearance-none transition-all"
                    required
                  >
                    <option value="">Pilih Merek</option>
                    {makes.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Model Dropdown with Add */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Model
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingModel(!isAddingModel)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isAddingModel ? "Batal" : "+ Tambah Model"}
                </button>
              </div>

              {isAddingModel ? (
                <div className="flex gap-2">
                  <Input
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g. Avanza"
                    className="flex-1 bg-gray-50 border-gray-200 text-gray-900"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleCreateModel())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleCreateModel}
                    disabled={addingModel}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addingModel ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Tambah"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 appearance-none transition-all"
                    required
                  >
                    <option value="">Pilih Model</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Year Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tahun</label>
              <Input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="e.g. 2022"
                className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 placeholder:text-gray-400"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Organisasi
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-xs text-[#D92D20] hover:text-[#B91C1C] font-medium"
                >
                  {isAddingCategory ? "Batal" : "+ Tambah Kategori"}
                </button>
              </div>

              {isAddingCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Kampas Rem"
                    className="flex-1 bg-gray-50 border-gray-200 text-gray-900"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleCreateCategory())
                    }
                  />
                  <Button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={addingCategory}
                    size="sm"
                    className="bg-[#D92D20] hover:bg-[#B91C1C]"
                  >
                    {addingCategory ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Tambah"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#D92D20] focus:border-[#D92D20] appearance-none transition-all"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow for select */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Gambar Profil Katalog
            </h3>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 hover:border-[#D92D20] transition-all cursor-pointer relative group">
              {previewImage ? (
                <div className="relative aspect-square w-full">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                    Ubah Gambar
                  </div>
                </div>
              ) : (
                <div className="aspect-square w-full flex flex-col items-center justify-center text-gray-400 group-hover:text-[#D92D20] transition-colors">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">
                    Klik untuk Upload Gambar Profil
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Gambar Detail Produk
            </h3>
            <p className="text-xs text-gray-400">
              Gambar tambahan untuk halaman detail (maks 10)
            </p>

            {/* Existing detail images */}
            {existingDetailImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {existingDetailImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingDetailImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New detail image previews */}
            {detailPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {detailPreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 group"
                  >
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded">
                      Baru
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewDetailImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add more button */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer relative group">
              <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors py-2">
                <ImagePlus className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">
                  Tambah Gambar Detail
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleDetailImagesChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-900/10 transition-all"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Simpan Produk"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
