import { client } from '../../../config/redis';
import { genId } from '../../../utils/gen-id';
import { itemsKey } from '../../../utils/keys';
import type { CreateItemAttrs } from '../../types';
import { serialize } from './serialize';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));
	console.log(item);

	if (Object.keys(item).length === 0) {
		return null;
	}
	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});
	const results = await Promise.all(commands);
	return results
		.map((result, index) => {
			if (Object.keys(result).length === 0) {
				return null;
			}
			return deserialize(ids[index], result);
		})
		.filter(Boolean);
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();
	const serialized = serialize(attrs);
	await client.hSet(itemsKey(id), serialized);
	return id;
};
