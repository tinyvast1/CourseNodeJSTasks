import { Router } from "express";
import { get, post } from "./handlers";
import { getByHash, putByHash, deleteByHash } from "./hash/handlers";
import { enrollClasses } from "./hash/enroll/handlers";
import { expelClasses } from "./hash/expel/handlers";
import { authorization } from "../../helpers";

const router = Router();

router.get('/', get);
router.post('/', [ authorization ], post);

router.get('/:classesHash', [ authorization ], getByHash);
router.put('/:classesHash', [ authorization ], putByHash);
router.delete('/:classesHash', [ authorization ], deleteByHash);

router.post('/:classesHash/enroll', [ authorization ], enrollClasses);
router.post('/:classesHash/expel', [ authorization ], expelClasses)

export {router as classes}