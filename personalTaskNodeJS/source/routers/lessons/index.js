import { Router } from "express";
import { get, post } from "./handlers";
import { getByHash, putByHash, deleteByHash } from "./hash/handlers";
import { addVideoTheLesson } from "./hash/videos/handlers";
import { addKeynotesTheLesson } from "./hash/keynotes/handlers";
import { deleteVideoByLessons, getVideoByLessons } from "./hash/videos/hash/handlers";
import { deleteKeynotesByLessons, getKeynotesByLessons } from "./hash/keynotes/hash/handlers";

const router = Router();

router.get('/', get);
router.post('/', post);

router.get('/:lessonsHash', getByHash);
router.put('/:lessonsHash', putByHash);
router.delete('/:lessonsHash', deleteByHash);

router.post('/:lessonsHash/videos', addVideoTheLesson);

router.get('/:lessonsHash/videos/:videoHash', getVideoByLessons);
router.delete('/:lessonsHash/videos/:videoHash', deleteVideoByLessons);

router.post('/:lessonsHash/keynotes', addKeynotesTheLesson);

router.get('/:lessonsHash/keynotes/:keynotesHash', getKeynotesByLessons);
router.delete('/:lessonsHash/keynotes/:keynotesHash', deleteKeynotesByLessons)

export {router as lessons}