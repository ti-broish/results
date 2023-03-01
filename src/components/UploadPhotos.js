import { useFormContext } from 'react-hook-form'

export default function UploadPhotos() {
  const methods = useFormContext()

  return (
    <div>
      <input name="photoUpload" type="file" {...methods.register('file')} />
    </div>
  )
}
