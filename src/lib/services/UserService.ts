import { provider } from '$lib/config'
import type { Error } from '$lib/types'
import { del, getAPI, post, put } from '$lib/utils/api'
import {
	getBigCommerceApi,
	getBySid,
	getWooCommerceApi,
	postBigCommerceApi,
	postWooCommerceApi
} from '$lib/utils/server'
import { postStrapi } from '$lib/utils/strapi'
import { serializeNonPOJOs } from '$lib/utils/validations'
import { error } from '@sveltejs/kit'

export const fetchMeData = async ({ origin, storeId, server = false, sid = null ,userId}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				console.log(sid,"getme")
			res = await postStrapi(
					`/user/`+userId,
					{
						username: firstName + " " + lastName,
						email: email,
						password: password
					}
				)
				break
				case 'strapi':
				if (server) {
					res = await getBySid(`users/me?store=${storeId}`, sid)
				} else {
					res = await getAPI(`users/me?store=${storeId}`, origin)
				}
				break
			case 'bigcommerce':
				res = await getBigCommerceApi(`users/me`, {}, sid)
				break
			case 'woocommerce':
				res = await getWooCommerceApi(`users/me`, {}, sid)
				break
		}
		return res || {}
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const signupService = async ({
	firstName,
	lastName,
	email,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
						console.log("nbnnnn jjjjj")

				res = await postStrapi(
					`/auth/local/register`,
					{
						username: firstName + " " + lastName,
						email: email,
						password: password
					}
				)
				break
				case 'strapi':
				res = await post(
					`signup`,
					{
						firstName,
						lastName,
						phone,
						email,
						password,
						passwordConfirmation,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const googleOneTapLoginService = async ({
	data,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await post(`auth/google/onetap`, data, origin)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`auth/google/onetap`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`auth/google/onetap`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const loginService = async ({
	email,
	password,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await postStrapi(
					`/auth/local`,
					{
						identifier: email,
						password: password
					}
				)
				break
			case 'strapi':
				res = await post(
					`login`,
					{
						email,
						password,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const forgotPasswordService = async ({
	email,
	referrer,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
					res = await postStrapi(
					`/auth/forgot-password`,
					{
						email: email					}
				)
				break
			case 'strapi':
				res = await post(
					`users/forgot-password`,
					{
						email,
						referrer,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const changePasswordService = async ({
	oldPassword,
	password,
	passwordConfirmation,
	storeId,
	origin,
	server = false,
	sid = null
}: any) => {

	try {
		let res: any = {}
		switch (provider) {
				case 'litekart':
					res = await postStrapi(
					`/auth/reset-password`,
					{
						code: 'privateCode', // code contained in the reset link of step 3.
    					password: password,
    					passwordConfirmation: passwordConfirmation,
					}
				)
				break
			case 'strapi':
				res = await post(
					`users/change-password`,
					{
						oldPassword,
						password,
						passwordConfirmation,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const getOtpService = async ({
	firstName,
	lastName,
	phone,
	email,
	password,
	passwordConfirmation,
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
					`get-otp`,
					{
						phone,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const verifyOtpService = async ({
	phone,
	otp,
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
					`verify-otp`,
					{
						phone,
						otp,
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const logoutService = async ({ storeId, origin, server = false, sid = null }: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await del(
					`logout`,
					{
						store: storeId
					},
					origin
				)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`signup`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`signup`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}

export const updateProfileService = async ({
	storeId,
	e,
	origin,
	server = false,
	sid = null
}: any) => {
	try {
		let res: any = {}
		switch (provider) {
			case 'litekart':
				res = await put(`users/update-profile`, e, origin)
				break
			case 'bigcommerce':
				res = await postBigCommerceApi(`users/update-profile`, {})
				break
			case 'woocommerce':
				res = await postWooCommerceApi(`users/update-profile`, {})
				break
		}
		return res
	} catch (e) {
		throw error(e.status, e.data?.message || e.message)
	}
}
