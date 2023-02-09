import { error } from '@sveltejs/kit'
import { getAPI, post } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getWooCommerceApi,
	postBigCommerceApi,
	postBySid,
	postWooCommerceApi,
	getMedusajsApi
} from '$lib/utils/server'
import { provider } from '$lib/config'
import { serializeNonPOJOs } from '$lib/utils/validations'
import type { AllOrders, Error } from '$lib/types'
import { mapMedusajsOrder, mapMedusajsAllOrders } from '$lib/utils'

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
			case 'medusajs':
				const med = (await getMedusajsApi(`products`, {}, sid)).product
				res = mapMedusajsAllOrders(med)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/my`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/my`, {}, sid)
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
			case 'medusajs':
				const med = (await getMedusajsApi(`products`, {}, sid)).product
				res = mapMedusajsOrder(med)
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`orders/${id}`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`orders/${id}`, {}, sid)
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
			case 'bigcommerce':
				res = await getBigCommerceApi(`order-tracking`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`order-tracking`, {}, sid)
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
			case 'litekart':
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`orders/pay-sucess-page-hit`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`orders/pay-sucess-page-hit`, {}, sid)
				break
		}
		return res || {}
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`orders/checkout/cod`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`orders/checkout/cod`, {}, sid)
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/checkout-cf`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/checkout-cf`, {}, sid)
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/checkout-rp`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/checkout-rp`, {}, sid)
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`payments/capture-rp`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`payments/capture-rp`, {}, sid)
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
			case 'bigcommerce':
				res = await postBigCommerceApi(`stripe`, {}, sid)
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`stripe`, {}, sid)
				break
		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
