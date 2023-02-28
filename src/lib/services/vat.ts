import fetch from 'node-fetch'

type VatType = {
  vatNumber: string
  requestDate: string
  valid: boolean
  name: string
}

async function checkVat({
  countryCode,
  number,
}: {
  countryCode?: string
  number?: string
}): Promise<VatType | null> {
  if (!countryCode || !number) {
    return null
  }

  try {
    const result = await fetch(
      `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${number}`,
    )

    const data = await result.json()

    return data as VatType
  } catch (error) {
    console.error(error.message)
  }

  return null
}

export {checkVat}
