import { supabase } from "./supabase";

/** Fetch all products */
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

/** Fetch single product */
export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

/** Upload images to Supabase Storage */
export async function uploadProductImages(files) {
  const uploadedUrls = [];
  const timestamp = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${i}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Upload Error:", error);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  if (uploadedUrls.length === 0 && files.length > 0) {
    throw new Error("No images could be uploaded.");
  }
  return uploadedUrls;
}

/** Add product */
export async function addProduct(productData) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select();

  if (error) throw error;
  return data[0];
}

/** Update product */
export async function updateProduct(id, productData) {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data[0];
}

/** Delete product and its images */
export async function deleteProduct(product) {
  if (product.images?.length > 0) {
    const paths = product.images
      .map((url) => {
        const parts = url.split("product-images/");
        return parts.length > 1 ? parts[1] : null;
      })
      .filter(Boolean);

    if (paths.length > 0) {
      await supabase.storage.from("product-images").remove(paths);
    }
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) throw error;
}
