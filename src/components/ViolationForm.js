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
  //   useEffect(() => {
  //     axios
  //       .get('http://localhost:4000/election_regions')
  //       .then((res) => setElectionRegions(res.data));

  //     // return election_regions.map((election_region) => {
  //     //   return <option value={country.dial_code}>{country.name}</option>;
  //     // });
  //   }, []);
  const getElectionRegions = () => {
    return electionRegions.map((election_region) => {
      return <option value={election_region.id}>{election_region.name}</option>;
    });
  };
  const onSubmit = (data) => {
    console.log(data);
    const body = {
      description: data.description,
      town: 68134,
    };
    console.log(JSON.stringify(body));
    // fetch('http://localhost:4000/violations', {
    //   method: 'POST',
    //   mode: 'cors',
    //   body: JSON.stringify(body),
    // }).then((res) => console.log(res));
    axios
      .post('http://localhost:4000/violations', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
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
        <select className="form-control">
          <option value="choose" disabled selected="selected">
            -- МИР --
          </option>
          {getElectionRegions()}
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
        <label>Град</label>
        <input
          type="text"
          name="city"
          {...register('city', { required: false })}
        />
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
