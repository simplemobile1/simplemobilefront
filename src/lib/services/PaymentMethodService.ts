import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { getAPI } from '$lib/utils/api'
import {  getBySid } from '$lib/utils/server'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchPaymentMethods = async ({ origin, storeId, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				if (server) {
					res = await getBySid(`payment-methods?store=${storeId}&active=true`, sid)
				} else {
					res = await getAPI(`payment-methods?store=${storeId}&active=true`, origin)
				}
				break

		}
		return res.data || []
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
