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
			cartId: cartRes.data.id,
			items: cartRes.data.attributes.products,
			qty: 1,
			/*tax: cartRes.tax,
			subtotal: cartRes.subtotal,
			total: cartRes.total,
			currencySymbol: cartRes.currencySymbol,
			discount: cartRes.discount,
			selfTakeout: cartRes.selfTakeout,
			shipping: cartRes.shipping,
			unavailableItems: cartRes.unavailableItems,
			formattedAmount: cartRes.formattedAmount*/
		}
		return cart
	} catch (e) {
		return null
	}
}
