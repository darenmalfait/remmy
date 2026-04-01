import { PeppolToolkit } from '@pixeldrive/peppol-toolkit'

const toolkit = new PeppolToolkit()

export function parseXmlToInvoice(xml: string) {
	return toolkit.peppolUBLToInvoice(xml)
}
