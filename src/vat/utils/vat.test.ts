import { checkVat } from './vat'

describe('vat', () => {
	it('should return vat information', async () => {
		const vat = await checkVat({
			countryCode: 'BE',
			number: '0794123756',
		})

		expect(vat?.name).toBeDefined()
		expect(vat?.vatNumber).toBeDefined()
	})
})
