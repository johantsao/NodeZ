'use client'

import Cropper from 'react-easy-crop'
import { useState } from 'react'

interface ImageCropperProps {
  image: string
  onCropped: (croppedBlob: Blob | null) => void
}

export default function ImageCropper({ image, onCropped }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
    // 等你按下「裁切」按鈕時，再在外部呼叫 cropImage
  }

  return (
    <div className="relative w-full h-[300px] bg-black">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={16 / 9}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
  )
}
