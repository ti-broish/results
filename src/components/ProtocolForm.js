import { useForm, FormProvider } from 'react-hook-form'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import UploadPhotos from './UploadPhotos'
import { saveImages, convertImagesToBase64 } from '../utils/uploadPhotosHelper'

const ProtocolFormStyle = styled.form`
  width: 100%;

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
  const methods = useForm()
  const [message, setMessage] = useState('')

  const onSubmit = async (data) => {
    const convertedImages = await convertImagesToBase64(data.file)
    const savedImageIds = await saveImages(convertedImages)
    const body = {
      pictures: savedImageIds,
    }
    try {
      if (savedImageIds.length < 4) {
        throw new Error('Качете поне 4 снимки')
      }
      void (await api.post('protocols', body))
      setMessage('Протоколът ви беше изпратен успешно!')
    } catch (error) {
      console.error(error)
      setMessage('Протоколът ви не беше изпратен!')
    }
  }

  return (
    <FormProvider {...methods}>
      <ProtocolFormStyle onSubmit={methods.handleSubmit(onSubmit)}>
        {' '}
        <div>
          <h1>Изпрати протокол</h1>
          <UploadPhotos></UploadPhotos>
          <div className="form-control">
            <label></label>
            <button type="submit">Изпрати протокол</button>
          </div>
        </div>
        {message && (
          <div>
            {!message.includes('не') ? (
              <p className="successfulMessage">{message}</p>
            ) : (
              <p className="unsuccessfulMessage">{message}</p>
            )}
          </div>
        )}
      </ProtocolFormStyle>
    </FormProvider>
  )
}
