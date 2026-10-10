import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ComplaintImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(null);

  if (!images.length) return null;

  return (
    <>
      <div className="complaint-image-gallery">
        {images.map((item, index) => (
          <button
            key={item.id || index}
            type="button"
            className="complaint-image-thumb"
            onClick={() => setSelected(index)}
          >
            <img
              src={item.image_url || item.image}
              alt={`Complaint evidence ${index + 1}`}
            />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="image-lightbox" onClick={() => setSelected(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <button
            type="button"
            className="lightbox-nav left"
            onClick={e => {
              e.stopPropagation();
              setSelected((selected - 1 + images.length) % images.length);
            }}
          >
            <ChevronLeft />
          </button>
          <img
            className="lightbox-image"
            src={images[selected].image_url || images[selected].image}
            alt={`Complaint evidence ${selected + 1}`}
            onClick={e => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav right"
            onClick={e => {
              e.stopPropagation();
              setSelected((selected + 1) % images.length);
            }}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
