# cotalker-sdk

For Cotalker Partners, this library will help you communicate with Cotalker's API.
You can use javascript for retrieving some data but we encourage the use of typescript for a full usage of the package.
 


### Prerequisites
This project requires NodeJS and NPM. Node and NPM are really easy to install. To make sure you have them available on your machine, try running the following command.

```
    $ npm -v && node -v
```

If not we recommend the use of [NVM] (https://github.com/nvm-sh/nvm) which you can easily install with

```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

and then you can install node

```
    nvm install node
```

## How to Install and Run the Project

With node installed you can use npm, its default package manager. To install cotalker-sdk simply write in your terminal

```
    npm i cotalker-sdk
```

## How to Use the Project

You can now import Cotalker's API and use its methods to communicate with your workspace, by example:

```typescript
    import CotalkerAPI from "cotalker-sdk" 

    const token = "..."
    const  helloAPI = new CotalkerAPI(token)

```
