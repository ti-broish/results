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

export const SectionSelector = ({
  register,
  errors,
  setValue,
  initialSection,
}) => {
  const cache = useRef({})
  const initializing = useRef(
    initialSection?.length === 9 || initialSection?.startsWith('32')
  )
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
    if (initializing.current) return
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
    if (initializing.current) return
    const newMunicipalities = electionRegion
      ? electionRegions
          .find((region) => region.code === electionRegion)
          .municipalities.sort(abcSorter())
      : []
    setMunicipalities(newMunicipalities)
    if (newMunicipalities.length === 1) {
      setMunicipality(newMunicipalities[0].code)
      setValue('municipality', newMunicipalities[0].code)
    } else if (!newMunicipalities.find((m) => m.code === municipality)) {
      setMunicipality('')
    }
  }, [electionRegion])
  useEffect(async () => {
    if (initializing.current) return
    let ignore = false
    const newTowns = await fetchData(
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
      setTowns(newTowns)
      if (newTowns.length === 0) {
        setTown(0)
      } else if (newTowns.length === 1) {
        setTown(newTowns[0].id)
        setValue('town', newTowns[0].id)
      } else if (!newTowns.find((t) => t.id === town)) {
        setTown(0)
      }
    }
    return () => {
      ignore = true
    }
  }, [isAbroad, country, electionRegion, municipality])
  useEffect(async () => {
    if (initializing.current) return
    const newCityRegions =
      !isAbroad && town
        ? towns.find((x) => x.id === town)?.cityRegions?.sort(abcSorter()) || []
        : []
    setCityRegions(newCityRegions)
    if (newCityRegions.length === 0) {
      setCityRegion('')
    } else if (newCityRegions.length === 1) {
      setCityRegion(newCityRegions[0].code)
      setValue('cityRegion', newCityRegions[0].code)
    } else if (!newCityRegions.find((cr) => cr.code === cityRegion)) {
      setCityRegion('')
    }
  }, [town])
  useEffect(async () => {
    if (initializing.current) return
    const townHasCityRegions = !!(
      town && towns.find((x) => x.id === town)?.cityRegions?.length > 0
    )
    let ignore = false
    const newSections = await fetchData(
      cache,
      town && (!townHasCityRegions || cityRegion)
        ? `sections?town=${town}${
            cityRegion ? `&city_region=${cityRegion}` : ''
          }`
        : null,
      (list) => list.sort(abcSorter('code'))
    )
    if (!ignore) {
      setSections(newSections)
      if (!newSections.find((s) => s.id === section)) {
        setSection('')
      }
    }

    return () => {
      ignore = true
    }
  }, [cityRegion, town])

  const initDone = useRef(false)
  useEffect(async () => {
    if (!initialSection || initDone.current) return

    if (initialSection.startsWith('32')) {
      initDone.current = true

      setAbroad(true)
      setValue('isAbroad', true)

      const fetchedCountries = await fetchData(cache, 'countries', (list) =>
        list.filter((x) => x.isAbroad).sort(abcSorter())
      )
      setCountries(fetchedCountries)

      const countryCode =
        initialSection.length >= 5 ? initialSection.substring(2, 5) : null

      if (!countryCode) {
        initializing.current = false
        return
      }

      setCountry(countryCode)
      setValue('country', countryCode)

      const fetchedTowns = await fetchData(
        cache,
        `towns?country=${countryCode}`,
        (list) => list.sort(abcSorter())
      )
      setTowns(fetchedTowns)

      if (initialSection.length === 9) {
        for (const t of fetchedTowns) {
          const secs = await fetchData(cache, `sections?town=${t.id}`, (list) =>
            list.sort(abcSorter('code'))
          )
          const found = secs.find((s) => s.id === initialSection)
          if (found) {
            setTown(t.id)
            setValue('town', t.id)
            setSections(secs)
            setSection(found.id)
            setValue('section', found.id)
            break
          }
        }
      }

      initializing.current = false
      return
    }

    if (initialSection.length !== 9 || electionRegions.length === 0) return
    initDone.current = true

    const erCode = initialSection.substring(0, 2)
    const munCode = initialSection.substring(2, 4)

    const er = electionRegions.find((r) => r.code === erCode)
    if (!er) {
      initializing.current = false
      return
    }

    const muns = er.municipalities.sort(abcSorter())

    const fetchedTowns = await fetchData(
      cache,
      `towns?country=${DOMESTIC_COUNTRY_CODE}&election_region=${erCode}&municipality=${munCode}`,
      (list) => list.sort(abcSorter())
    )

    let foundTown = null
    let foundSection = null
    let foundCityRegion = null
    let foundCityRegions = null
    let foundSections = null

    for (const t of fetchedTowns) {
      const crs = t.cityRegions || []

      if (crs.length === 0) {
        const secs = await fetchData(cache, `sections?town=${t.id}`, (list) =>
          list.sort(abcSorter('code'))
        )
        const found = secs.find((s) => s.id === initialSection)
        if (found) {
          foundTown = t
          foundSection = found
          foundSections = secs
          break
        }
      } else {
        let matched = false
        for (const cr of crs) {
          const secs = await fetchData(
            cache,
            `sections?town=${t.id}&city_region=${cr.code}`,
            (list) => list.sort(abcSorter('code'))
          )
          const found = secs.find((s) => s.id === initialSection)
          if (found) {
            foundTown = t
            foundSection = found
            foundCityRegion = cr
            foundCityRegions = crs
            foundSections = secs
            matched = true
            break
          }
        }
        if (matched) break
      }
    }

    setElectionRegion(erCode)
    setValue('electionRegion', erCode)
    setMunicipalities(muns)
    setMunicipality(munCode)
    setValue('municipality', munCode)
    setTowns(fetchedTowns)

    if (foundTown) {
      setTown(foundTown.id)
      setValue('town', foundTown.id)
      if (foundCityRegions) {
        setCityRegions(foundCityRegions.sort(abcSorter()))
        setCityRegion(foundCityRegion.code)
        setValue('cityRegion', foundCityRegion.code)
      }
      setSections(foundSections)
      setSection(foundSection.id)
      setValue('section', foundSection.id)
    }

    initializing.current = false
  }, [electionRegions])

  return (
    <>
      <Radios
        name="isAbroad"
        label="Сигнал в:"
        onChange={setAbroad}
        options={[
          { value: false, label: 'България' },
          { value: true, label: 'Чужбина' },
        ]}
        value={isAbroad}
        register={register}
      />
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
