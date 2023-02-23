import { getBySid } from '$lib/utils/server'
import type { RequestEvent } from '@sveltejs/kit'

export const fetchCart = async (event: RequestEvent) => {
	try {
		console.log("somhowOnfetchcart")
		const cartId: string | undefined = event.cookies.get('cartId')
		console.log(cartId)
		const cartQty: string | undefined = event.cookies.get('cartQty')
		if (cartId) event.locals.cartId = cartId
				console.log(cartId)

		if (cartQty) event.locals.cartQty = +cartQty
		const sid = event.cookies.get('sid')
		const cartRes = await getBySid(`/carts/${cartId}`, sid)
		const cart = {
				cartId: cartRes?.data.id,
				items: cartRes?.data.attributes.products.data,
				qty: cartRes?.data.attributes.qty,
				tax: cartRes?.data.attributes.tax,
				subtotal: cartRes?.data.attributes.subtotal,
				total: cartRes?.data.attributes.total,
				currencySymbol: cartRes?.data.attributes.currencySymbol,
				discount: cartRes?.data.attributes.discount,
				savings: cartRes?.data.attributes.savings,
				selfTakeout: cartRes?.data.attributes.selfTakeout,
				shipping: cartRes?.data.attributes.shipping,
				unavailableItems: cartRes?.data.attributes.unavailableItems.data,
				formattedAmount: cartRes?.data.attributes.formattedAmount
			}
		return cart
	} catch (e) {
		return null
	}
}
