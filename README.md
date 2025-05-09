# cotalker-sdk

Cotalker SDK is the official SDK for Cotalker Partners. It allows easy and secure communication with the Cotalker's API 
 


### Prerequisites
This project requires NodeJS and NPM. Node and NPM are really easy to install. To make sure you have them available on your machine, try running the following command.

```
    $ npm -v && node -v
```

If not we recommend the use of [NVM] (https://github.com/nvm-sh/nvm) which you can easily install with

```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

and then you can install node in the repository directory

```
    nvm install
    nvm use
```

## How to Install and Run the Project

With node installed you can use npm, its default package manager. To install cotalker-sdk simply write in your terminal

```
    npm i cotalker-sdk
```

## How to Use the Project

You can now import Cotalker's API and use its methods to communicate with your workspace, by example:

```typescript
    import { CotalkerAPI } from "cotalker-sdk" 

    const token = "..."
    const  helloAPI = new CotalkerAPI(token)

```

Each API module is exposed through a specific client. To access a client:

```typescript
    const client = cotalkerapi.getCOTModelClient();
    const result = await client.methodName({
       // required parameters
    });
```
* Replace <Model> with the desired module, for example: OpenAI, User, Form, etc.

## How to install and run the project locally

For local testing (development version)

If you've made local changes and want to test the SDK before publishing:

1. Run the pack command to generate a .tgz file:

   ```
    npm run pack
   ```

2. Install the generated package in your test project:

   ```
    npm install cotalker-sdk/cotalker-sdk-x.y.z.tgz
   ```
   * Replace x.y.z with the actual version number of the generated package.
   * check the correct route of the package

 ## Committing and Publishing Changes

When finalizing your changes, make sure to commit using semantic versioning in your commit message. This ensures the correct version bump and successful publishing to NPM.

Use one of the following conventional commit types:

* BREAKING CHANGE
  
* feat

* fix

Example:

   ```
    git commit -m "feat(<scope>): add <new feature>"

   ```

 Once committed and pushed, the version will automatically be updated and published to NPM (if using a release workflow).
