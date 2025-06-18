"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flashcards_1 = __importDefault(require("./flashcards")); 
const router = (0, express_1.Router)();

router.use("/flashcards", flashcards_1.default);
exports.default = router;
