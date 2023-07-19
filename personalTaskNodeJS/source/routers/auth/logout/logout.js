import { Router } from "express";
import { post } from "./handlers";
import { authorization } from "../../../helpers";

const router = Router();

router.post('/', [authorization], post);

export {router as logout}