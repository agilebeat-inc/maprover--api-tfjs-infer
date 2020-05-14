'use strict';

const tf = require('@tensorflow/tfjs');
const { createCanvas, Image } = require('canvas')

module.exports.inferHandler = async (event, context) => {
    //const modelURL = 'https://maprover-models.s3.amazonaws.com/TensorFlow/quarry/model04ad7614e0c24c0d8c7c34690867a6a973e2c224fdbf93a2e9d67e63a9bf5b73.json';
    //const modelURL = 'http://huguesg.fr/incidents/model.json'
    //const modelURL = 'https://tfjs-model-tutorial.s3.amazonaws.com/tfjs-models/model.json'
    const modelURL = 'https://tfjs-model-tutorial.s3.amazonaws.com/model.json'

    function toBase64FromImageData(data) {
        var canvas = createCanvas(256, 256);
        var context = canvas.getContext('2d');
        canvas.height = data.height;
        canvas.width = data.width;
      
        var context = canvas.getContext('2d');
        context.putImageData(data, 0, 0);
      
        var base64Data = canvas.toDataURL();
        return base64Data;
    };
      
    function toImageDataFromBase64(string) {
        var image = new Image();
        image.src = string;
      
        var canvas = createCanvas(256, 256);
        var context = canvas.getContext('2d');
        var height = image.height;
        var width = image.width;
      
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0);
      
        return context.getImageData(0, 0, width, height);
    };

    var tile_fullstr = "data:image/png;base64," + JSON.stringify(event.tile_base64);
    var imageData = toImageDataFromBase64(tile_fullstr);
    const model = await tf.loadLayersModel(modelURL);
    var prediction = model.predict(imageData);
    //var imageB64 = toBase64FromImageData(imageData);

    const response = {
        statusCode: 200,
        event : JSON.stringify(event.tile_base64),
        prediction: JSON.stringify(prediction),
        body: 'Sucess! We rule!'
    };
    return response;
};