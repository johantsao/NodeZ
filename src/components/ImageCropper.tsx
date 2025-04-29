'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImage'

interface ImageCropperProps {
  file: File
  onComplete: (croppedFile: File) => void
  onCancel: () => void
}

export default function ImageCropper({ file, onComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    const croppedFile = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels)
    onComplete(croppedFile)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-md h-96 bg-gray-800 rounded-lg overflow-hidden">
        <Cropper
          image={URL.createObjectURL(file)}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={handleCrop} className="bg-blue-500 px-4 py-2 rounded font-bold text-white hover:bg-blue-600">
          確認裁切
        </button>
        <button onClick={onCancel} className="bg-gray-400 px-4 py-2 rounded font-bold text-black hover:bg-gray-500">
          取消
        </button>
      </div>
    </div>
  )
}
