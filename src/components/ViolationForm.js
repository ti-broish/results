import { useForm, FormProvider } from 'react-hook-form'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SectionSelector from './SectionSelector'

const CommentFormStyle = styled.form`
  width: 100%;

  .errorMsg {
    color: red;
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
`

export default function ViolationForm() {
  const methods = useForm()
  const {
    formState: { errors },
  } = methods
  const [electionRegions, setElectionRegions] = useState([])
  const [selectedElectionRegion, setSelectedElectionRegion] = useState('')
  const [selectedMunicipality, setSelectedMunicipality] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedTown, setSelectedTown] = useState(0)
  const [selectedCityRegion, setSelectedCityRegion] = useState('')
  const [towns, setTowns] = useState([])

  const api_endpoint = process.env.DATA_URL

  useEffect(() => {
    setSelectedCountry(methods.getValues('countryField'))
    axios
      .get(`${api_endpoint}/election_regions`)
      .then((res) => setElectionRegions(res.data))
  }, [])

  useEffect(() => {
    if (selectedElectionRegion != '') {
      getMunicipalities(selectedElectionRegion)
    }
    if (selectedElectionRegion != '' && selectedMunicipality != '') {
      const countryCode = selectedCountry == 'Bulgaria' ? '00' : null
      axios
        .get(
          `${api_endpoint}/towns?country=${countryCode}&election_region=${selectedElectionRegion}&municipality=${selectedMunicipality}`
        )
        .then((res) => setTowns(res.data))
        .catch((err) => console.log(err))
    }
  }, [selectedElectionRegion, selectedMunicipality])

  const getElectionRegions = () => {
    return electionRegions.map((election_region) => {
      return (
        <option key={election_region.code} value={election_region.code}>
          {election_region.name}
        </option>
      )
    })
  }

  const getMunicipalities = (selectedElectionRegion) => {
    const filteredRegions = electionRegions.filter(
      (electionRegion) => electionRegion.code == selectedElectionRegion
    )
    const municipalities = []
    filteredRegions[0].municipalities.forEach((municipality) => {
      municipalities.push(municipality)
    })
    return municipalities.map((municipality) => {
      return (
        <option key={municipality.code} value={municipality.code}>
          {municipality.name}
        </option>
      )
    })
  }

  const createTownOptions = () => {
    return towns.map((town) => {
      return (
        <option id={town.code} key={town.code} value={town.id}>
          {town.name}
        </option>
      )
    })
  }

  const getTownById = (id) => {
    const town = towns.filter((town) => town.id == id)
    return town
  }

  const getCityRegions = () => {
    const city_regions = []
    getTownById(selectedTown)[0].cityRegions.forEach((city_region) => {
      city_regions.push(city_region)
    })
    return city_regions.map((city_region) => {
      return (
        <option
          id={city_region.code}
          key={city_region.code}
          value={city_region.code}
        >
          {city_region.name}
        </option>
      )
    })
  }

  const onSubmit = (data) => {
    const body = {
      description: data.description,
      town: Number(data.town),
    }
    data.section ? (body['section'] = data.section) : body
    axios
      .post(`${api_endpoint}/violations`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
  }

  return (
    <FormProvider {...methods}>
      <CommentFormStyle onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="form-control">
          <label>Секция в:</label>
          <div>
            <input
              type="radio"
              id="fieldBg"
              value="Bulgaria"
              name="countryField"
              {...methods.register('countryField', { required: false })}
              onChange={(e) => setSelectedCountry(e.target.value)}
              checked
            />
            <label className="radioLabel" for="fieldBg">
              България
            </label>
            <input
              type="radio"
              id="fieldForeign"
              value="Foreign"
              name="countryField"
              {...methods.register('countryField', { required: false })}
              onChange={(e) => setSelectedCountry(e.target.value)}
            />
            <label className="radioLabel" for="fieldForeign">
              Чужбина
            </label>
          </div>
        </div>
        <div>
          <label className="inputLabel">МИР</label>
        </div>
        <div>
          <select
            className="form-control"
            name="electionRegion"
            {...methods.register('electionRegion', { required: true })}
            onChange={(e) => {
              setSelectedElectionRegion(e.target.value)
              setSelectedMunicipality('')
              setSelectedTown('')
              methods.resetField('municipality')
              methods.resetField('town')
              methods.resetField('section')
            }}
          >
            <option value="" disabled selected="selected">
              -- МИР --
            </option>
            {getElectionRegions()}
          </select>
          {errors.electionRegion &&
            errors.electionRegion.type === 'required' && (
              <p className="errorMsg">Полето е задължително.</p>
            )}
        </div>
        <div>
          <label className="inputLabel">Община</label>
        </div>
        <div>
          <select
            className="form-control"
            name="municipality"
            {...methods.register('municipality', { required: true })}
            onChange={(e) => {
              setSelectedMunicipality(e.target.value)
              setSelectedTown(0)
              methods.resetField('town')
              methods.resetField('section')
            }}
          >
            {selectedElectionRegion != '' ? (
              <>
                <option value="" disabled selected="selected">
                  -- Община --
                </option>
                {getMunicipalities(selectedElectionRegion)}
              </>
            ) : (
              <option value="" disabled selected="selected">
                -- Община --
              </option>
            )}
          </select>
          {errors.municipality && errors.municipality.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div>
          <label className="inputLabel">Град/село</label>
        </div>
        <div>
          <select
            className="form-control"
            name="town"
            {...methods.register('town', { required: true })}
            onChange={(e) => {
              setSelectedTown(e.target.value)
              methods.resetField('section')
            }}
          >
            <>
              <option value="" disabled selected="selected">
                -- Градове --
              </option>
              {towns.length != 0 ? createTownOptions() : null}
            </>
          </select>
          {errors.town && errors.town.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div>
          {selectedTown ? (
            getTownById(selectedTown)[0].cityRegions.length != 0 ? (
              <div>
                <label className="inputLabel">Район</label>
                <select
                  className="form-control"
                  name="city_region"
                  {...methods.register('city_region', { required: true })}
                  onChange={(e) => setSelectedCityRegion(e.target.value)}
                >
                  <option value="" disabled selected="selected">
                    -- Райони --
                  </option>
                  {getCityRegions()}
                </select>
              </div>
            ) : (
              <div></div>
            )
          ) : (
            <div></div>
          )}
        </div>
        <div>
          {selectedTown || selectedCityRegion ? (
            <div>
              <label className="inputLabel">Номер на секция</label>

              <SectionSelector
                name="section"
                town={selectedTown}
                city_region={
                  selectedCityRegion != '' ? selectedCityRegion : undefined
                }
              />
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div className="form-control">
          <label className="inputLabel">Име</label>
          <input
            type="text"
            name="name"
            {...methods.register('name', { required: true })}
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
            {...methods.register('email', {
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
            {...methods.register('phoneNumber', { required: true })}
          />
          {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div className="form-control">
          <label className="inputLabel">Описание на нарушението</label>
          <input
            type="text"
            name="description"
            {...methods.register('description', { required: true })}
          />
          {errors.name && errors.name.type === 'required' && (
            <p className="errorMsg">Полето е задължително.</p>
          )}
        </div>
        <div className="form-control">
          <label></label>
          <button type="submit">Изпрати сигнал</button>
        </div>
      </CommentFormStyle>
    </FormProvider>
  )
}
