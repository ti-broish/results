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
                    <h2>1. Карта на изборните райони</h2>
                    <iframe
                        width="800"
                        height="450"
                        //style={{border: 0}}
                        loading="lazy"
                        allowFullScreen
                        src={`${publicURL}/embed/test-embed`}>
                    </iframe>
                </EmbedPage>
            </Wrapper>
            <Footer/>
        </div>
    );
};