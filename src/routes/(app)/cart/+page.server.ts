import { addToCartService, fetchRefreshCart } from '$lib/services/CartService'
import { post } from '$lib/utils/server'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies }) => {
	let loading = false
	let cart = locals.cart
	try {
		loading = true
		const res = await fetchRefreshCart({
			storeId: locals.store?.id,
			sid: cookies.get('sid'),
			server: true
		})
		if (res) {
			cart = {
				cartId: res?.cart_id,
				items: res?.items,
				qty: res?.qty,
				tax: +res?.tax,
				subtotal: +res?.subtotal,
				total: +res?.total,
				currencySymbol: res?.currencySymbol,
				discount: res?.discount,
				savings: res?.savings,
				selfTakeout: res?.selfTakeout,
				shipping: res?.shipping,
				unavailableItems: res?.unavailableItems,
				formattedAmount: res?.formattedAmount
			}

			cookies.set('cartId', cart.cartId, { path: '/' })
			cookies.set('cartQty', cart.qty, { path: '/' })
			// cookies.set('cart', JSON.stringify(cart), { path: '/' })
			locals.cartId = cart.cartId
			locals.cartQty = cart.qty
			locals.cart = cart
		}
	} catch (e) {
		// console.log('Error at /cart/+page.server.ts page.....', e)
		if (e?.status === 401) {
			throw redirect(307, locals.store?.loginUrl || '/auth/login')
		}
		throw error(400, e?.message || e)
	} finally {
		loading = false
	}

	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	console.log("behhh",data)
	const pid = data.get('pid')
	//const vid = data.get('pid')
	//const linkedItems = JSON.parse(data.get('linkedItems'))
	//onst options = JSON.parse(data.get('options')) //data.get('options') //
	//const customizedImg = data.get('customizedImg')
	if (typeof pid !== 'string' || !pid) {
		return fail(400, { invalid: true })
	}
	try {
		let cart = await addToCartService({
			pid,
			//vid,
			qty: 1,
			//options,
			//customizedImg,
			//storeId: locals.store?.id,
		//	server: true,
			sid: cookies // This is a special case to pass complete cookie
		})
		
		if (cart) {
			console.log("ttt",cart)
			const cartObj = {
				cartId: cart?.data.id,
				items: cart?.data.attributes.products.data,
				qty: 1,
				/*tax: cart?.tax,
				subtotal: cart?.attributes.products.data.attributes.price,
				total: cart?.attributes.products.data.attributes.price,
				currencySymbol: cart?.currencySymbol,
				discount: cart?.discount,
				savings: cart?.savings,
				selfTakeout: cart?.selfTakeout,
				shipping: cart?.shipping,
				unavailableItems: cart?.unavailableItems,
				formattedAmount: cart?.formattedAmount*/
			}
			locals.cart = cartObj
			locals.cartId = cartObj.cartId
			locals.cartQty = cartObj.qty
			cookies.set('cartId', cartObj.cartId, { path: '/' })
			cookies.set('cartQty', cartObj.qty, { path: '/' })
			return cartObj
		} else {
			return {}
		}
	} catch (e) {
		return {}
	}
}

export const actions: Actions = { add }
