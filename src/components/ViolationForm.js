import { useForm, FormProvider } from 'react-hook-form'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import UploadPhotos from './UploadPhotos'
import { SectionSelector } from './sectionSelector/SectionSelector'
import api from '../utils/api'
import { ROUTES } from './routes'
import { Link, LinkButton } from './components/Link'
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
    phoneNumber: yup
      .string()
      .transform((input) =>
        /^0[1-9][0-9]{8}/.test(input)
          ? input.replace(/^0(.+)/, '+359$1')
          : /^0{0,2}359[1-9][0-9]{8}/.test(input)
          ? input.replace(/^0{0,2}359(.+)/, '+359$1')
          : input
      )
      .required(requiredMessage),
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
  const { executeRecaptcha } = process.env.GOOGLE_RECAPTCHA_KEY
    ? useGoogleReCaptcha()
    : { executeRecaptcha: null }
  const methods = useForm({ resolver: yupResolver(schema) })
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
    reset,
  } = methods
  const [key, setKey] = useState(0)
  const [files, setFiles] = useState([])
  const [violation, setViolation] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  const resetEverything = () => {
    reset()
    setError(null)
    setFiles([])
    setKey(key + 1)
    setIsSubmitted(false)
  }

  const onSubmit = async (data) => {
    try {
      const savedImageIds = files.map((file) => file.serverId)
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
          headers: executeRecaptcha
            ? { 'x-recaptcha-token': await executeRecaptcha('sendViolation') }
            : {},
        })
      )
      reset()
      setError(null)
      setFiles([])
      setKey(key + 1)
      setIsSubmitted(true)
    } catch (error) {
      setIsSubmitted(false)
      setError(error)
    }
  }

  return (
    <FormProvider {...methods}>
      {!isSubmitted ? (
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
          <Input
            name="name"
            required={true}
            label="Име"
            register={register}
            errors={errors}
          />
          <Input
            name="email"
            required={true}
            label="Имейл"
            type="email"
            autoComplete="email"
            pattern="^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
            title="Въведете валиден имейл адрес"
            register={register}
            errors={errors}
          />
          <Input
            name="phoneNumber"
            required={true}
            label="Телефон"
            type="tel"
            placeholder="+359888888888"
            pattern="^(\+(?:[0-9] ?){6,14}[0-9]|0[1-9][0-9]{8}|0{0,2}359[1-9][0-9]{8})$"
            title="Tелефонният номер трябва да бъде започва с +359 или 0"
            register={register}
            errors={errors}
          />
          <Textarea
            name="description"
            required={true}
            minLength={20}
            pattern=".{20,}"
            label="Описание на нарушението"
            title="Моля въведете поне 20 символа за описание на нарушението"
            register={register}
            errors={errors}
          />
          <UploadPhotos
            name="photoUpload"
            callback={setFiles}
            isRequired={false}
          ></UploadPhotos>
          <Button type="submit">Изпрати</Button>
          {error && (
            <div>
              <p className="unsuccessfulMessage">
                Сигналът Ви не беше изпратен!{' '}
                {error?.response?.data?.message || error.message}
              </p>
            </div>
          )}
        </CommentFormStyle>
      ) : (
        <div>
          <p className="successfulMessage">
            Сигналът Ви беше изпратен успешно!
          </p>
          <div>
            <LinkButton
              to={ROUTES.violation.replace(':violationId', violation.id)}
            >
              Вижте сигнала
            </LinkButton>
          </div>
          <div className="form-control">
            <Button onClick={resetEverything}>Изпрати друг сигнал</Button>
          </div>
        </div>
      )}
    </FormProvider>
  )
}
