import { Router } from "express";

import { get, post } from './handlers';

import { getByHash, putByHash, deleteByHash } from './hash/handlers'

//Utils
import { limiter, validator, authorization } from "../../helpers";

// Schemas
import { createUser } from "../../schemas";

export const router = Router();

// /
router.get('/',[ authorization, limiter(2, 1000 * 60) ], get);
router.post('/', [ validator(createUser) ], post);

// /:userHash
router.get('/:userHash', [ authorization ], getByHash);
router.put('/:userHash', [ authorization ], putByHash);
router.delete('/:userHash', [ authorization ], deleteByHash);

export { router as users };