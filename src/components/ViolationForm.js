import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentFormStyle = styled.form`
  width: 100%;

  .errorMsg {
    color: red;
  }
  .radioLabel {
    float: left;
    clear: none;
    display: block;
    padding: 0px 1em 0px 8px;
  }
  input[type='radio'] {
    float: left;
    clear: none;
    margin: 2px 0 0 2px;
  }
  label {
    display: block;
    margin-left: 5px;
  }
  input {
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
    formState: { errors },
  } = useForm();

  const [electionRegions, setElectionRegions] = useState([]);
  const [selectedElectionRegion, setSelectedElectionRegion] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [towns, setTowns] = useState([]);

  const api_endpoint = 'http://localhost:4000';

  useEffect(() => {
    console.log(selectedElectionRegion);
    axios
      .get(`${api_endpoint}/election_regions`)
      .then((res) => setElectionRegions(res.data));
  }, []);

  useEffect(() => {
    console.log('in 2nd use effect before if');
    if (selectedElectionRegion != '') {
      console.log('get municipalities');
      getMunicipalities(selectedElectionRegion);
    }
    if (selectedElectionRegion != '' && selectedMunicipality != '') {
      console.log('in 2nd use effect after if');
      axios
        .get(
          `${api_endpoint}/towns?country=00&election_region=${selectedElectionRegion}&municipality=${selectedMunicipality}`
        )
        .then((res) => setTowns(res.data));
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
    console.log('here');

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
    console.log('in create town');
    return towns.map((town) => {
      return (
        <option id={town.code} key={town.code} value={town.code}>
          {town.name}
        </option>
      );
    });
  };
  const onSubmit = (data) => {
    const body = {
      description: data.description,
      town: 68134,
    };
    console.log(JSON.stringify(body));
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
        <div className="radio_button_1">
          <input
            type="radio"
            id="fieldBg"
            {...register('fieldBg', { required: false })}
          />
          <label className="radioLabel">България</label>
          <input
            type="radio"
            id="fieldForeign"
            {...register('fieldForeign', { required: false })}
          />
          <label className="radioLabel">Чужбина</label>
        </div>
      </div>
      <div>
        <label>МИР</label>
      </div>
      <div>
        <select
          className="form-control"
          onChange={(e) => setSelectedElectionRegion(e.target.value)}
        >
          <option value="choose" disabled selected="selected">
            -- МИР --
          </option>
          {getElectionRegions()}
        </select>
      </div>
      <div>
        <label>Община</label>
      </div>
      <div>
        <select
          className="form-control"
          onChange={(e) => setSelectedMunicipality(e.target.value)}
        >
          {selectedElectionRegion != '' ? (
            getMunicipalities(selectedElectionRegion)
          ) : (
            <option value="choose" disabled selected="selected">
              -- Община --
            </option>
          )}
        </select>
      </div>
      <div>
        <label>Град/село</label>
      </div>
      <div>
        <select className="form-control">
          {towns.length != 0 ? (
            createTownOptions()
          ) : (
            <option value="choose" disabled selected="selected">
              -- Градове --
            </option>
          )}
        </select>
      </div>
      <div className="form-control">
        <label>Име</label>
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
        <label>Имейл</label>
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
        <label>Телефон</label>
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
        <label>Секция</label>
        <input
          type="text"
          name="section"
          {...register('section', { required: false })}
        />
      </div>
      <div className="form-control">
        <label>Описание на нарушението</label>
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
