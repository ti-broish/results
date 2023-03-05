import { useForm, FormProvider } from 'react-hook-form'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { SectionSelector } from './sectionSelector/SectionSelector'
import UploadPhotos from './UploadPhotos'
import { saveImages, convertImagesToBase64 } from '../utils/uploadPhotosHelper'

const CommentFormStyle = styled.form`
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
    margin-top: 10px;
    margin-left: 5px;
    padding: 5px;
  }
  input[type='text'] {
    width: 80%;
    font-size: 18px;
    padding: 10px;
    border: 1px solid #eee;
    margin-bottom: 10px;
    box-sizing: border-box;
    margin-left: 5px;
  }
  select {
    margin-left: 5px;
    padding: 5px;
  }
  .successfulMessage {
    color: green;
  }
  .unsuccessfulMessage {
    color: red;
  }
  button {
    padding: 10px;
    margin: 20px 5px;
  }
`

export const ViolationForm = () => {
  const methods = useForm()
  const {
    formState: { errors },
    formState,
    register,
    reset,
  } = methods
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        isAbroad: '',
        electionRegion: '',
        country: '',
        municipality: '',
        town: '',
        city_region: '',
        section: '',
        name: '',
        email: '',
        phoneNumber: '',
        description: '',
        file: '',
      })
    }
  }, [formState, reset])

  const onSubmit = async (data) => {
    const convertedImages = await convertImagesToBase64(data.file)
    const savedImageIds = await saveImages(convertedImages)
    const body = {
      description: data.description,
      town: parseInt(data.town, 10),
    }
    data.section ? (body['section'] = data.section) : body
    savedImageIds ? (body['pictures'] = savedImageIds) : body
    try {
      void (await api.post('violations', body))
      setMessage('Сигналът ви беше изпратен успешно!')
    } catch (_) {
      setMessage('Сигналът ви не беше изпратен!')
    }
  }

  return (
    <FormProvider {...methods}>
      <CommentFormStyle onSubmit={methods.handleSubmit(onSubmit)}>
        <SectionSelector errors={errors} register={register} />
        <div className="form-control">
          <label className="inputLabel">Име</label>
          <input
            type="text"
            name="name"
            {...register('name', { required: true })}
          />
          {errors.name && errors.name.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div className="form-control">
          <label className="inputLabel">Имейл</label>
          <input
            type="text"
            name="email"
            {...register('email', {
              required: true,
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Въведете валиден имейл',
              },
            })}
          />
          {errors.email && errors.email.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
          {errors.email && errors.email.message && (
            <p className="errorMsg">{errors.email.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="inputLabel">Телефон</label>
          <input
            type="text"
            name="phoneNumber"
            {...register('phoneNumber', { required: true })}
          />
          {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div className="form-control">
          <label className="inputLabel">Описание на нарушението</label>
          <textarea
            id="violationText"
            name="description"
            {...register('description', { required: true })}
          />
          {errors.violationText && errors.violationText.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <UploadPhotos name="photoUpload"></UploadPhotos>
        <div className="form-control">
          <label></label>
          <button type="submit">Изпрати сигнал</button>
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
      </CommentFormStyle>
    </FormProvider>
  )
}
