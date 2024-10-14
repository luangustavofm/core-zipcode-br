import axios from 'axios';
import { CepService } from '../service/cep.service';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CepService', () => {
  let cepService: CepService;

  beforeEach(() => {
    cepService = new CepService({ log: false });
  });

  it('should validate a correct CEP', () => {
    const isValid = cepService.verify('01001-000');
    expect(isValid).toBe(true);
  });

  it('should invalidate an incorrect CEP', () => {
    const isValid = cepService.verify('invalid-cep');
    expect(isValid).toBe(false);
  });

  it('should return address when consulting ViaCEP', async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
        uf: 'SP',
        localidade: 'São Paulo',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
      },
    });

    const address = await cepService.consultViaCep('01001-000');
    expect(address).toEqual({
      state: 'SP',
      city: 'São Paulo',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      zipCode: '01001000',
    });
  });

  it('should return null for invalid ViaCEP request', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const address = await cepService.consultViaCep('00000-000');
    expect(address).toBeNull();
  });

  it('should throw an error when ZIP code is not found', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { erro: true },
    });

    await expect(cepService.searchAddressByZipCode('00000-000')).rejects.toThrow('Zip code not found.');
  });
});
