import { createGlobalStyle } from "styled-components";
import "font-awesome/css/font-awesome.css";

const style = createGlobalStyle`
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: none;
  }

  body {
    background: #9B65E6;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    font-family: sans-serif;
  }
`;

export default style;
