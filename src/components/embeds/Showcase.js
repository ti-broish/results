import React from 'react';

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
                    <h2>1. Мини-резултати</h2>
                    {/*
                        Кустомизация:
                        1. Изгледи (чекбоксове) – карта, резултати, райони
                        2. Изглед по подразбиране - карта, резултати или райони
                    */}
                    <iframe
                        width="600"
                        height="500"
                        style={{border: 'none', margin: '0 auto', display: 'block'}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/mini-results`}>
                    </iframe>
                    <EmbedCodeDisplay code={`<iframe width="600" height="500" style="border: none;" loading="lazy" allowfullscreen src="https://tibroish.bg${publicURL}/embed/mini-results"></iframe>`}/>
                </EmbedPage>
            </Wrapper>
            <Footer/>
        </div>
    );
};