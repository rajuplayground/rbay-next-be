import { genId } from '../../utils/gen-id';
import { client } from '../../config/redis';
import { usersKey, usernamesUniqueKey, usernamesKey } from '../../utils/keys';

export interface CreateUserAttrs {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
}

export const getUserByUsername = async (username: string): Promise<User> => {
  // Use the username argument to look up the person's User ID
  // with the usernames sorted set
  const decimalId = await client.zScore(usernamesKey(), username);

  // make sure we actually got an ID from the lookup
  if (!decimalId) {
    throw new Error('User does not exist');
  }

  // Take the id and convert it back to hex
  const id = decimalId.toString(16);
  // Use the id to look up the user's hash
  const user = (await client.hGetAll(usersKey(id))) as { [key: string]: string };

  // deserialize and return the hash
  return deserialize(id, user);
};

export const getUserById = async (id: string): Promise<User> => {
  const user = (await client.hGetAll(usersKey(id))) as { [key: string]: string };

  if (Object.keys(user).length === 0) {
    throw new Error('User does not exist');
  }

  return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs): Promise<string> => {
  const id = genId();

  const exists = await client.sIsMember(usernamesUniqueKey(), attrs.username);
  if (exists) {
    throw new Error('Username is taken');
  }

  await client.hSet(usersKey(id), serialize(attrs));
  await client.sAdd(usernamesUniqueKey(), attrs.username);
  await client.zAdd(usernamesKey(), {
    value: attrs.username,
    score: parseInt(id, 16)
  });

  return id;
};

const serialize = (user: CreateUserAttrs) => {
  return {
    username: user.username,
    password: user.password
  };
};

const deserialize = (id: string, user: { [key: string]: string }): User => {
  return {
    id,
    username: user.username,
    password: user.password
  };
};
