import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { slide as Menu } from 'react-burger-menu'

import styled from 'styled-components'

const MOBILE_WIDTH = 952

export const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const HeaderCompensator = styled.div`
  height: 60px;
`

const HeaderStyle = styled.header`
  height: 60px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 20;
  background-color: #38decb;
  padding: 10px;
  box-sizing: border-box;
`

const LogoImage = styled.img`
  height: 40px;
`

const Navigation = styled.nav`
  float: right;
  font-weight: bold;
  padding-top: 10px;

  a {
    color: white;
    text-decoration: none;
    padding: 10px;
    //margin-left: 15px;

    &:hover {
      color: #eee;
    }
  }

  @media only screen and (max-width: 854px) {
    font-size: 15px;
    a {
      padding: 7px;
    }
  }

  @media only screen and (max-width: 790px) {
    font-size: 14px;
    a {
      padding: 5px;
    }
  }

  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    display: none;
  }
`

const MobileMenuButton = styled.button`
  float: right;
  border: none;
  background: none;
  color: white;
  font-size: 35px;
  display: none;

  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    display: block;
  }
`

const MobileNavigation = styled.div`
  display: none;

  @media only screen and (max-width: ${MOBILE_WIDTH}px) {
    display: block;
  }

  .bm-menu {
    background-color: #20a898;
  }

  .bm-burger-button {
    display: none;
  }
`

const MobileNavMenu = styled.div`
  background-color: #20a898;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;

  a {
    color: white;
    width: 100%;
    display: block;
    font-size: 18px;
    text-decoration: none;
    font-weight: bold;
    padding: 10px 0;
  }
`

export default () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <HeaderCompensator />
      <HeaderStyle>
        <Wrapper>
          <a href="/">
            <LogoImage src="/brand/logo_horizontal_white.png?v=2" />
          </a>
          <Navigation>
            <a href="/signup">Запиши се</a>
            <a href="/about">Kампанията</a>
            <a href="/instructions">Инструкции</a>
            <a href="/videos">Видео</a>
            <a href="/ti-glasuvash">Ти Гласуваш</a>
          </Navigation>
          <MobileMenuButton onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </MobileMenuButton>
        </Wrapper>
      </HeaderStyle>
      <MobileNavigation>
        <Menu
          right
          isOpen={menuOpen}
          onStateChange={(state) => {
            if (state.isOpen !== menuOpen) setMenuOpen(state.isOpen)
          }}
        >
          <MobileNavMenu>
            <a href="/" onClick={() => setMenuOpen(false)}>
              Начало
            </a>
            <a href="/signup" onClick={() => setMenuOpen(false)}>
              Запиши се
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)}>
              Kампанията
            </a>
            <a href="/instructions" onClick={() => setMenuOpen(false)}>
              Инструкции
            </a>
            <a href="/videos" onClick={() => setMenuOpen(false)}>
              Видео
            </a>
            <a href="/news" onClick={() => setMenuOpen(false)}>
              Актуална информация
            </a>
            <a href="/privacy-notice" onClick={() => setMenuOpen(false)}>
              Декларация за поверителност
            </a>
            <a href="/ti-glasuvash" onClick={() => setMenuOpen(false)}>
              Ти Гласуваш!
            </a>
          </MobileNavMenu>
        </Menu>
      </MobileNavigation>
    </>
  )
}
