import { Router } from "express";

import { get, post } from './handlers';

import { getByHash, putByHash, deleteByHash } from './hash/handlers'

export const router = Router();

// /
router.get('/', get);
router.post('/', post);

// /:userHash
router.get('/:userHash', getByHash);
router.put('/:userHash', putByHash);
router.delete('/:userHash', deleteByHash);

export { router as users };