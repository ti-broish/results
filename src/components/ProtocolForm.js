import styled from 'styled-components'
import React, { useEffect, useRef, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import UploadPhotos, { imagesAreUploaded } from './UploadPhotos'
import api from '../utils/api'
import { ValidationError } from '../utils/ValidationError'
import { ROUTES } from './routes'
import { Link } from './components/Link'
import { Button } from './components/Button'
import { Input } from './components/Input'

const IMAGES_MIN_COUNT = 4

const ProtocolFormStyle = styled.div`
  min-height: 50vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;

  .errorMsg {
    color: red;
  }
`
export const ProtocolForm = () => {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null)
  const { executeRecaptcha } = process.env.GOOGLE_RECAPTCHA_KEY
    ? useGoogleReCaptcha()
    : { executeRecaptcha: null }
  const [protocol, setProtocol] = useState(null)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const submitDisabled = useRef(files.length < IMAGES_MIN_COUNT)
  const [refresh, setRefresh] = useState(false)

  const reset = () => {
    setFiles([])
    setError(null)
    setEmail('')
    setIsSubmitted(false)
    setIsEmailSent(false)
    setProtocol(null)
    submitDisabled.current = true
  }

  useEffect(() => {
    if (!protocol) {
      return
    }
    try {
      const protocols = JSON.parse(localStorage.getItem('protocols')) || []
      protocols.push({
        id: protocol.id,
        secret: protocol.secret,
        timestamp: new Date().getTime(),
      })
      localStorage.setItem('protocols', JSON.stringify(protocols))
    } catch (e) {
      // disallowed cookies prevent access to local storage in some browsers
      return
    }
  }, [protocol])

  const filesUpdatedCallback = (fs) => {
    submitDisabled.current = true
    setFiles(fs)
  }

  const filesReadyCallback = () => {
    // filesReadyCallback is called before files count is updated
    // so we need to compare against IMAGES_MIN_COUNT - 1
    submitDisabled.current = files.length < IMAGES_MIN_COUNT - 1
    setRefresh(!refresh)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      submitDisabled.current = files.length < IMAGES_MIN_COUNT
      if (files.length < IMAGES_MIN_COUNT) {
        throw new ValidationError('Качете поне 4 снимки')
      }
      const savedImageIds = await imagesAreUploaded(files)
      if (savedImageIds instanceof Error) {
        throw savedImageIds
      }
      const body = {
        pictures: savedImageIds,
      }
      setProtocol(
        await api.post('protocols', body, {
          headers: executeRecaptcha
            ? { 'x-recaptcha-token': await executeRecaptcha('sendProtocol') }
            : {},
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
    } finally {
      submitDisabled.current = true
    }
    setIsSubmitted(true)
  }

  const sendProtocolEmail = async (event) => {
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
            <Link to={ROUTES.submit}>
              <small>⟵ обратно</small>
            </Link>
            <h1>Изпрати протокол</h1>
            <form onSubmit={handleSubmit}>
              <UploadPhotos
                files={files}
                callbackFilesUpdated={filesUpdatedCallback}
                callbackFilesReady={filesReadyCallback}
                isRequired={true}
              ></UploadPhotos>
              <div className="form-control">
                {files.length > 0 && files.length < IMAGES_MIN_COUNT && (
                  <>
                    <p>Трябва да снимате целият протокол.</p>
                    <p className="unsuccessfulMessage">
                      Качете поне {IMAGES_MIN_COUNT} снимки, за да изпратите
                      протокол.
                    </p>
                  </>
                )}
                <Button
                  type="submit"
                  disabled={submitDisabled.current}
                  title={`Качете поне ${IMAGES_MIN_COUNT} снимки, за да изпратите протокол`}
                >
                  Изпрати протокол
                </Button>
              </div>
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
                  <Input
                    name="email"
                    label="Имейл"
                    type="email"
                    required={true}
                    value={email}
                    autoComplete="email"
                    pattern="[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*"
                    title="Въведете валиден имейл адрес"
                    placeholder="Имейл адрес"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p>
                    Ако желаете, можете да въведете имейл, за да можем да ви
                    известим при проблем със снимките на протокола
                  </p>
                  <div className="form-control" style={{ margin: '2em 0' }}>
                    <Button type="submit">Изпрати имейл</Button>
                  </div>
                </form>
              </div>
            )}
            <div className="form-control">
              <Button onClick={reset}>Изпрати друг протокол</Button>
            </div>
          </>
        ) : (
          <p className="unsuccessfulMessage">{error.message}</p>
        )}
      </div>
    </ProtocolFormStyle>
  )
}
