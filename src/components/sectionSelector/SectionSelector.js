import React, { useState, useEffect, useRef } from 'react'
import api from '../../utils/api'
import abcSorter from '../../utils/abcSorter'
import DropDown from './DropDown'
import Radios from './Radios'

const DOMESTIC_COUNTRY_CODE = '000'

const fetchData = async (cache, url, callback) => {
  if (cache.current[url]) {
    return cache.current[url]
  }

  const fetched = url ? callback(await api.get(url)) : []
  cache.current[url] = fetched

  return fetched
}

export const SectionSelector = ({ register, errors, setValue }) => {
  const cache = useRef({})
  const [isAbroad, setAbroad] = useState(false)
  const [country, setCountry] = useState(isAbroad ? '' : DOMESTIC_COUNTRY_CODE)
  const [countries, setCountries] = useState([])
  const [electionRegion, setElectionRegion] = useState('')
  const [electionRegions, setElectionRegions] = useState([])
  const [municipality, setMunicipality] = useState('')
  const [municipalities, setMunicipalities] = useState([])
  const [town, setTown] = useState(0)
  const [towns, setTowns] = useState([])
  const [cityRegion, setCityRegion] = useState('')
  const [cityRegions, setCityRegions] = useState([])
  const [section, setSection] = useState('')
  const [sections, setSections] = useState([])

  useEffect(async () => {
    setElectionRegions(
      await fetchData(cache, 'election_regions', (list) =>
        list.filter((x) => !x.isAbroad).sort(abcSorter())
      )
    )
  }, [])
  useEffect(async () => {
    let ignore = false
    if (!isAbroad) {
      setCountry(DOMESTIC_COUNTRY_CODE)
      setElectionRegion('')
      setMunicipalities([])
      setMunicipality('')
      setTowns([])
      setTown(0)
      setCityRegions([])
      setCityRegion('')
      setSection('')
      setSections([])
      return
    }
    setCountry('')
    setCountries([])
    const countries = await fetchData(
      cache,
      isAbroad ? 'countries' : null,
      (list) => list.filter((x) => x.isAbroad).sort(abcSorter())
    )
    !ignore && setCountries(countries)

    return () => {
      ignore = true
    }
  }, [isAbroad])
  useEffect(async () => {
    const municipalities = electionRegion
      ? electionRegions
          .find((region) => region.code === electionRegion)
          .municipalities.sort(abcSorter())
      : []
    setMunicipality('')
    setMunicipalities(municipalities)
    municipalities.length === 1 &&
      (setMunicipality(municipalities[0].code),
      setValue('municipality', municipalities[0].code))
  }, [electionRegion])
  useEffect(async () => {
    setTown(0)
    setTowns([])
    let ignore = false
    const towns = await fetchData(
      cache,
      isAbroad
        ? country && country !== DOMESTIC_COUNTRY_CODE
          ? `towns?country=${country}`
          : null
        : electionRegion && municipality
        ? `towns?country=${country}&election_region=${electionRegion}&municipality=${municipality}`
        : null,
      (list) => list.sort(abcSorter())
    )
    if (!ignore) {
      setTowns(towns)
      towns.length === 0 && setTown(0)
      towns.length === 1 &&
        (setTown(towns[0].id), setValue('town', towns[0].id))
    }
    return () => {
      ignore = true
    }
  }, [isAbroad, country, electionRegion, municipality])
  useEffect(async () => {
    setCityRegion('')
    const cityRegions =
      !isAbroad && town
        ? towns.find((x) => x.id === town).cityRegions?.sort(abcSorter()) || []
        : []
    setCityRegions(cityRegions)
    cityRegions.length === 0 && setCityRegion('')
    cityRegions.length === 1 &&
      (setCityRegion(cityRegions[0].code),
      setValue('cityRegion', cityRegions[0].code))
  }, [town])
  useEffect(async () => {
    setSections([])
    const townHasCityRegions = !!(
      town && towns.find((x) => x.id === town)?.cityRegions?.length > 0
    )
    let ignore = false
    const sections = await fetchData(
      cache,
      town && (!townHasCityRegions || cityRegion)
        ? `sections?town=${town}${
            cityRegion ? `&cityRegion=${cityRegion}` : ''
          }`
        : null,
      (list) => list.sort(abcSorter('code'))
    )
    !ignore && setSections(sections)

    return () => {
      ignore = true
    }
  }, [cityRegion, town])

  return (
    <>
      {/*<Radios
        name="isAbroad"
        label="Сигнал в:"
        onChange={setAbroad}
        options={[
          { value: false, label: 'България' },
          { value: true, label: 'Чужбина' },
        ]}
        value={isAbroad}
        register={register}
      />*/}
      {!isAbroad ? (
        <>
          <DropDown
            name="electionRegion"
            label="Област"
            options={electionRegions.map((region) => ({
              value: region.code,
              label: `${region.code} ${region.name}`,
            }))}
            value={electionRegion}
            onChange={setElectionRegion}
            errors={errors.electionRegion}
            register={register}
            required={true}
          />
          <DropDown
            name="municipality"
            label="Община"
            options={municipalities.map((municipality) => ({
              value: municipality.code,
              label: municipality.name,
            }))}
            value={municipality}
            onChange={setMunicipality}
            errors={errors.municipality}
            register={register}
            required={true}
          />
        </>
      ) : (
        <DropDown
          name="country"
          label="Държава"
          value={country}
          options={countries.map((country) => ({
            value: country.code,
            label: country.name,
          }))}
          onChange={setCountry}
          register={register}
          errors={errors.country}
          required={true}
        />
      )}
      <DropDown
        name="town"
        label="Населено място"
        value={town}
        options={towns.map((town) => ({ value: town.id, label: town.name }))}
        onChange={(town) => setTown(parseInt(town, 10))}
        register={register}
        errors={errors.town}
        required={true}
      />
      {cityRegions.length > 0 && (
        <DropDown
          name="cityRegion"
          label="Район"
          value={cityRegion}
          options={cityRegions.map((cityRegion) => ({
            value: cityRegion.code,
            label: cityRegion.name,
          }))}
          onChange={setCityRegion}
          register={register}
          errors={errors.cityRegion}
          required={true}
        />
      )}
      <DropDown
        name="section"
        label="Секция"
        value={section}
        options={sections.map((section) => ({
          value: section.id,
          label: `${section.code} ${section.place}`,
        }))}
        onChange={setSection}
        register={register}
        errors={errors.section}
        required={false}
      />
    </>
  )
}
