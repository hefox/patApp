# Image Gallery App

This is a simple image gallery app to view an image gallery via giphy api.

## Setup

Run `npm install` so the grunt tasks can run (jshint, compass, etc.)
Ensure compass is installed globally.

## Test locally

Run `grunt serve` to view a local site

## Deploy

Run `grunt build` to get a build of html/css/js and a ready to deploy 'dist' folder will be created.

## Some ideas for next step in this project

* Input field to get search term from
* Provide multiple sources like google search. This likely involve reformatting returned images so consistent format from both services.
* an Image class with image specific functionality.
* Display image in Lightbox based on browser current size.
* Update url on image click so can link to current gif (e.g. use history)
* Tests