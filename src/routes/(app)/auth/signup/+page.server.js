/** @type {import('./$types').Actions} */
import { HTTP_ST_ENDPOINT } from '$lib/config'
import { fail, redirect } from '@sveltejs/kit'
import { page } from '$app/stores'

let loginError
export const actions = {
	sing: async ({ cookies, request }) => {
		console.log(request)
		let ref = new URL(request.url) //
		const x = ref.searchParams.get('ref')

		const data = await request.formData()
		console.log(data.get('email'))
		const email = data.get('email')
		if (!email) {
			return fail(400, { email, missing: true })
		}
		const password = data.get('password')
		if (!password) {
			return fail(400, { password, missing: true })
		}
		const firstName = data.get('firstName') || ''
		const lastName = data.get('lastName') || ''
		if (!lastName && !firstName) {
			return fail(400, { email, missing: true })
		}
		let user
		const parseJSON = (resp) => (resp.json ? resp.json() : resp)
		const checkStatus = (resp) => {
			if (resp.status >= 200 && resp.status < 300) {
				return resp
			}
			return parseJSON(resp).then((resp) => {
				throw resp
			})
		}
		try {
			const res = await fetch(HTTP_ST_ENDPOINT + '/auth/local/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: firstName + ' ' + lastName,
					email: email,
					password: password
				})
			})
				.then(checkStatus)
				.then(parseJSON)
			user = res
			console.log(res)

			cookies.set('sessiontc', user.jwt)
			console.log(cookies.get('sessiontc'))
			const me = {
				email: user.user.email,
				firstName: user.user.username,
				/*avatar: res.avatar,
			role: res.role,
			verified: res.verified,
			active: res.active*/
				id: user.user.id,
				tok: user.jwt
			}

			cookies.set('me', JSON.stringify(me), { path: '/' })
			console.log(ref, x)
		} catch (e) {
			let error1 = e
			console.log(error1)
			return fail(400)
		}
		throw redirect(303, x || '/')
	}
}
