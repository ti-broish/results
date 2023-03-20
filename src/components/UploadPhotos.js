import React from 'react'
import styled from 'styled-components'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
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
  /* Style the individual items */
  .filepond--item {
    width: calc(50% - 0.5em);
  }
`

export default function UploadPhotos({ files, callback, isRequired }) {
  return (
    <FilePondContainer>
      {' '}
      <FilePond
        files={files}
        stylePanelLayout="compact"
        styleLoadIndicatorPosition="center bottom"
        styleProgressIndicatorPosition="center bottom"
        imagePreviewTransparencyIndicator="grid"
        imagePreviewMaxHeight={PREVIEW_MAX_HEIGHT}
        imagePreviewMaxWidth={PREVIEW_MAX_WIDTH}
        imagePreviewMarkupShow={false}
        labelFileTypeNotAllowed="Невалиден тип файл"
        fileValidateTypeLabelExpectedTypes="Очаквани файлове: {allButLastType} или {lastType}"
        required={isRequired}
        onupdatefiles={callback}
        acceptedFileTypes={['image/png', 'image/jpeg']}
        allowMultiple={true}
        name="files"
        labelIdle='<span class="filepond--label-action">Качи снимки</span>'
        credits={false}
        onaddfilestart={(file) => {
          file.setMetadata('resize', {
            maxHeight: PREVIEW_MAX_HEIGHT,
            maxWidth: PREVIEW_MAX_WIDTH,
          })
        }}
      />
    </FilePondContainer>
  )
}
