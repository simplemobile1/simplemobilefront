import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI, post } from '$lib/utils/api'
import {
	getBySid,

} from '$lib/utils/server'
import { error } from '@sveltejs/kit'

export const fetchReviews = async ({
	origin,
	storeId,
	pid,
	search,
	sort,
	currentPage,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(
						`reviews/${pid}?search=${
							search || ''
						}&sort=${sort}&page=${currentPage}&store=${storeId}`,
						sid
					)
				} else {
					res = await getAPI(
						`reviews/${pid}?search=${
							search || ''
						}&sort=${sort}&page=${currentPage}&store=${storeId}`,
						origin
					)
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

export const fetchProductReviews = async ({
	origin,
	storeId,
	pid,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`reviews/product-reviews?pid=${pid}&store=${storeId}`, sid)
				} else {
					res = await getAPI(`reviews/product-reviews?pid=${pid}&store=${storeId}`, origin)
				}
				break

		}
		return res?.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const saveReview = async ({
	storeId,
	id,
	pid,
	message,
	rating,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`reviews`,
					{
						id,
						pid,
						message,
						rating,
						store: storeId
					},
					origin
				)
				break

		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
