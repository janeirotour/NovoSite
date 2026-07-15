import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toursRouter from "./tours";
import destinationsRouter from "./destinations";
import blogRouter from "./blog";
import faqsRouter from "./faqs";
import reviewsRouter from "./reviews";
import settingsRouter from "./settings";
import adminRouter from "./admin";
import uploadRouter from "./upload";
import stripeRouter from "./stripe";
import extrasRouter from "./extras";
import reservationsRouter from "./reservations";
import availabilityRouter from "./availability";
import packagesRouter from "./packages";
import currencyRouter from "./currency";
import aiRouter from "./ai";
import groupProgramsRouter from "./group-programs";
import hotelsRouter from "./hotels";
import b2bRouter from "./b2b";

const router: IRouter = Router();

router.use(healthRouter);
router.use(currencyRouter);
router.use(toursRouter);
router.use(destinationsRouter);
router.use(blogRouter);
router.use(faqsRouter);
router.use(reviewsRouter);
router.use(settingsRouter);
router.use(adminRouter);
router.use(uploadRouter);
router.use(stripeRouter);
router.use(extrasRouter);
router.use(reservationsRouter);
router.use(availabilityRouter);
router.use(packagesRouter);
router.use(groupProgramsRouter);
router.use(hotelsRouter);
router.use(b2bRouter);
router.use(aiRouter);

export default router;
  