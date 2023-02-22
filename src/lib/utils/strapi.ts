import cookie from 'cookie'
import datavi from './../data/store.json'
import {
	HTTP_ST_ENDPOINT,
	provider,
	
} from '../config'


//import { serialize } from '.'

export function mapStrapi (dat){
let res = dat.attributes
res.id = dat.id
return res
} 

export async function posttStrapi(endpoint: string, data: any, ck?: any) {
	const ep = HTTP_ST_ENDPOINT + endpoint + "?populate=*"
	console.log("ep,data",ep,data)
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
export async function postStrapi(endpoint: string, data: any, sid?: string) {
	
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
export async function getStrapi(endpoint: string, ck?: any) {
	console.log("strapi!", endpoint)
	const ck1 = cookie.parse(ck || '')
	const ep = HTTP_ST_ENDPOINT + endpoint
		console.log("strapi!", ep)

	const response = await fetch(ep, {
		method: 'GET',
		//credentials: 'include',
		headers: { cookie: `sid=${ck1.sid}` }
	})
	const isJson = response.headers.get('content-type')?.includes('application/json')

	const res = isJson ? await response.json() : await response.text()
	if (res?.status > 399) {
		throw { status: res.status, message: res }
	} else if (response?.status > 399) {
		throw { status: response.status, message: res }
	} else {
		console.log("strapi!!!",res)
		return res
	}
}
export const getByStrapi = async (endpoint: string, sid?: any) => {
	console.log(endpoint,sid, "tyt")
	if (!endpoint.startsWith("init")){
	const response = await fetch("http://localhost:1337" + '/api/' + endpoint, {
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
