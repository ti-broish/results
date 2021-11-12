import React from 'react';

import { Link } from 'react-router-dom';
import Logo from './Logo';

import styled from 'styled-components';


const MOBILE_WIDTH = 952;

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const HeaderCompensator = styled.div`
    height: 60px;
`;

const HeaderDiv = styled.header`
    background-color: #00D5BD;
    color: white;
    padding: 8px 0;
    height: 60px;
    position: fixed;
    box-sizing: border-box;
    top: 0;
    width: 100%;
    z-index: 20;

    a {
        margin: 0;
        svg { height: 45px; }
    }

    h2 {
        float: right;
        margin: 8px 0;
    }
`;

const AppTitle = styled.span`
    vertical-align: top;
    display: inline-block;
    color: white;
    font-size: 34px;
`;


export default (props) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return [
    <HeaderCompensator />,
    <HeaderStyle>
      <Wrapper>
        <Link to="/">
          <LogoImage src="/brand/logo_horizontal_white.png?v=2" />
        </Link>
        <Navigation>
          <Link to="/about">Kампанията</Link>
          <Link to="/signup">Запиши се</Link>
          <Link to="/instructions">Инструкции</Link>
          <Link to="/videos">Видео</Link>
          <Link to="/results/parliament-president-2021-11-14/violations">
            Сигнали
          </Link>
          <Link to="/ti-glasuvash">Ти Гласуваш</Link>
        </Navigation>
        <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </MobileMenuButton>
      </Wrapper>
    </HeaderStyle>,
    <MobileNavigation>
      <Menu
        right
        isOpen={menuOpen}
        onStateChange={(state) => {
          if (state.isOpen !== menuOpen) setMenuOpen(state.isOpen);
        }}
      >
        <MobileNavMenu>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Начало
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            Kампанията
          </Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}>
            Запиши се
          </Link>
          <Link to="/instructions" onClick={() => setMenuOpen(false)}>
            Инструкции
          </Link>
          <Link to="/videos" onClick={() => setMenuOpen(false)}>
            Видео
          </Link>
          <Link to="/news" onClick={() => setMenuOpen(false)}>
            Актуална информация
          </Link>
          <Link to="/privacy-notice" onClick={() => setMenuOpen(false)}>
            Декларация за поверителност
          </Link>
          <Link
            to="/results/parliament-president-2021-11-14/violations"
            onClick={() => setMenuOpen(false)}
          >
            Сигнали
          </Link>
          <Link to="/ti-glasuvash" onClick={() => setMenuOpen(false)}>
            Ти Гласуваш!
          </Link>
        </MobileNavMenu>
      </Menu>
    </MobileNavigation>,
  ];
};
