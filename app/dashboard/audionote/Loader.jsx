'use client'
import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import Tus from'@uppy/tus'
import Dashboard from "@uppy/react/lib/Dashboard";
import useUppy from "@uppy/react/lib/useUppy";
import "@uppy/core/dist/style.css";
import Audio from '@uppy/audio';


import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/audio/dist/style.min.css';

// Demo: https://codesandbox.io/p/sandbox/react-uppy-example-fizg4s?file=%2Fcomponents%2FWorkingUploader.js%3A7%2C4

export default function Loader() {
const [uppy] = useState(() => new Uppy().use(Audio));

 return (
    <Dashboard
      uppy={uppy}
      plugins={['Audio']}
      
    />
 );
};