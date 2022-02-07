## products-api

`products-api `lets user get the merged catalog products on initial load.

## Code Structure
```
── README.md
├── package-lock.json
├── package.json
├── src
│   ├── application
│   │   ├── middleware
│   │   │   ├── mergedProductsMiddleware.test.ts
│   │   │   └── mergedProductsMiddleware.ts
│   │   └── product
│   │       ├── productsController.test.ts
│   │       ├── productsController.ts
│   │       └── productsControllerInterface.ts
│   ├── config.ts
│   ├── entities
│   │   ├── barcode.test.ts
│   │   ├── barcode.ts
│   │   ├── catalogProduct.test.ts
│   │   ├── catalogProduct.ts
│   │   └── productsCatalogRespositoryInterface.ts
│   ├── infrastructure
│   │   ├── fileStorage
│   │   │   ├── input
│   │   │   │   ├── barcodesA.csv
│   │   │   │   ├── barcodesB.csv
│   │   │   │   ├── catalogA.csv
│   │   │   │   ├── catalogB.csv
│   │   │   │   ├── suppliersA.csv
│   │   │   │   └── suppliersB.csv
│   │   │   └── output
│   │   │       └── result_output.csv
│   │   └── productsCatalogRepository.ts
│   ├── routes
│   │   └── productsRouter.ts
│   ├── server.ts
│   ├── usecases
│   │   └── getProducts
│   │       ├── getProductsInteractor.test.ts
│   │       └── getProductsInteractor.ts
│   └── utils
│       └── errors.ts
└── tsconfig.json
```    

The solution is organized as per the folder structure you [see above](#code-structure).
`routes` - routers is where all end points are handled
`controllers` - controllers are handlers called from routers
`middleware` - middleware to merge catalog products on initialize
`use cases` - use cases implements actions that can be invoked using controllers to fulfil a request
`infrastructure` - has a file storage implementation
`entities` - has all entities and business logic independent of the application request

Test cases have also been included in every folder as part of [TDD](https://en.wikipedia.org/wiki/Test-driven_development) approach that I have followed during development.

# Design considerations
- The structure seen [above](#code-structure) is based on [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) that uphold [SOLID](https://en.wikipedia.org/wiki/SOLID) principles

- File interactions are abstracted using an interface. This approach allows seamless migration to a data storage engine of choice (dynamo, memory etc).

# Technology
- The solution uses Node.js with Typescript
- Tests are implemented using Jest

# End points
1. `GET /products` - merges the catalog from catalogA.csv and catalogB.csv in output_results under output folde for unique products and returns it 
```
    [
    {
        "source": "A",
        "sku": "647-vyk-317",
        "description": "Walkers Special Old Whiskey"
    },
    {
        "source": "A",
        "sku": "280-oad-768",
        "description": "Bread - Raisin"
    }]
```

# Usage
Ensure [npm and node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is installed. 

To install all required packages use: 
```
    npm install
```

To build the source code and run all the tests:
```
    npm run build
    npm run test
```

To boot up the application: 
```
    npm run start
```

To generate output please send a request to  `localhost:7654/products` end point 

> Note:  The application end point is configured to listen on `localhost:7654`

