# Core Zipcode BR

**Core Zipcode BR** is a Brazilian ZIP code validation and lookup library for Node.js and TypeScript. It provides address lookup from various Brazilian CEP services (ViaCEP, API CEP, OpenCEP, BrasilAPI) and validates ZIP codes based on the Brazilian format.

## Features

- Validate Brazilian ZIP codes (CEP) with `verify` function.
- Lookup addresses from multiple CEP services.
- Supports ViaCEP, API CEP, OpenCEP, and BrasilAPI for address lookup.
- Optional logging to monitor which service is being queried.
- Built with TypeScript and fully typed.

## Installation

To install the package, run:

```bash
npm install core-zipcode-br
```

## Usage

### 1. Validate a CEP

You can verify if a CEP (Brazilian ZIP code) is valid according to the Brazilian format.

```ts
import { CepService } from 'core-zipcode-br';

const cepService = new CepService();
const isValid = cepService.verify('01001-000'); // true or false
console.log(isValid ? 'Valid CEP' : 'Invalid CEP');
```

### 2. Lookup an Address by CEP

The `consult` method allows you to retrieve address details based on a Brazilian ZIP code (CEP). The service will query multiple providers (ViaCEP, API CEP, OpenCEP, BrasilAPI) and return the first result found.

```ts
import { CepService } from 'core-zipcode-br';

const cepService = new CepService();
cepService.searchAddressByZipCode('01001-000')
    .then((address) => {
        console.log(address);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
```

### 3. Enable Logging (Optional)

By default, logging is disabled. If you'd like to see which service is being queried, you can pass `{ log: true }` when initializing `CepService`.

```ts
import { CepService } from 'core-zipcode-br';

const cepService = new CepService({ log: true });
cepService.searchAddressByZipCode('01001-000')
    .then((address) => {
        console.log(address);
    });
```

### Example Output

```json
{
  "state": "SP",
  "city": "São Paulo",
  "street": "Praça da Sé",
  "neighborhood": "Sé",
  "zipCode": "01001000"
}
```

## API

### `verify(cep: string): boolean`

Validates the format of a Brazilian CEP. Returns `true` if the CEP is valid, otherwise `false`.

### `searchAddressByZipCode(cep: string): Promise<AddressInterface>`

Looks up the address by CEP. If no services return a valid result, it throws an error.

### Options Interface

```ts
interface OptionsInterface {
  log?: boolean; // Enable or disable logging
}
```

### Address Interface

```ts
interface AddressInterface {
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  zipCode: string;
}
```

## Data Providers

This library uses the following services for Brazilian ZIP code lookups:

- [ViaCEP](https://viacep.com.br): Free and public service to retrieve address information based on Brazilian ZIP codes.
- [API CEP](https://apicep.com): Provides reliable and fast access to Brazilian address information via a simple API.
- [OpenCEP](https://opencep.com): Collaborative and open-source CEP lookup service.
- [BrasilAPI](https://brasilapi.com.br): A collection of open and free APIs for Brazilian data, including CEP lookup.

Please respect the usage limits of each service when using this library in your applications.

## Testing

Run the tests using `Jest`:

```bash
npm run test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Linting

To check and fix code formatting and linting issues:

```bash
npm run lint
```

## License

This project is licensed under the ISC License.

## Author

[Luan Gustavo](https://github.com/luangustavofm)