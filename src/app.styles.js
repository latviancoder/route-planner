import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Segoe UI, Helvetica Neue, Arial, sans-serif;
    margin: 0;
    font-size: 18px;
  }
  .marker-icon {
    height: 25px !important;
    width: 25px !important;
    border-radius: 100%;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
`;

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 5% 10%;
`;