

import axios from 'axios'
import fs from 'fs'
import {config} from './index.js'
export const getImg = (str) => {
    return axios.post('http://region-41.seetacloud.com:40809/sdapi/v1/txt2img', {
        "prompt": config.defaultPrompt + "," + str,
        "negative_prompt": config.defaultNegativePrompt,
        "width": 512,
        "height": 768,
        "scale": 12,
        "steps": 28,
        "sampler_index": "Euler"
    }, {
        Headers: {
            'Content-Type': 'application/json'
        }
    })
}


export const base64ToBuffer = (base64) => {
    let source = base64;
    if (/\,/.test(base64)) {
        source = base64.split(',')[1];
    }
    return Buffer.from(source, 'base64');
}