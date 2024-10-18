import Iron from '@hapi/iron'
import isEmpty from 'lodash/isEmpty'

export async function encrypt(data: any) {
    let value: string = data
    if(typeof(data) != 'string') {
        value = JSON.stringify(data)
    }

    return Iron.seal(value, process.env.AES_SECRET, Iron.defaults)
}

export async function decrypt<T>(hash: string) : Promise<T> {
    if(isEmpty(hash)) {
        return undefined as T
    }
    const data: string = await Iron.unseal(hash, process.env.AES_SECRET, Iron.defaults)
    return JSON.parse(data)
}