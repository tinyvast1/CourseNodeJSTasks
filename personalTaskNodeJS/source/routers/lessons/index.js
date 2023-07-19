import { Router } from "express";
import { get, post } from "./handlers";
import { getByHash, putByHash, deleteByHash } from "./hash/handlers";
import { addVideoTheLesson } from "./hash/videos/handlers";
import { addKeynotesTheLesson } from "./hash/keynotes/handlers";
import { deleteVideoByLessons, getVideoByLessons } from "./hash/videos/hash/handlers";
import { deleteKeynotesByLessons, getKeynotesByLessons } from "./hash/keynotes/hash/handlers";
import { authorization } from "../../helpers";

const router = Router();

router.get('/', get);
router.post('/', [ authorization ], post);

router.get('/:lessonsHash', [ authorization ], getByHash);
router.put('/:lessonsHash', [ authorization ], putByHash);
router.delete('/:lessonsHash', [ authorization ], deleteByHash);

router.post('/:lessonsHash/videos', [ authorization ], addVideoTheLesson);

router.get('/:lessonsHash/videos/:videoHash', [ authorization ], getVideoByLessons);
router.delete('/:lessonsHash/videos/:videoHash', [ authorization ], deleteVideoByLessons);

router.post('/:lessonsHash/keynotes', [ authorization ], addKeynotesTheLesson);

router.get('/:lessonsHash/keynotes/:keynotesHash', [ authorization ], getKeynotesByLessons);
router.delete('/:lessonsHash/keynotes/:keynotesHash', [ authorization ], deleteKeynotesByLessons)

export {router as lessons}