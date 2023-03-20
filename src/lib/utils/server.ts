import cookie from 'cookie'
import datavi from './../data/store.json'
import datame from './../data/home.json'
import { getStrapi } from './strapi'
import {
	HTTP_ENDPOINT,

} from '../config'

export async function postt(endpoint: string, data: any, ck?: any) {
	console.log("server.ts postt", endpoint)
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response: any = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `sid=${ck.get('sid')}`
		}
	})
	const sid: string | null = response.headers.get('set-cookie')
	if (sid) {
		const sidCookie: any = cookie.parse(sid)
		ck.set('sid', sidCookie.sid, {
			path: '/'
		})
	}
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export async function postBySid(endpoint: string, data: any, sid?: string) {
		console.log("server.ts postBySid", endpoint)

	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify(data || {}),
		headers: {
			'Content-Type': 'application/json',
			cookie: `sid=${sid}`
		}
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export async function gett(endpoint: string, ck?: any) {
			console.log("server.ts gett", endpoint)


	const ck1 = cookie.parse(ck || '')
	const ep = HTTP_ENDPOINT + '/api/' + endpoint
	const response = await fetch(ep, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `sid=${ck1.sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		return res
	}
}
export const getBySid = async (endpoint: string, sid?: any) => {
				console.log("server.ts getBySid", endpoint, sid)

	if (endpoint.startsWith("init")){
			return datavi
	}else if (endpoint.startsWith("home")){
		return datame
	}else if (endpoint.startsWith("/carts")){
		const res = await getStrapi(`${endpoint}?populate=*`)
		return res
	}else{
		console.log("wedont kmo " ,endpoint)
		/*
	const response = await fetch(HTTP_ENDPOINT + '/api/' + endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (response?.status > 399) {
		throw { status: response.status, message: response.statusText }
	} else {
		return res
		*/
	}

}
export const getByStrapi = async (endpoint: string, sid?: any) => {
					console.log("server.ts getByStrapi", endpoint, sid)

	if (!endpoint.startsWith("init")){
	const response = await fetch(HTTP_ENDPOINT + '/api/' + endpoint, {
		method: 'GET',
		credentials: 'include',
		headers: { cookie: `sid=${sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')
	const res = isJson ? await response.json() : await response.text()
	if (response?.status > 399) {
		throw { status: response.status, message: response.statusText }
	} else {
		return res
	}
} else {
	return datavi
}
}
