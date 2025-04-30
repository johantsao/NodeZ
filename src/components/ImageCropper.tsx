'use client'

import Cropper from 'react-easy-crop'
import { useState, useCallback, useEffect } from 'react'
import cropImage from '@/utils/cropImage'

interface ImageCropperProps {
  image: string
  onCropped: (blob: Blob | null) => void
}

export default function ImageCropper({ image, onCropped }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_: any, croppedArea: any) => {
    setCroppedAreaPixels(croppedArea)
  }, [])

  useEffect(() => {
    if (!image || !croppedAreaPixels) return
    cropImage(image, croppedAreaPixels).then(onCropped)
  }, [image, croppedAreaPixels, onCropped])

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden bg-black border border-white/20 mb-4">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={16 / 9}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  )
}
