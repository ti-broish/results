import styled from 'styled-components'
import React, { useState } from 'react'
import api from '../utils/api'
import UploadPhotos from './UploadPhotos'
import { saveImages } from '../utils/uploadPhotosHelper'
import { ValidationError } from '../utils/ValidationError'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const IMAGES_MIN_COUNT = 4

const ProtocolFormStyle = styled.div`
  min-height: 50vh;

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
  const [protocol, setProtocol] = useState(null)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handlePhotoUpload = (files) => {
    setFiles(files)
  }
  const reset = () => {
    setFiles([])
    setError(null)
    setEmail('')
    setIsSubmitted(false)
    setIsEmailSent(false)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (files.length < IMAGES_MIN_COUNT) {
        throw new ValidationError('Качете поне 4 снимки')
      }
      const savedImageIds = await saveImages(files)
      const body = {
        pictures: savedImageIds,
      }
      setProtocol(
        await api.post('protocols', body, {
          headers: {
            'x-recaptcha-token': await executeRecaptcha('sendProtocol'),
          },
        })
      )
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

  const sendProtocolEmail = async (event) => {
    console.log(event)
    event.preventDefault()
    if (!protocol?.id || !email) {
      throw new Error('Няма протокол или имейл')
    }
    void (await api.patch(
      `protocols/${protocol.id}/contact`,
      { email, secret: protocol.secret },
      {
        headers: {
          'x-recaptcha-token': await executeRecaptcha('sendProtocolEmail'),
        },
      }
    ))
    setIsEmailSent(true)
  }

  return (
    <ProtocolFormStyle>
      {' '}
      <div>
        {!isSubmitted ? (
          <>
            <h1>Изпрати протокол</h1>
            <form onSubmit={handleSubmit}>
              <UploadPhotos
                files={files}
                callback={handlePhotoUpload}
                isRequired={true}
              ></UploadPhotos>
              {files.length >= IMAGES_MIN_COUNT && (
                <div className="form-control">
                  <button type="submit">Изпрати протокол</button>
                </div>
              )}
            </form>
          </>
        ) : error === null ? (
          <>
            <p className="successfulMessage">
              Протоколът ви беше изпратен успешно!
            </p>
            {!isEmailSent && (
              <div>
                <form onSubmit={sendProtocolEmail}>
                  <div className="form-control">
                    <label>
                      <span className="inputLabel">Имейл</span>
                      <input
                        type="email"
                        required={true}
                        value={email}
                        pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                        title="Въведете валиден имейл адрес"
                        placeholder="Въведете имейл, за да можем да ви известим при проблем със снимките"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <button type="submit">Изпрати имейл</button>
                  </div>
                </form>
              </div>
            )}
            <div className="form-control">
              <button onClick={reset}>Изпрати друг протокол</button>
            </div>
          </>
        ) : (
          <p className="unsuccessfulMessage">{error.message}</p>
        )}
      </div>
    </ProtocolFormStyle>
  )
}
