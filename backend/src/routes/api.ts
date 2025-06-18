import { Router } from "express";
import flashcardRoutes from "./flashcards";
import categoryRoutes from "./categories"; 
import authRoutes from "./authRoutes"; 
import userRoutes from "./users"; 

const router = Router();

router.use("/flashcards", flashcardRoutes);
router.use("/categories", categoryRoutes); 
router.use("/auth", authRoutes); 
router.use("/users", userRoutes); 

export default router;
