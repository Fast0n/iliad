'use strict';

const router = require('express').Router();

const controllers = require('../controllers');


router.get(
  '/',
  controllers.root
);

router.get(
  '/alert',
  controllers.alert
);

router.get(
  '/login',
  controllers.login
);

router.get(
  '/token',
  controllers.token
);

router.get(
  '/logout',
  controllers.logout
);

router.get(
  '/recover',
  controllers.recover
);

router.get(
  '/information',
  controllers.information
);

router.get(
  '/sim',
  controllers.sim
);

router.get(
  '/services',
  controllers.services
);

router.get(
  '/document',
  controllers.document
);

router.get(
  '/recharge',
  controllers.recharge
);

router.get(
  '/voicemail',
  controllers.voicemail
);

router.get(
  '/store',
  controllers.store
);

router.get(
  '/donors',
  controllers.donor
);

module.exports = router;
