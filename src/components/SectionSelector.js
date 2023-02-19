import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';

export default function SectionSelector({ town, city_region }) {
  const methods = useFormContext();
  const [sections, setSections] = useState([]);

  const api_endpoint = process.env.DATA_URL;
  useEffect(() => {
    if (town != 0) {
      const path = `/sections?town=${town}`;
      console.log(api_endpoint + path);
      axios
        .get(`${api_endpoint + path}`)
        .then((res) => {
          return res;
        })
        .then((res) => {
          setSections(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [town]);

  useEffect(() => {
    if (city_region != undefined) {
      const path = `/sections?town=${town}&city_region=${city_region}`;
      axios
        .get(`${api_endpoint + path}`)
        .then((res) => {
          return res;
        })
        .then((res) => {
          setSections(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [city_region]);

  const createSectionOptions = () => {
    return sections.map((section) => {
      return (
        <option id={section.id} key={section.id} value={section.id}>
          {section.id + section.place}
        </option>
      );
    });
  };

  return (
    <div>
      <select
        className="form-control"
        name="section"
        {...methods.register('section', { required: false })}
        onChange={(e) => setSelectedSection(e.target.value)}
      >
        {sections.length != 0 ? (
          <>
            {' '}
            <option value="" disabled selected="selected">
              -- Номер на секция --
            </option>
            {createSectionOptions()}
          </>
        ) : (
          <option value="" disabled selected="selected">
            -- Номер на секция --
          </option>
        )}
      </select>
    </div>
  );
}
