export async function uploadToCloudinary(file: File) {
  const url = `https://api.cloudinary.com/v1_1/dx0puhrks/image/upload`;
  const preset = 'public_upload';

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("✅ Cloudinary upload success:", data);
    return data.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    throw err;
  }
}