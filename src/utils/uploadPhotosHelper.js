import api from './api'
import convertToBase64 from './fileToBase64'

const saveImages = async function (images) {
  let imageIds = []
  for (const base64Image in images) {
    try {
      let savedImage = await api
        .post('pictures', { image: images[base64Image] })
        .catch((error) => console.log(error))
      imageIds.push(savedImage.id)
      console.log('Снимката беше запазена')
    } catch (_) {
      console.log('Снимката не беше запазена!')
    }
  }

  return imageIds
}

const convertImagesToBase64 = async function (images) {
  return await Promise.all(
    images.map(async (image) => {
      return await convertToBase64(image)
    })
  )
}

export { convertImagesToBase64, saveImages }
