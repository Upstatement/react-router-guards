# react-router-guards Demo

This demo was created in order to demonstrate some example use cases for `react-router-guards`. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

In order to get started on developing, you're going to need to link your local `react-router-guards` package to the project. This can be done as follows:

1. In the root directory of this repository, run the following command to create the link:

   ```shell
   $ npm link
   ```

2. In the `/demo` directory (this one), run the following command to link the files:

   ```shell
   $ npm link react-router-guards
   ```

3. Finally, in the same directory, make sure to install all other dependencies:

   ```shell
   $ npm i
   ```

## Getting started

When actively working on both the demo and `react-router-guards` package, you'll need both watch processes actively running. This can be done as follows:

1. In a terminal window, run the following command in the root directory to start watching the package for changes:

   ```shell
   $ npm start
   ```

2. In a different terminal window or tab, run the following command in the `/demo` directory to run the demo's development server:

   ```shell
   $ npm start
   ```

You should now be able to visit [localhost](http://localhost:3000) in your browser and begin development!

_**Note:** if at any time you would like to cancel the running server instance, press `CTRL + C` in the open terminal window._
