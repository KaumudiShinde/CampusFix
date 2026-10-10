import React, { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

export default function MultiImageUploader({ value = [], onChange }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const next = value.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => {
      next.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, [value]);

  function addImages(e) {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(file =>
      file.type.startsWith("image/") &&
      file.size <= MAX_SIZE
    );
    onChange([...value, ...valid].slice(0, MAX_IMAGES));
    e.target.value = "";
  }

  function removeImage(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="multi-image-uploader">
      <label className="image-upload-box">
        <ImagePlus size={22} />
        <strong>Add complaint photos</strong>
        <span>JPG, PNG or WebP · max 5 MB each · max 5 images</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={addImages}
          hidden
        />
      </label>
      {previews.length > 0 && (
        <div className="image-preview-grid">
          {previews.map((item, index) => (
            <div className="image-preview" key={index}>
              <img src={item.url} alt={`Evidence ${index + 1}`} />
              <button
                type="button"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <small>{value.length}/{MAX_IMAGES} images selected</small>
    </div>
  );
}
