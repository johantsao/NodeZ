export const getCroppedImg = (imageSrc: string, croppedAreaPixels: any): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height
        const ctx = canvas.getContext('2d')
  
        if (!ctx) return reject(new Error('無法取得 Canvas Context'))
  
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        )
  
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error('裁切失敗'))
          }
          const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
          resolve(file)
        }, 'image/jpeg')
      }
      image.onerror = () => reject(new Error('載入圖片失敗'))
    })
  }
  