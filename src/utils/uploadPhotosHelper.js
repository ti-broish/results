import { ValidationError } from './ValidationError'
import api from './api'

export const saveImages = async function (images) {
  let imageIds = []
  const byteSize = (str) => new Blob([str]).size
  for (const image in images) {
    const base64image = images[image].getFileEncodeDataURL()
    const imageMB = byteSize(base64image) / Math.pow(1024, 2)
    if (Math.round(imageMB) > 50) {
      throw new ValidationError(
        `Размерът на файла ${images[image].file.name}  е твърде голям`
      )
    }
    let savedImage
    try {
      savedImage = await api.post('pictures', {
        image: base64image,
      })
    } catch (e) {
      throw new ValidationError('Възникна грешка при качването на снимките')
    }
    imageIds.push(savedImage.id)
  }

  return imageIds
}
