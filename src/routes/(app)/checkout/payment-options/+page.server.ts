import { redirect } from '@sveltejs/kit'
import { fetchAddress } from '$lib/services/AddressService'
import { fetchPaymentMethods } from '$lib/services/PaymentMethodService'
import { fetchRefreshCart } from '$lib/services/CartService'

export const prerender = false

export async function load({ params, parent, locals, url, request, cookies }) {
	const { me } = locals
	if (!me) {
		const redirectUrl = `${locals.store?.loginUrl || '/auth/login'}?ref=${url?.pathname}`
		throw redirect(307, redirectUrl)
	}
	const cartRes: any = await fetchRefreshCart({
		cartId: locals.cartId,
		server: true,
		sid: cookies.get('sid')
	})
	const cart = {
								hasPh:cartRes?.data.attributes.hasPh,
				cartId: cartRes?.data.id,
				items: cartRes?.data.attributes.products.data,
				qty: cartRes?.data.attributes.totalqty,
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
	
	locals.cart = cart
	if(cart.hasPh){
	try {
		const id = url.searchParams.get('address')

		const address = await fetchAddress({
			storeId: locals.store?.id,
			server: true,
			id,
			sid: cookies.get('sid')
		})
		const paymentMethods = await fetchPaymentMethods({ storeId: locals.store.id, server: true })
		return { paymentMethods, address, addressId: id, me, cart }
	} catch (e) {
		if (e) {
			throw redirect(307, '/checkout/address')
		}
	}
}
}
