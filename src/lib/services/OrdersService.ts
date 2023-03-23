import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import {
	getBySid,

	postBySid,

} from '$lib/utils/server'
import { provider } from '$lib/config'
import type { AllOrders, Error } from '$lib/types'
import { mapMedusajsOrder, mapMedusajsAllOrders } from '$lib/utils'
import { posttStrapi } from '$lib/utils/strapi'

export const fetchOrders = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: AllOrders | {} = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/my?store=${storeId}&active=true`, sid)
				} else {
					res = await getAPI(`orders/my?store=${storeId}&active=true`, origin)
				}
				break

		}

		return {
			data: res.data || [],
			count: res.count,
			pageSize: res.pageSize,
			noOfPage: res.noOfPage,
			page: res.page
		}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`orders/${id}?store=${storeId}`, sid)
				} else {
					res = await getAPI(`orders/${id}?store=${storeId}`, origin)
				}
				break

		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const fetchTrackOrder = async ({ origin, storeId, id, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`order-tracking?order=${id}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`order-tracking?order=${id}&store=${storeId}`, origin)
				}
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const paySuccessPageHit = async ({
	origin,
	paymentMode,
	orderId,
	storeId,
	status,
	id,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {

			case 'strapi':
				if (server) {
					res = await postBySid(
						`orders/pay-sucess-page-hit`,
						{
							paymentMode,
							status,
							orderId,
							store: storeId
						},
						sid
					)
				} else {
					res = await post(
						`orders/pay-sucess-page-hit`,
						{
							paymentMode,
							status,
							orderId,
							store: storeId
						},
						origin
					)
				}
				break

		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
export const paypalCheckout = async ({
	address,
	paymentMethod,
	prescription,
	cartId,
	origin,
	details,
	uId,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
				case 'litekart':
					const data = {"data": {
    							"paymentCode": details,
								"cart":cartId,
								"users_permissions_user":uId
    				}
			}

			res = await	posttStrapi("/order",data, sid)
									console.log("tt",res)
			case 'strapi':
				res = await post(
					`payments/checkout
					-rp`,
					{
						address,
						paymentMethod,
						prescription,
						store: storeId
					},
					origin
				)
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
export const codCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`orders/checkout/cod`,
					{
						address,
						paymentMethod,
						prescription,
						store: storeId
					},
					origin
				)
				break

		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const cashfreeCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/checkout-cf`,
					{
						address,
						prescription,
						store: storeId
					},
					origin
				)
				break

		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCheckout = async ({
	address,
	paymentMethod,
	prescription,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/checkout-rp`,
					{
						address,
						paymentMethod,
						prescription,
						store: storeId
					},
					origin
				)
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const razorpayCapture = async ({
	rpPaymentId,
	rpOrderId,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`payments/capture-rp`,
					{
						rpPaymentId,
						rpOrderId,
						store: storeId
					},
					origin
				)
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const stripeCheckoutService = async ({
	paymentMethodId,
	address,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`stripe`,
					{
						paymentMethodId,
						address,
						store: storeId
					},
					origin
				)
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
