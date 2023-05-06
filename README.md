# CubopediaV2-Front

Front end of the Cubopedia project. Created in Typescript with React.js and Node.js

![nodeVersion](https://img.shields.io/badge/node-%3E%3D%20v18.12.1-green)
![npmVersion](https://img.shields.io/badge/npm-%3E%3D%209.4.2-blue)

## Table of Contents

- [CubopediaV2-Front](#cubopediav2-front)
  - [Table of Contents](#table-of-contents)
  - [Quick Start](#quick-start)
  - [Updating to New Releases](#updating-to-new-releases)
  - [Folder Structure](#folder-structure)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm test`](#npm-test)
    - [`npm run build`](#npm-run-build)
    - [`npm run eject`](#npm-run-eject)

## Quick Start

First of all, you will need Node.js and npm installed on your machine.

After cloning the project, install all required packages by running the following command:

`npm install`

Create a new file called `.env` and use the file [.env.sample](.env.sample) as a guide.

Use any of the Available scripts to interact with the project.

To run the app in development mode use the following command:

`npm start`

## Updating to New Releases

Create React App is divided into two packages:

- `create-react-app` is a global command-line utility that you use to create new projects.
- `react-scripts` is a development dependency in the generated projects (including this one).
You almost never need to update `create-react-app` itself: it delegates all the setup to `react-scripts`.

When you run `create-react-app`, it always creates the project with the latest version of `react-scripts` so you’ll get all the new features and improvements in newly created apps automatically.

To update an existing project to a new version of `react-scripts`, open the changelog, find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `react-scripts` version in `package.json` and running `npm install` in this folder should be enough, but it’s good to consult the changelog for potential breaking changes.

## Folder Structure

```
cubopediav2-front/
    node_modules/
    README.md
    .env
    .env.sample
    .eslintrc.json
    .gitignore
    package-lock.json
    package.json
    tsconfig.json
    public/
        favicon.ico
        index.html
        logo192.png
        logo512.png
        manifest.json
        robot.text
    src/
        App.css
        App.test.tsx
        App.tsx
        index.css
        index.tsx
        logo.svg
        react-app-env.d.ts
        reportWebVitals.ts
        setupTest.ts
        assets/
        aws/
            functions/
                s3AddImage.ts
            lib/
                s3Client.ts
        components/
            logIn/
                Login.tsx
            MainMenu/
                MyCubes/
                    modal.css
                    MyCubes.tsx
                Profile/
                    modalP.css
                    Profile.tsx
                PublicCubes/
                    modalPC.css
                    PublicCubes.tsx
                MainMenu.tsx
            others/
                Loader.tsx
                ReviewStars.tsx
            signUp/
                SignUp.tsx
            TextEditor/
                HyperLinkButton.tsx
                ModifierButton.tsx
                TextArea.css
                TextArea.tsx
            mediaQueries/
                queriesComponents.tsx
                queriesStates.tsx
            redux/
                configureStore.tsx
                useReducer.tsx
            styles/
                globalStyles.tsx
            types/
                reduxTypes.tsx
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
