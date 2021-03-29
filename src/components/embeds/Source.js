import React from 'react';

import styled from 'styled-components';

const SourceStyle = styled.div`
    background-color: #bbb;
    display: block;
    position: fixed;
    right: 0;
    left: 0;
    text-align: center;
    bottom: 0;
    padding: 5px;

    p {
        margin: 0;
        font-weight: bold;
        color: white;

        a {
            color: blue;
        }
    }
`;

export default props => {
    return(
        <SourceStyle>
            <p>Източник: <a href="https://tibroish.bg">Ти Броиш</a>.</p>
        </SourceStyle>
    );
};