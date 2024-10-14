import axios from 'axios';
import { Logger } from '../utils/logger';
import { OptionsInterface } from '../interface/options.interface';
import { AddressInterface } from '../interface/address.interface';

const VIA_CEP_URL = 'https://viacep.com.br/ws/';
const API_CEP_URL = 'https://cdn.apicep.com/file/apicep/';
const OPEN_CEP_URL = 'https://opencep.com/v1/';
const BRASIL_API_URL = 'https://brasilapi.com.br/api/cep/v2/';
const CEP_REGEX = /^[0-9]{5}-?[0-9]{3}$/;

export class CepService {
    private options: OptionsInterface;

    constructor(options: OptionsInterface = {}) {
        this.options = options;
    }

    private log(message: string) {
        if (this.options.log) Logger.log(message);
    }

    private normalizeCep(cep: string): string {
        return cep.replace(/\D/g, '');
    }

    private async fetchAddress(url: string, fallbackZipCode: string): Promise<AddressInterface | null> {
        try {
            const { data, status } = await axios.get(url);
            if (status === 200 && !data.erro) {
                return {
                    state: data.uf || data.estado || data.state,
                    city: data.localidade || data.city,
                    street: data.logradouro || data.address || '',
                    neighborhood: data.bairro || data.district || data.neighborhood || '',
                    zipCode: fallbackZipCode,
                };
            }
        } catch (error: any) {
            this.log(`Error: ${error.message}`);
        }
        return null;
    }

    async consultViaCep(zipCode: string): Promise<AddressInterface | null> {
        this.log('Consulting ViaCEP...');
        const normalizedCep = this.normalizeCep(zipCode);
        return this.fetchAddress(`${VIA_CEP_URL}${normalizedCep}/json`, normalizedCep);
    }

    async consultApiCep(zipCode: string): Promise<AddressInterface | null> {
        this.log('Consulting ApiCEP...');
        const normalizedCep = this.normalizeCep(zipCode);
        const formattedCep = normalizedCep.length === 8 ? `${normalizedCep.slice(0, 5)}-${normalizedCep.slice(5)}` : normalizedCep;
        return this.fetchAddress(`${API_CEP_URL}${formattedCep}.json`, normalizedCep);
    }

    async consultOpenCep(zipCode: string): Promise<AddressInterface | null> {
        this.log('Consulting OpenCEP...');
        const normalizedCep = this.normalizeCep(zipCode);
        return this.fetchAddress(`${OPEN_CEP_URL}${normalizedCep}`, normalizedCep);
    }

    async consultBrasilApi(zipCode: string): Promise<AddressInterface | null> {
        this.log('Consulting BrasilAPI...');
        const normalizedCep = this.normalizeCep(zipCode);
        return this.fetchAddress(`${BRASIL_API_URL}${normalizedCep}`, normalizedCep);
    }

    async searchAddressByZipCode(zipCode: string): Promise<AddressInterface> {
        const services = [
            this.consultViaCep(zipCode),
            this.consultApiCep(zipCode),
            this.consultOpenCep(zipCode),
            this.consultBrasilApi(zipCode),
        ];

        for (const service of services) {
            const address = await service;
            if (address) return address;
        }

        this.log('Error: Zip code not found.');
        throw new Error('Zip code not found.');
    }

    verify(cep: string): boolean {
        const isValid = CEP_REGEX.test(cep);
        this.log(`CEP validation for ${cep}: ${isValid ? 'Valid' : 'Invalid'}`);
        return isValid;
    }
}
