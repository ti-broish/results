import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
`;

export default function ViolationForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const [electionRegions, setElectionRegions] = useState([]);
  const [selectedElectionRegion, setSelectedElectionRegion] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTown, setSelectedTown] = useState(0);
  const [towns, setTowns] = useState([]);

  const api_endpoint = 'http://localhost:4000';

  useEffect(() => {
    setSelectedCountry(getValues('countryField'));
    axios
      .get(`${api_endpoint}/election_regions`)
      .then((res) => setElectionRegions(res.data));
  }, []);

  useEffect(() => {
    if (selectedElectionRegion != '') {
      getMunicipalities(selectedElectionRegion);
    }
    if (selectedElectionRegion != '' && selectedMunicipality != '') {
      const countryCode = selectedCountry == 'Bulgaria' ? '00' : null;
      axios
        .get(
          `${api_endpoint}/towns?country=${countryCode}&election_region=${selectedElectionRegion}&municipality=${selectedMunicipality}`
        )
        .then((res) => setTowns(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedElectionRegion, selectedMunicipality]);

  const getElectionRegions = () => {
    return electionRegions.map((election_region) => {
      return (
        <option key={election_region.code} value={election_region.code}>
          {election_region.name}
        </option>
      );
    });
  };
  const getMunicipalities = (selectedElectionRegion) => {
    const filteredRegions = electionRegions.filter(
      (electionRegion) => electionRegion.code == selectedElectionRegion
    );
    const municipalities = [];
    filteredRegions[0].municipalities.forEach((municipality) => {
      municipalities.push(municipality);
    });
    return municipalities.map((municipality) => {
      return (
        <option key={municipality.code} value={municipality.code}>
          {municipality.name}
        </option>
      );
    });
  };

  const createTownOptions = () => {
    return towns.map((town) => {
      return (
        <option id={town.code} key={town.code} value={town.id}>
          {town.name}
        </option>
      );
    });
  };

  const onSubmit = (data) => {
    const town = data.municipality == 46 ? 68134 : data.town;
    const body = {
      description: data.description,
      town: Number(town),
    };

    axios
      .post(`${api_endpoint}/violations`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <CommentFormStyle onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label>Секция в:</label>
        <div>
          <input
            type="radio"
            id="fieldBg"
            value="Bulgaria"
            name="countryField"
            {...register('countryField', { required: false })}
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
            {...register('countryField', { required: false })}
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
          {...register('electionRegion')}
          onChange={(e) => setSelectedElectionRegion(e.target.value)}
        >
          <option value="choose" disabled selected="selected">
            -- МИР --
          </option>
          {getElectionRegions()}
        </select>
      </div>
      <div>
        <label className="inputLabel">Община</label>
      </div>
      <div>
        <select
          className="form-control"
          {...register('municipality')}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
        >
          {selectedElectionRegion != '' ? (
            <>
              <option value="choose" disabled selected="selected">
                -- Община --
              </option>
              {getMunicipalities(selectedElectionRegion)}
            </>
          ) : (
            <option value="choose" disabled selected="selected">
              -- Община --
            </option>
          )}
        </select>
      </div>
      <div>
        <label className="inputLabel">Град/село</label>
      </div>
      <div>
        <select
          className="form-control"
          {...register('town')}
          onChange={(e) => setSelectedTown(e.target.value)}
        >
          {towns.length != 0 ? (
            <>
              <option value="choose" disabled selected="selected">
                -- Градове --
              </option>
              {createTownOptions()}
            </>
          ) : (
            <option value="choose" disabled selected="selected">
              -- Градове --
            </option>
          )}
        </select>
      </div>
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
          {...register('email', { required: true })}
        />
        {errors.email && errors.email.type === 'required' && (
          <p className="errorMsg">Полето е задължително.</p>
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
        <label className="inputLabel">Секция</label>
        <input
          type="text"
          name="section"
          {...register('section', { required: false })}
        />
      </div>
      <div className="form-control">
        <label className="inputLabel">Описание на нарушението</label>
        <input
          type="text"
          name="description"
          {...register('description', { required: true })}
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
  );
}
