const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Url = require('./../models/Url');

// conversion function to full url
function convertFullUrl(string) {
  let tempStr = string;
  let beginUrl = "https://www.";
  let fullUrl = "";
  if (tempStr.substr(0, 12) === "https://www.") {
    fullUrl = tempStr;
  } else if (tempStr.substr(0, 11) === "http://www.") {
    fullUrl = beginUrl + tempStr.substr(11, 200);
  } else if (tempStr.substr(0, 8) === "https://") {
    fullUrl = beginUrl + tempStr.substr(8, 200);
  } else if (tempStr.substr(0, 7) === "http://") {
    fullUrl = beginUrl + tempStr.substr(7, 200);
  } else {
    fullUrl = beginUrl + tempStr;
  }
  return fullUrl;
}

router.route('/new/:id')
  .get(
    (req, res, next) => {
      // get new url
      const { id } = req.params;
      
      // validate url
      if (id.substr(-4, 4) === ".com") {
        return next();
      } else if (id.substr(-5, 4) !== ".com/") {
        return res.end({ "error": "URL invalid" });
      }
    },
    (req, res, next) => {
      // get new url
      const { id } = req.params;

      // convert to https://www.example.com
      const originalurl = convertFullUrl(id);

      // mongoose checks if original url is in mongodb
      // redirect to site if it exists or send error to next middleware
      Url.find({ original_url: originalurl }, function (err, url) {
        if (url[0] === undefined) {
          return next();
        }
        res.redirect(url[0].original_url);
      });
    },
    (req, res) => {
      // get new url
      const { id } = req.params;

      // convert to https://www.example.com
      const originalurl = convertFullUrl(id);
      
      // create random short address
      const randomInteger = Math.floor(Math.random() * (1000 - 1)) + 1;
      const shorturl = "http://localhost:3000/" + randomInteger.toString();

      // mongoose construct new document for url
      const url = new Url({
        original_url: originalurl,
        short_url: shorturl
      });

      // mongoose save doc to mongodb
      url.save().then((newUrl) => {
        res.status(200).json({
          original_url: newUrl.original_url,
          short_url: newUrl.short_url
        })
      }).catch((err) => {
        return res.status(500).json({
          message: `Database error: Saved unsuccessfully.`
        });
      })
    }
  )

router.route('/:id')
  .get((req, res) => {
    // get new url
    const { id } = req.params;

    // mongoose find existing url to redirect or send error not found
    let existingUrl = `http://localhost:3000/${id}`;
    Url.find({ short_url: existingUrl }, function (err, url) {
      if (err) {
        return res.status(500).json({
          message: `Url does not match.`
        });
      } else {
        res.redirect(url[0].original_url);
      }
    });
  })

// export module with node.js for use outside doc
module.exports = router;
