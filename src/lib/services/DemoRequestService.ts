import { provider } from '$lib/config'
import { error } from '@sveltejs/kit'
import type { Error } from '$lib/types'
import { post } from '$lib/utils/api'

export const saveScheduleDemo = async ({
	storeId,
	schedule,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(
					`saveScheduleDemo`,
					{
						schedule,
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
