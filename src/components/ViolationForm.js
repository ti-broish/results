import { useForm, FormProvider } from 'react-hook-form'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import UploadPhotos from './UploadPhotos'
import { SectionSelector } from './sectionSelector/SectionSelector'
import api from '../utils/api'
import { saveImages } from '../utils/uploadPhotosHelper'
import { ROUTES } from './routes'
import { Link } from './components/Link'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Textarea } from './components/Textarea'

const CommentFormStyle = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  .errorMsg {
    color: red;
  }
  input[type='radio'] {
    margin: 5px;
    vertical-align: middle;
  }
  .successfulMessage {
    color: green;
  }
  .unsuccessfulMessage {
    color: red;
  }
`
const requiredMessage = 'Полето е задължително.'
const schema = yup
  .object({
    name: yup.string().required(requiredMessage),
    email: yup
      .string()
      .email('Въведете валиден имейл')
      .required(requiredMessage),
    phoneNumber: yup.string().required(requiredMessage),
    description: yup
      .string()
      .min(20, 'Моля въведете поне 20 символа')
      .required(requiredMessage),
    electionRegion: yup.string().required(requiredMessage),
    municipality: yup.string().required(requiredMessage),
    town: yup.number().required(requiredMessage),
    cityRegion: yup.string(),
    section: yup.string(),
    isAbroad: yup.boolean(),
    country: yup.string().when('isAbroad', {
      is: true,
      then: (x) => x.required(requiredMessage),
    }),
  })
  .required()

export const ViolationForm = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const methods = useForm({ resolver: yupResolver(schema) })
  const {
    formState: { errors, isSubmitSuccessful },
    formState,
    register,
    setValue,
    handleSubmit,
    reset,
  } = methods
  const [message, setMessage] = useState('')
  const [key, setKey] = useState(0)
  const [files, setFiles] = useState([])
  const [violation, setViolation] = useState(null)

  const handlePhotoUpload = (files) => {
    setFiles(files)
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
      setKey(key + 1)
    }
  }, [formState, reset])

  useEffect(() => {
    if (!violation) {
      return
    }
    try {
      const violations = JSON.parse(localStorage.getItem('violations')) || []
      violations.push({
        id: violation.id,
        secret: violation.secret,
        timestamp: new Date().getTime(),
      })
      localStorage.setItem('violations', JSON.stringify(violations))
    } catch (e) {
      // disallowed cookies prevent access to local storage in some browsers
      return
    }
  }, [violation])

  const onSubmit = async (data) => {
    try {
      const savedImageIds = await saveImages(files)
      const body = {
        description: data.description,
        town: parseInt(data.town, 10),
        name: data.name,
        email: data.email,
        phone: data.phoneNumber,
      }
      data.section ? (body['section'] = data.section) : body
      savedImageIds ? (body['pictures'] = savedImageIds) : body
      const recaptchaToken = await executeRecaptcha('sendViolation')
      setViolation(
        await api.post('violations', body, {
          headers: { 'x-recaptcha-token': recaptchaToken },
        })
      )
      setMessage('Сигналът Ви беше изпратен успешно!')
    } catch (error) {
      setMessage(
        `Сигналът Ви не беше изпратен! ${
          error?.response?.data?.message || error.message
        }`
      )
    }
  }

  return (
    <FormProvider {...methods}>
      <CommentFormStyle onSubmit={handleSubmit(onSubmit)}>
        <Link to={ROUTES.submit}>
          <small>⟵ обратно</small>
        </Link>
        <h1>Подай сигнал</h1>
        <SectionSelector
          key={key}
          errors={errors}
          register={register}
          setValue={setValue}
        />
        <Input name="name" label="Име" register={register} errors={errors} />
        <Input
          name="email"
          label="Имейл"
          type="email"
          register={register}
          errors={errors}
        />
        <Input
          name="phoneNumber"
          label="Телефон"
          type="tel"
          register={register}
          errors={errors}
        />
        <Textarea
          name="description"
          label="Описание на нарушението"
          register={register}
          errors={errors}
        />
        <UploadPhotos
          name="photoUpload"
          callback={handlePhotoUpload}
          isRequired={false}
        ></UploadPhotos>
        <Button type="submit">Изпрати</Button>
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
