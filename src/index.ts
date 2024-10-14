import { CepService } from "./service/cep.service";

const cepService = new CepService();

async function consult(cep: string) {
    try {
        const result = await cepService.searchAddressByZipCode(cep);
        console.log(result);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
}

function verify(cep: string) {
    const isValid = cepService.verify(cep);
    console.log(isValid ? "Valid zip code" : "Invalid zip code");
}

const cep = "72302-304";
verify(cep);
consult(cep);
