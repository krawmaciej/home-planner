import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import {WebGLRenderer} from "three";

const renderer = new WebGLRenderer();

ReactDOM.render(
  <React.StrictMode>
    <App renderer={renderer}/>
  </React.StrictMode>,
  document.getElementById('root')
);
