/**
 * Client-side image compression & optimization utility.
 * Compresses heavy camera/phone photos before storage or network upload.
 * Reduces 5MB-10MB files to ~150KB-250KB high-quality web JPEGs.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  file: File;
  width: number;
  height: number;
  originalSizeKb: number;
  optimizedSizeKb: number;
}

export async function compressImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<OptimizedImageResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    // If it's an SVG or already a tiny image (< 80KB), we can use it as is
    if (file.type === 'image/svg+xml' || (file.size < 80 * 1024 && file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          dataUrl,
          file,
          width: 0,
          height: 0,
          originalSizeKb,
          optimizedSizeKb: originalSizeKb,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original
        resolve({
          dataUrl: img.src,
          file,
          width,
          height,
          originalSizeKb,
          optimizedSizeKb: originalSizeKb,
        });
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG with specified quality
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const optimizedSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

      // Convert canvas to File object
      canvas.toBlob(
        (blob) => {
          const optimizedFile = blob
            ? new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
            : file;

          resolve({
            dataUrl,
            file: optimizedFile,
            width,
            height,
            originalSizeKb,
            optimizedSizeKb,
          });
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      // Fallback: read directly as data URL
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => {
        resolve({
          dataUrl: fallbackReader.result as string,
          file,
          width: 0,
          height: 0,
          originalSizeKb,
          optimizedSizeKb: originalSizeKb,
        });
      };
      fallbackReader.readAsDataURL(file);
    };

    reader.readAsDataURL(file);
  });
}
