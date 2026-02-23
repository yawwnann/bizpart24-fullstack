import express from 'express';
import { RegionController } from '../controllers/region.controller';

const router = express.Router();
const regionController = new RegionController();

router.get('/provinces', regionController.getProvinces);
router.get('/provinces/:provinceId/regencies', regionController.getRegencies);
router.get('/regencies/:regencyId/districts', regionController.getDistricts);

export default router;
