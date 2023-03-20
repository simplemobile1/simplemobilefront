import type { RequestEvent } from '@sveltejs/kit'
import type { Me } from '$lib/types'
export const authenticateUser = (event: RequestEvent) => {
	console.log("server/aut.ts")
	const meFromCookie: string | undefined = event.cookies.get('me')
	if (meFromCookie) {
					console.log("server/aut.ts",JSON.stringify(meFromCookie))

		const me: Me = JSON.parse(meFromCookie)

			console.log("server/aut.ts", me)
		return {
			/*active: me.active,
			avatar: me.avatar,*/
			email: me.email,
			firstName: me.firstName,
				/*avatar: res.avatar,
			role: res.role,
			verified: res.verified,
			active: res.active*/
				id: me.id,
				tok: me.tok
				/*firstName: me.firstName,
			lastName: me.lastName,
			phone: me.phone,
			role: me.role,
			verified: me.verified*/
		}

	} else {
		return null
	}
}
