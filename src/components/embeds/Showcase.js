import React, { useState } from 'react';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import styled from 'styled-components';

const EmbedPage = styled.div`
    hr {
        border-top: none;
        border-bottom: 1px solid #ddd;
    }
`;

import { Wrapper } from '../App';
import EmbedCodeDisplay from './EmbedCodeDisplay';

export default props => {
    const [selectedRegion, setSelectedRegion] = useState('01');

    const regions = [
        { num: '01', name: 'Благоевград'},
        { num: '02', name: 'Бургас'},
        { num: '03', name: 'Варна'},
        { num: '04', name: 'Велико Търново'},
        { num: '05', name: 'Видин'},
        { num: '06', name: 'Враца'},
        { num: '07', name: 'Габрово'},
        { num: '08', name: 'Добрич'},
        { num: '09', name: 'Кърджали'},
        { num: '10', name: 'Кюстендил'},
        { num: '11', name: 'Ловеч'},
        { num: '12', name: 'Монтана'},
        { num: '13', name: 'Пазарджик'},
        { num: '14', name: 'Перник'},
        { num: '15', name: 'Плевен'},
        { num: '16', name: 'Пловдив Град'},
        { num: '17', name: 'Пловдив Област'},
        { num: '18', name: 'Разград'},
        { num: '19', name: 'Русе'},
        { num: '20', name: 'Силистра'},
        { num: '21', name: 'Сливен'},
        { num: '22', name: 'Смолян'},
        { num: '23', name: 'София 23 Мир'},
        { num: '24', name: 'София 24 Мир'},
        { num: '25', name: 'София 25 Мир'},
        { num: '26', name: 'Софийска Област'},
        { num: '27', name: 'Стара Загора'},
        { num: '28', name: 'Търговище'},
        { num: '29', name: 'Хасково'},
        { num: '30', name: 'Шумен'},
        { num: '31', name: 'Ямбол'},
        { num: '32', name: 'Извън Страната'},
    ];

    const dropdownClicked = e => {
        setSelectedRegion(e.target.value);
    };

    const publicURL = process.env.PUBLIC_URL? process.env.PUBLIC_URL : '';
    return(
        <div>
            <Header title={'Вграждане'}/>
            <Wrapper>
                <EmbedPage>
                    <h1>Вграждане</h1>
                    <hr/>
                    <p>
                        Тук ще видите различни варианти да вградите ТиБроиш
                        във Вашия сайт!
                    </p>
                    <h2>1. Пълни резултати</h2>
                    <iframe
                        width="600"
                        height="560"
                        style={{border: 'none', margin: '0 auto', display: 'block'}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/mini-results`}>
                    </iframe>
                    <EmbedCodeDisplay code={`<iframe width="600" height="560" style="border: none;" loading="lazy" allowfullscreen src="https://tibroish.bg${publicURL}/embed/mini-results"></iframe>`}/>
                    <h2>2. Само интерактивна карта</h2>
                    <iframe
                        width="600"
                        height="560"
                        style={{border: 'none', margin: '0 auto', display: 'block'}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/mini-results?mapOnly=true`}>
                    </iframe>
                    <EmbedCodeDisplay code={`<iframe width="600" height="560" style="border: none;" loading="lazy" allowfullscreen src="https://tibroish.bg${publicURL}/embed/mini-results?mapOnly=true"></iframe>`}/>
                    <h2>3. Само резултати</h2>
                    <iframe
                        width="600"
                        height="500"
                        style={{border: 'none', margin: '0 auto', display: 'block'}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/mini-results?resultsOnly=true`}>
                    </iframe>
                    <EmbedCodeDisplay code={`<iframe width="600" height="500" style="border: none;" loading="lazy" allowfullscreen src="https://tibroish.bg${publicURL}/embed/mini-results?resultsOnly=true"></iframe>`}/>
                    <h2>4. Резултати за район</h2>
                    <select onClick={dropdownClicked}>
                    {
                        regions.map(region =>
                            <option selected={region.num === selectedRegion} value={region.num}>
                                {region.name}
                            </option>    
                        )
                    }
                    </select>
                    <iframe
                        width="600"
                        height="500"
                        style={{border: 'none', margin: '0 auto', display: 'block'}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/mini-results/${selectedRegion}`}>
                    </iframe>
                    <EmbedCodeDisplay code={`<iframe width="600" height="500" style="border: none;" loading="lazy" allowfullscreen src="https://tibroish.bg${publicURL}/embed/mini-results/${selectedRegion}"></iframe>`}/>
                </EmbedPage>
            </Wrapper>
            <Footer/>
        </div>
    );
};