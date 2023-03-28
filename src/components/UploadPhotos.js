import React from 'react'
import styled from 'styled-components'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import api from '../utils/api'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
)

const PREVIEW_MAX_WIDTH = 150
const PREVIEW_MAX_HEIGHT = 350

const FilePondContainer = styled.div`
  .filepond--image-preview {
    background-color: #fff;
  }
  .filepond--image-preview-wrapper,
  .filepond--item-panel {
    border-radius: 0 !important;
  }
  .filepond--image-preview-overlay,
  .filepond--file-info-main,
  .filepond--file-info-sub {
    display: none;
  }
  /* Style the individual items */
  .filepond--item {
    width: calc(50% - 0.5em);
  }
  .filepond--label-action {
    padding: 30px 100px;
  }
`

const uploadImage = async function (
  fieldName,
  file,
  metadata,
  load,
  error,
  progress,
  abort,
  transfer,
  options
) {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  reader.onload = async () => {
    const encodedDataURL = reader.result
    const byteSize = (str) => new Blob([str]).size
    const imageMB = byteSize(encodedDataURL) / Math.pow(1024, 2)
    if (Math.round(imageMB) > 50) {
      error(`Размерът на файла ${file.name}  е твърде голям`)
      return
    }
    try {
      const savedImage = await api.post('pictures', {
        image: encodedDataURL,
      })
      load(savedImage.id)
    } catch (err) {
      error('Възникна грешка при качването на снимките')
    }
  }

  reader.onerror = () => {
    error('Възникна грешка при качването на снимките')
  }
}

export default function UploadPhotos({ files, callback, isRequired }) {
  return (
    <FilePondContainer>
      {' '}
      <FilePond
        files={files}
        stylePanelLayout="intergrated"
        styleLoadIndicatorPosition="center bottom"
        styleProgressIndicatorPosition="center bottom"
        imagePreviewTransparencyIndicator="#fff"
        imagePreviewMaxHeight={PREVIEW_MAX_HEIGHT}
        imagePreviewMaxWidth={PREVIEW_MAX_WIDTH}
        imagePreviewMarkupShow={false}
        labelFileTypeNotAllowed="Невалиден тип файл"
        labelTapToCancel="Отказ"
        labelButtonRemoveItem="Премахни"
        labelFileLoading="Зареждане..."
        fileValidateTypeLabelExpectedTypes="Очаквани файлове: {allButLastType} или {lastType}"
        required={isRequired}
        onupdatefiles={callback}
        acceptedFileTypes={['image/png', 'image/jpeg']}
        allowMultiple={true}
        name="files"
        labelIdle='<span class="filepond--label-action">Качи снимки</span>'
        credits={false}
        server={{ process: uploadImage }}
      />
    </FilePondContainer>
  )
}
