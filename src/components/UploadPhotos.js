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
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import imageCompression from 'browser-image-compression'
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
)

const PREVIEW_MAX_WIDTH = 150
const PREVIEW_MAX_HEIGHT = 350

const FilePondContainer = styled.div`
  @keyframes hideAnimation {
    to {
      opacity: 0;
    }
  }
  .filepond--image-preview {
    background-color: #fff;
  }
  .filepond--file-wrapper {
    min-height: 50px;
  }
  .filepond--drop-label,
  .filepond--file-wrapper {
    cursor: pointer;
  }
  .filepond--image-preview-wrapper,
  .filepond--item-panel {
    border-radius: 0 !important;
  }
  .filepond--file-info-main,
  .filepond--file-info-sub,
  .filepond--file-status-sub {
    display: none;
  }
  .filepond--file-status-main {
    animation: hideAnimation 1s ease-out 5s;
    animation-fill-mode: forwards;
  }
  .filepond--image-preview-overlay-success {
    color: rgb(0, 0, 0, 0.5);
  }
  .filepond--file-action-button {
    cursor: pointer;
  }
  .filepond--item {
    width: calc(50% - 0.5em);
  }
  .filepond--label-action {
    padding: 30px 100px;
  }
`

const uploadImage =
  (executeRecaptcha) =>
  async (
    fieldName,
    file,
    metadata,
    load,
    error,
    progress,
    abort,
    transfer,
    options
  ) => {
    const abortController = new AbortController()
    const compressionOptions = {
      maxSizeMB: 2,
      maxWidthOrHeight: 4000,
      useWebWorker: false,
      libUrl:
        process.env.NODE_ENV === 'production'
          ? `${process.env.PUBLIC_URL}/browserCompression.2382d07deff11def95b8.js`
          : '/browserCompression.js',
    }
    try {
      const compressedFile = await imageCompression(file, compressionOptions)
      const reader = new FileReader()

      reader.readAsDataURL(compressedFile)
      reader.onload = async () => {
        const encodedDataURL = reader.result
        const savedImage = await api.post(
          'pictures',
          {
            image: encodedDataURL,
          },
          {
            signal: abortController.signal,
            headers: executeRecaptcha
              ? {
                  'x-recaptcha-token': await executeRecaptcha(
                    'sendProtocolImage'
                  ),
                }
              : {},
          }
        )
        load(savedImage.id)

        reader.onerror = () => {
          error('Възникна грешка при качването на снимките')
        }
        load(savedImage.id)
      }
    } catch (error) {
      console.log(error)
      error('Възникна грешка при качването на снимките')
    }

    return {
      abort: () => {
        abortController.abort()
        abort()
      },
    }
  }

const compareFiles = (a, b) => {
  if (!(a.file && b.file)) {
    return 0
  }
  return a.filename.localeCompare(b.filename)
}

export default function UploadPhotos({ files, callback, isRequired }) {
  const { executeRecaptcha } = process.env.GOOGLE_RECAPTCHA_KEY
    ? useGoogleReCaptcha()
    : { executeRecaptcha: null }
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
        labelFileProcessing="Качване..."
        labelFileProcessingComplete="Готово"
        fileValidateTypeLabelExpectedTypes="Очаквани файлове: {allButLastType} или {lastType}"
        required={isRequired}
        onupdatefiles={callback}
        acceptedFileTypes={['image/png', 'image/jpeg']}
        allowMultiple={true}
        maxParallelUploads={4}
        checkValidity={true}
        itemInsertInterval={15}
        itemInsertLocation={compareFiles}
        name="files"
        labelIdle='<span class="filepond--label-action">Качи снимки</span>'
        credits={false}
        server={{ process: uploadImage(executeRecaptcha) }}
      />
    </FilePondContainer>
  )
}
