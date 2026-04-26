import React, { useContext, useEffect, useState } from 'react'

import axios from 'axios'
import Helmet from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { mapNodeType } from '../ResultUnit'
import LoadingScreen from '../layout/LoadingScreen'

import ResultsTable from '../components/results_table/ResultsTable'

import ImageGallery from '../../utils/ImageGallery'

import { ElectionContext } from '../Election'
import Crumbs from '../components/Crumbs'

import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ViolationFeeds from '../ViolationFeeds'
import Player from '../embeds/Player'
import { shouldShowOfficialStreaming } from '../../utils/visibility'
import {
  getSavedContact,
  saveContact,
  formatPhone,
  isValidPhone,
  isValidEmail,
} from '../../utils/contact'
import { Button } from '../components/Button'
import api from '../../utils/api'

const renderRiskLevelText = (riskLevel) => {
  switch (riskLevel) {
    case 'high':
      return `Висок`
    case 'mid':
      return `Среден`
    default:
      return `Нисък`
  }
}

const protocolLink = (id) => {
  return `/protocol/${id}`
}

const SectionDetailsTable = styled.table`
  margin: 20px 0;
  width: 100%;
  font-size: 20px;

  tr {
    //margin: 50px 0;
  }

  td {
    padding: 5px 0;
    font-size: 18px;
    width: 50%;

    &:nth-child(1) {
      font-weight: bold;
      color: #999;
    }
  }

  ${(props) =>
    props.embed
      ? `
        td {
            font-size: 12px;
            padding: 5px;
        }
    `
      : null}
`

const VideoPanel = styled.div`
  border: 2px solid #38decb;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 20px 0;

  h2 {
    margin: 0 0 16px 0;
    color: #333;
  }

  .video-link {
    display: inline-block;
    font-size: 20px;
    color: #38decb;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
    }
  }

  .signal-form {
    margin-top: 16px;

    textarea {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 6px;
      resize: vertical;
      min-height: 60px;
      box-sizing: border-box;
      font-family: inherit;
    }

    .contact-fields {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;

      input {
        flex: 1;
        min-width: 150px;
        padding: 8px 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-family: inherit;
      }
    }

    .form-row {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 8px;
    }

    .form-message {
      margin-top: 8px;
      font-size: 14px;
    }

    .success {
      color: green;
    }

    .error {
      color: red;
    }
  }
`

const ContentPanel = styled.div`
  background-color: white;
  margin: 30px auto;
  max-width: 840px;
  border-radius: 15px;
  //box-shadow: 0px 0px 5px #aaa;
  border: 1px solid #eee;
  padding: 20px 50px;

  hr {
    margin: 20px 0;
    border: 1px solid #ddd;
    border-top: 0;
  }
`

