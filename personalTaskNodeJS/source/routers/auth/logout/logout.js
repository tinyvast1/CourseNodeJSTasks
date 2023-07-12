import { Router } from "express";
import { post } from "./handlers";


const router = Router();

router.post('/', post);

export {router as logout}