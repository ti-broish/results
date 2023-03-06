import api from './api'
import convertToBase64 from './fileToBase64'

const saveImages = async function (images) {
  let imageIds = []
  const byteSize = (str) => new Blob([str]).size
  for (const base64Image in images) {
    const imageMB = byteSize(images[base64Image]) / Math.pow(1024, 2)
    try {
      if (Math.round(imageMB) > 50) {
        throw new Error('Размерът на файла е твърде голям')
      }
      let savedImage = await api.post('pictures', {
        image: images[base64Image],
      })
      imageIds.push(savedImage.id)
    } catch (error) {
      console.error(error)
    }
  }

  return imageIds
}

const convertImagesToBase64 = async function (images) {
  const imageArray = Array.from(images)
  return await Promise.all(
    imageArray.map(async (image) => {
      return await convertToBase64(image)
    })
  )
}

export { convertImagesToBase64, saveImages }
