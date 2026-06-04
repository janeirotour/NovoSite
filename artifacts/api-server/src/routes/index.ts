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

  const router: IRouter = Router();

  router.use(healthRouter);
  router.use(toursRouter);
  router.use(destinationsRouter);
  router.use(blogRouter);
  router.use(faqsRouter);
  router.use(reviewsRouter);
  router.use(settingsRouter);
  router.use(adminRouter);
  router.use(uploadRouter);

  export default router;
  