import { getVATNumberFromText, getVATNumbers } from '../../lib/utils/ocr'

const mockedText = `
z U OO A
> 5100236578714
CAESATVeEntiires
JUTDOOR & ACTION
v
Maes - Verstraete
address Lemmensplein 777b
2397 Huldenberg
Klantcode BTW Nummer Factuurnummer Factuurdatum Vervaldatum
Factuur 90004156789124 BE0794123756 104346 12/12/2022 31/04/2023
Omschrijving Aantal  Verkoopprijs BTW % Totaal
Transactie: 5100045678734, Datum: 17/12/2022
Aankopen
3452D70007 Beani FR Byron Hat Donkergrijs One size 1 42,95 21% 42,95
B13JAB0056 Glov TNF M Apex Etip Glove Zwart L 1 49,95 21% 49,95
Basis totaal 76,78 €
BTW totaal 16,12 €
Totaal 92,80 €
Afgeronde betalingen 92,90 €
Totaal aantal stuks 2
BTW BTW % Netto Basis BTW Totaal
Omzet 21% 66,23 23,23 16,12 92,90
Netto te betalen 92,80
Betaald Bedrag
Bancontact/Mister Cash Store 92,90
POI: 01877858KLANTTICKET e e mmceemm e oo e emceee Martens VZW
Martens VZW- street 9 - 2660 Hoboken - BTW BE-0794.123.756 - RPR Antwerpen - IBAN BA321066473001054005 - BIC GEBABEBB
`

describe('ocr', () => {
	it('should return a vat number', async () => {
		expect(getVATNumberFromText(mockedText)).toEqual({
			countryCode: 'BE',
			number: '0794123756',
		})
	})
})

describe('vat', () => {
	it('should return the VAT', async () => {
		expect(getVATNumbers('BE-0794.123.756')).toEqual(['BE0794123756'])
		expect(getVATNumbers('BE0794123756')).toEqual(['BE0794123756'])
		expect(getVATNumbers('BE 0794.123.756')).toEqual(['BE0794123756'])
	})
})
