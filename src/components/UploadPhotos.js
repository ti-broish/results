import { useFormContext } from 'react-hook-form'
import React from 'react'

export default function UploadPhotos() {
  const methods = useFormContext()

  return (
    <div>
      <input
        name="photoUpload"
        type="file"
        accept="image/*"
        multiple
        {...methods.register('file')}
      />
    </div>
  )
}
