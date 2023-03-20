/** @type {import('./$types').Actions} */
import { HTTP_ST_ENDPOINT } from '$lib/config'
import { fail, redirect } from '@sveltejs/kit'
import { page } from '$app/stores'

let ref = page?.url?.searchParams.get('ref')

let loginError
export const actions = {
	login: async ({ cookies, request }) => {
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
			const res = await fetch(HTTP_ST_ENDPOINT + '/auth/local', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					identifier: email,
					password: password
				})
			})
				.then(checkStatus)
				.then(parseJSON)
			user = res
			console.log(res)

			cookies.set('sessiontc', user.jwt)
			console.log(cookies.get('sessiontc'))
			//me
			throw redirect(303, ref || '/')
		} catch (e) {
			let error1 = e
			console.log(error1)
			return fail(400)
		}
		return { success: true }
	}
}
