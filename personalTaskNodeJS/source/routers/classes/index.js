import { Router } from "express";
import { get, post } from "./handlers";
import { getByHash, putByHash, deleteByHash } from "./hash/handlers";
import { enrollClasses } from "./hash/enroll/handlers";
import { expelClasses } from "./hash/expel/handlers";

const router = Router();

router.get('/', get);
router.post('/', post);

router.get('/:classesHash', getByHash);
router.put('/:classesHash', putByHash);
router.delete('/:classesHash', deleteByHash);

router.post('/:classesHash/enroll', enrollClasses);
router.post('/:classesHash/expel', expelClasses)

export {router as classes}