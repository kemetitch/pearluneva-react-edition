import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth, logout as logoutAuth } from "../lib/auth";
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
} from "../lib/products";
import "../styles/admin.css";

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "candles",
    badge: "",
    description: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState(null);

  const showAdminToast = useCallback((message, icon = "✦") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  }, []);

  const loadProducts = useCallback(async () => {
    const data = await fetchProducts();
    setProducts(data || []);
  }, []);

  useEffect(() => {
    (async () => {
      const user = await checkAuth();
      if (!user) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setAuthenticated(true);
      await loadProducts();
    })();
  }, [navigate, loadProducts]);

  const handleLogout = async () => {
    await logoutAuth();
    navigate("/admin/login", { replace: true });
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm({
      name: "",
      price: "",
      category: "candles",
      badge: "",
      description: "",
    });
    setExistingImages([]);
    setFiles(null);
    setModalOpen(true);
  };

  const openEditModal = async (id) => {
    const product = await fetchProductById(id);
    if (!product) return;

    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      badge: product.badge || "",
      description: product.description,
    });
    setExistingImages(product.images || (product.image ? [product.image] : []));
    setFiles(null);
    setModalOpen(true);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let newUploadedImages = [];
      if (files && files.length > 0) {
        newUploadedImages = await uploadProductImages(files);
      }

      const finalImages = [...existingImages, ...newUploadedImages];
      if (finalImages.length === 0) {
        alert("A product must have at least one image.");
        setSaving(false);
        return;
      }

      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        badge: form.badge || null,
        description: form.description,
        image: finalImages[0],
        images: finalImages,
      };

      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        showAdminToast("Product updated! ✨", "🛒");
      } else {
        await addProduct(productData);
        showAdminToast("New product added! ✨", "🌟");
      }

      setModalOpen(false);
      await loadProducts();
    } catch (error) {
      console.error("Save error:", error);
      alert("Database Error: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const product = await fetchProductById(id);
      if (product) {
        await deleteProduct(product);
        showAdminToast("Product removed.", "🗑️");
        await loadProducts();
      }
    } catch (error) {
      alert("Delete error: " + error.message);
    }
  };

  if (!authenticated) return null;

  return (
    <div className="admin-page">
      <div className={`admin-layout${sidebarOpen ? " sidebar-active" : ""}`}>
        {/* Mobile Toggle Overlay */}
        {/* {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )} */}

        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Menu"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">✦</span>
            <span className="sidebar-text">Pearluneva</span>
          </div>
          <nav>
            <a href="#" className="sidebar-nav-item active">
              <span className="nav-icon">📦</span>
              <span className="sidebar-text">Inventory</span>
            </a>
          </nav>
          <div className="sidebar-footer">
            <button
              onClick={handleLogout}
              className="btn-logout"
              title="Logout"
            >
              <span className="nav-icon">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
              <span className="sidebar-text">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="header">
            <div className="header-left">
              <div>
                <h1>Inventory</h1>
                <p className="admin-subtitle">Manage your artisan products</p>
              </div>
            </div>
            <button onClick={openAddModal} className="btn btn--primary">
              <span className="btn--icon-lg">+</span> New Product
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">📦</div>
              <div>
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{products.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper status-online">🌐</div>
              <div>
                <div className="stat-label">System Status</div>
                <div className="stat-status">Live Online</div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="table-section">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Info</th>
                  <th>Category</th>
                  <th>Badge</th>
                  <th>Price</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h3 className="empty-title">No products found</h3>
                      <p className="empty-text">
                        Start building your inventory.
                      </p>
                      <button
                        onClick={openAddModal}
                        className="btn btn--primary"
                      >
                        Add Product Now
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const images =
                      product.images?.length > 0
                        ? product.images
                        : [product.image];
                    const updatedAt = product.updated_at
                      ? new Date(product.updated_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "Recently";

                    return (
                      <tr key={product.id}>
                        <td data-label="Product Info">
                          <div className="product-info">
                            <div className="images-preview-strip">
                              {images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt=""
                                  onError={(e) => {
                                    e.target.src = "/images/candle-1.png";
                                  }}
                                />
                              ))}
                            </div>
                            <div className="product-details-text">
                              <div className="product-name">{product.name}</div>
                              <div className="product-id-text">
                                ID: {product.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Category">
                          <span className="badge badge--category">
                            {product.category}
                          </span>
                        </td>
                        <td data-label="Badge">
                          {product.badge ? (
                            <span className="badge badge--trending">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="badge-none-text">None</span>
                          )}
                        </td>
                        <td data-label="Price">
                          <div className="price-text">
                            ${parseFloat(product.price).toFixed(2)}
                          </div>
                        </td>
                        <td data-label="Updated">
                          <div className="updated-text">{updatedAt}</div>
                        </td>
                        <td data-label="Actions">
                          <div className="action-btns">
                            <button
                              className="btn-icon"
                              onClick={() => openEditModal(product.id)}
                              title="Edit Product"
                            >
                              <svg
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              className="btn-icon btn-icon--delete"
                              onClick={() => handleDelete(product.id)}
                              title="Delete Product"
                            >
                              <svg
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <div
          className="modal-overlay active"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="modal-card opacity-1 translate-y-0">
            <div className="modal-header">
              <h2>{editProduct ? "Update Product" : "Add New Masterpiece"}</h2>
              <button
                className="modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="Handmade Candle..."
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      className="form-input"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      <option value="candles">🕯️ Candles</option>
                      <option value="bags">👜 Beaded Bags</option>
                      <option value="concrete">🏺 Concrete</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Badge</label>
                  <select
                    className="form-input"
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badge: e.target.value }))
                    }
                  >
                    <option value="">None</option>
                    <option value="Trending">Trending</option>
                    <option value="Elegant">Elegant</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Product Images</label>
                  <input
                    type="file"
                    className="form-input"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  {existingImages.length > 0 && (
                    <div className="images-manager d-grid">
                      {existingImages.map((img, i) => (
                        <div className="image-preview-item" key={i}>
                          <img src={img} alt={`Product image ${i}`} />
                          <button
                            type="button"
                            className="image-delete-btn"
                            onClick={() => removeExistingImage(i)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="image-hint">
                    {editProduct
                      ? "Add more images or keep existing ones."
                      : "Select at least 1 image (JPG/PNG)"}
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input min-h-100"
                    required
                    placeholder="Describe your masterpiece..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner"></span> Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Toasts */}
      <div className="toast-container-admin">
        {toasts.map((t) => (
          <div key={t.id} className="admin-toast">
            <span>{t.icon}</span> <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
