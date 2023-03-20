import { addToCartService, fetchRefreshCart } from '$lib/services/CartService'
import { post } from '$lib/utils/server'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Action, Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, request, locals, cookies }) => {
	let loading = false
	let cart = locals.cart
		console.log("kkk",locals.cart)
			const cartId: string | undefined = cookies.get('cartId')
		console.log(cartId)
	//const cid = cookies.get('cartId')
	//console.log(cid)
	if(cartId != undefined){
	try {
		loading = true
		const res = await fetchRefreshCart({
			cartId: cartId,
			sid: cookies.get('sid'),
			server: true
		})
		if (res) {
			const cart = {
				hasPh:res?.data.attributes.hasPh,
				cartId: res?.data.id,
				items: res?.data.attributes.products.data,
				qty: res?.data.attributes.totalqty,
				tax: res?.data.attributes.tax,
				subtotal: res?.data.attributes.subtotal,
				total: res?.data.attributes.total,
				currencySymbol: res?.data.attributes.currencySymbol,
				discount: res?.data.attributes.discount,
				savings: res?.data.attributes.savings,
				selfTakeout: res?.data.attributes.selfTakeout,
				shipping: res?.data.attributes.shipping,
				unavailableItems: res?.data.attributes.unavailableItems.data,
				formattedAmount: res?.data.attributes.formattedAmount
			}

			cookies.set('cartId', cart.cartId, { path: '/' })
			cookies.set('cartQty', cart.qty, { path: '/' })
			 cookies.set('cart', JSON.stringify(cart), { path: '/' })
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
	}
	return { loadingCart: loading, cart }
}

const add: Action = async ({ request, cookies, locals }) => {
	const data = await request.formData()
	console.log("behhh",data)
	const pid = data.get('pid')
	 const prod = JSON.parse(data.get('prod'))
	 	console.log("behhh",prod.total)

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
			sid: cookies, // This is a special case to pass complete cookie
			prod: prod
		})

		if (cart) {
			console.log("ttt",cart)
			const cartObj = {
								hasPh:cart?.data.attributes.hasPh,
				cartId: cart?.data.id,
				items: cart?.data.attributes.products.data,
				qty: cart?.data.attributes.totalqty,
				tax: cart?.data.attributes.tax,
				subtotal: cart?.data.attributes.subtotal,
				total: cart?.data.attributes.total,
				currencySymbol: cart?.data.attributes.currencySymbol,
				discount: cart?.data.attributes.discount,
				savings: cart?.data.attributes.savings,
				selfTakeout: cart?.data.attributes.selfTakeout,
				shipping: cart?.data.attributes.shipping,
				unavailableItems: cart?.data.attributes.unavailableItems.data,
				formattedAmount: cart?.data.attributes.formattedAmount
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