export default (props) => {
  const history = useHistory()
  const { dataURL, parties, meta } = useContext(ElectionContext)
  const { unit } = useParams()

  const [data, setData] = useState(null)
  const { executeRecaptcha } = process.env.GOOGLE_RECAPTCHA_KEY
    ? useGoogleReCaptcha()
    : { executeRecaptcha: null }
  const savedContact = getSavedContact()
  const [hasSavedContact, setHasSavedContact] = useState(
    !!(savedContact.name && savedContact.email && savedContact.phone)
  )
  const [videoDescription, setVideoDescription] = useState('')
  const [videoName, setVideoName] = useState(savedContact.name || '')
  const [videoEmail, setVideoEmail] = useState(savedContact.email || '')
  const [videoPhone, setVideoPhone] = useState(savedContact.phone || '')
  const [videoSubmitState, setVideoSubmitState] = useState(null)
  const [videoSubmitting, setVideoSubmitting] = useState(false)

  const videoFormValid =
    videoDescription.length >= 20 &&
    videoName.length > 0 &&
    isValidEmail(videoEmail) &&
    videoPhone.length > 0 &&
    isValidPhone(videoPhone)

  const submitVideoSignal = async () => {
    if (videoSubmitting || !videoFormValid) return
    setVideoSubmitting(true)
    setVideoSubmitState(null)
    try {
      const phone = formatPhone(videoPhone)
      await api.post(
        'violations',
        {
          description: videoDescription,
          section: data.segment,
          town: parseInt(data.town.id, 10),
          name: videoName,
          email: videoEmail,
          phone,
          type: 'video',
        },
        {
          headers: executeRecaptcha
            ? { 'x-recaptcha-token': await executeRecaptcha('sendViolation') }
            : {},
        }
      )
      saveContact({ name: videoName, email: videoEmail, phone: videoPhone })
      setHasSavedContact(true)
      setVideoSubmitState('success')
      setVideoDescription('')
    } catch (e) {
      setVideoSubmitState('error')
    }
    setVideoSubmitting(false)
  }

  useEffect(() => {
    axios
      .get(`${dataURL}/results/${unit}.json`)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        if (!data) history.push('/')
      })
  }, [])

  return !data ? (
    <LoadingScreen />
  ) : (
    <div id="section-data">
      <Helmet>
        <title>Секция {data.segment}</title>
      </Helmet>
      <Crumbs data={data} embed={props.embed} />
      <h1 style={props.embed ? { fontSize: '15px' } : {}}>
        Секция {data.segment}
      </h1>
      <ResultsTable
        results={data.results}
        parties={parties}
        totalValid={data.stats.validVotes}
        totalInvalid={data.stats.invalidVotes}
        embed={props.embed}
        showThreshold={true}
        partiesCount={parties.length}
        showFeaturedOnly={false}
      />
      <h2>Местоположение</h2>
      <SectionDetailsTable embed={props.embed}>
        <tbody>
          <tr>
            <td>Код</td>
            <td>{data.segment}</td>
          </tr>
          {data.crumbs.map((crumb, i) =>
            i === 0 ? null : (
              <tr key={i}>
                <td>{mapNodeType(crumb.type)}</td>
                <td>{crumb.name}</td>
              </tr>
            )
          )}
          <tr>
            <td>Нас. място</td>
            <td>{data.town.name}</td>
          </tr>
          <tr>
            <td>Адрес</td>
            <td>{data.place}</td>
          </tr>
        </tbody>
      </SectionDetailsTable>
      <h2>Допълнителни данни</h2>
      <SectionDetailsTable>
        <tbody>
          <tr>
            <td>Избиратели</td>
            <td>{data.stats.voters}</td>
          </tr>
          <tr>
            <td>Действителни гласове</td>
            <td>{data.stats.validVotes}</td>
          </tr>
          <tr>
            <td>Недействителни гласове</td>
            <td>{data.stats.invalidVotes}</td>
          </tr>
          <tr>
            <td>Сигнали</td>
            <td>{data.stats.violationsCount}</td>
          </tr>
          <tr>
            <td>Риск</td>
            <td>{renderRiskLevelText(data.riskLevel)}</td>
          </tr>
        </tbody>
      </SectionDetailsTable>
      {!data.segment.startsWith('32') && shouldShowOfficialStreaming(meta) && (
        <VideoPanel>
          <h2>Видеонаблюдение</h2>
          <a
            className="video-link"
            href={`https://evideo.bg/pe202604/${data.segment.slice(
              0,
              2
            )}.html#${data.segment}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            &#9654; Видеоизлъчване от секцията
          </a>
          <div className="signal-form">
            <textarea
              placeholder="Опишете нарушението от видеонаблюдението..."
              value={videoDescription}
              onChange={(e) => {
                setVideoDescription(e.target.value)
                if (videoSubmitState) setVideoSubmitState(null)
              }}
            />
            {!hasSavedContact && (
              <div className="contact-fields">
                <input
                  type="text"
                  placeholder="Име"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Имейл"
                  value={videoEmail}
                  onChange={(e) => setVideoEmail(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={videoPhone}
                  onChange={(e) => setVideoPhone(e.target.value)}
                />
              </div>
            )}
            <div className="form-row">
              <Button
                type="button"
                disabled={videoSubmitting || !videoFormValid}
                onClick={submitVideoSignal}
              >
                Подай видео сигнал
              </Button>
            </div>
            {videoSubmitState === 'success' && (
              <p className="form-message success">
                Сигналът беше изпратен успешно!
              </p>
            )}
            {videoSubmitState === 'error' && (
              <p className="form-message error">
                Грешка при изпращане. Опитайте с подробния формуляр.
              </p>
            )}
          </div>
        </VideoPanel>
      )}
      {/*<Player section={data.segment} />*/}
      {data.protocols.length > 0 && <h2>Протоколи:</h2>}
      {data.protocols &&
        data.protocols.map((protocol, index) => {
          return (
            <div key={index}>
              <Link to={protocolLink(protocol.id)}>
                <h3>Протокол {index + 1}</h3>
              </Link>
              <ImageGallery
                items={protocol.pictures.map((picture) => ({
                  original: picture.url,
                }))}
              />
            </div>
          )
        })}
      <h2 style={props.embed ? { fontSize: '15px' } : {}}>Сигнали</h2>
      <p>
        {data.stats.violationsCount}{' '}
        {data.stats.violationsCount === 1
          ? 'подаден сигнал'
          : 'подадени сигнала'}
      </p>
      <ViolationFeeds
        unit={unit}
        totalViolationsCount={data.stats.violationsCount}
      ></ViolationFeeds>
    </div>
  )
}
