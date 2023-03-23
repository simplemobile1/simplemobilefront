import { error } from '@sveltejs/kit'
import { getAPI } from '$lib/utils/api'
import {  getBySid } from '$lib/utils/server'
import type { Error } from '$lib/types'
import { provider } from '$lib/config'

export const fetchFaqs = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`faqs?store${storeId}`, sid)
				} else {
					res = await getAPI(`faqs?store${storeId}`, origin)
				}
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
