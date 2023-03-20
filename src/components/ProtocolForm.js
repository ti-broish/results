import styled from 'styled-components'
import React, { useState } from 'react'
import api from '../utils/api'
import UploadPhotos from './UploadPhotos'
import { saveImages } from '../utils/uploadPhotosHelper'
import { ValidationError } from '../utils/ValidationError'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const ProtocolFormStyle = styled.form`
  .errorMsg {
    color: red;
  }

  textarea {
    width: 80%;
    height: 50px;
    padding: 20px;
    margin-left: 5px;
    margin-bottom: 10px;
  }

  input[type='radio'] {
    margin: 5px;
    vertical-align: middle;
  }

  .inputLabel {
    display: block;
    margin-left: 5px;
    padding: 5px;
  }

  input[type='text'] {
    width: 80%;
    font-size: 18px;
    padding: 20px;
    border: 1px solid #eee;
    margin: 20px 0;
    box-sizing: border-box;
    margin-left: 5px;
  }

  .successfulMessage {
    color: green;
  }

  .unsuccessfulMessage {
    color: red;
  }
`
export const ProtocolForm = () => {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handlePhotoUpload = (files) => {
    setFiles(files)
  }
  const reset = () => {
    setFiles([])
    setError(null)
    setIsSubmitted(false)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (files.length < 4) {
        throw new ValidationError('Качете поне 4 снимки')
      }
      const savedImageIds = await saveImages(files)
      const body = {
        pictures: savedImageIds,
      }
      const recaptchaToken = await executeRecaptcha('sendProtocol')
      void (await api.post('protocols', body, {
        headers: { 'x-recaptcha-token': recaptchaToken },
      }))
      setError(null)
      setFiles([])
    } catch (e) {
      let err = e
      if (
        err.response &&
        err.response.status >= 400 &&
        err.response.status < 500
      ) {
        err = new ValidationError(err.response.data.message)
      } else if (!(err instanceof ValidationError)) {
        err = new Error(
          'Възникна неочаквана грешка. Моля опитайте отново по-късно.'
        )
      }

      setError(err)
    }
    setIsSubmitted(true)
  }

  return (
    <ProtocolFormStyle onSubmit={handleSubmit}>
      {' '}
      <div>
        {!isSubmitted ? (
          <>
            <h1>Изпрати протокол</h1>
            <UploadPhotos
              files={files}
              callback={handlePhotoUpload}
              isRequired={true}
            ></UploadPhotos>
            <div className="form-control">
              <label></label>
              <button type="submit">Изпрати протокол</button>
            </div>
          </>
        ) : error === null ? (
          <>
            <p className="successfulMessage">
              Протоколът ви беше изпратен успешно!
            </p>
            <button onClick={reset}>Изпрати друг протокол</button>
          </>
        ) : (
          <p className="unsuccessfulMessage">{error.message}</p>
        )}
      </div>
    </ProtocolFormStyle>
  )
}
