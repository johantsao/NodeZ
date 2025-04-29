// src/utils/cropImage.ts
export default async function cropImage(imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<Blob | null> {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => {
      image.onload = resolve
    })
  
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
  
    if (!ctx) return null
  
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
  
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg')
    })
  }
  