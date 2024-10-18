'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, Upload } from 'lucide-react'

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null
  onPhotoSelect: (file: File) => void
}

export default function ProfilePhotoUpload({ currentPhotoUrl, onPhotoSelect = (file: File) => {} }: ProfilePhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(currentPhotoUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploadingPhoto(true)
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleFile = (file: File) => {
    try {
      setPreviewUrl(URL.createObjectURL(file))
      onPhotoSelect(file)
    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-40 h-40 rounded-full overflow-hidden border-4 ${
          dragActive ? 'border-primary' : 'border-gray-200'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {currentPhotoUrl ? (
          <Image
            src={currentPhotoUrl}
            alt="Profile photo"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          aria-label="Upload profile photo"
        />
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${
            dragActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
          }`}
        >
          <Upload className="w-12 h-12 text-white" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {currentPhotoUrl ? 'Change Photo' : 'Upload Photo'}
         {isUploadingPhoto && <Loader2 className='size-4 animate-spin' />}
      </button>
    </div>
  )
}