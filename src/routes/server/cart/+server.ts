import { fetchMyCart } from '$lib/services/CartService'

export async function GET({ request, locals, cookies }) {
	console.log("fetchMyCard")
		let cart: any = {}

	let cartId =  locals.cartId ?? cookies.get('cartId')
	if(cartId != undefined){
	const d = new Date()
	cart = await fetchMyCart({
		storeId: slocals.tore?.id,
		cartId: locals?.cartId,
		sid: cookies.get('sid')
	})
	const d3 = new Date()
	locals.cartId = cart.cart_id
	locals.cartQty = cart.qty
	locals.cart = cart
	cookies.set('cartId', cart.cart_id, { path: '/' })
	cookies.set('cartQty', cart.qty, { path: '/' })
	} else{//else if (locals?.me?.car)
			let cart: any = {}
	}
	return new Response(JSON.stringify(cart))
}
