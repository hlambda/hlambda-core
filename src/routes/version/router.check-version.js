import express from 'express';
import asyncHandler from 'express-async-handler';
import _ from 'lodash';
import semver from 'semver';
import { DateTime } from 'luxon';
import fetch from 'node-fetch';

// Define errors
import { constants, isEnvTrue, getEnvValue } from './../../constants/index.js';
import errors from './../../errors/index.js';

import readPackageVersion from './../../utils/readPackageVersion.js';

// Create express router
const router = express.Router();

const getGitHubReleases = async (owner, repository) => {
  const result = await fetch(`https://api.github.com/repos/${owner}/${repository}/releases`, {
    headers: {
      'content-type': 'application/json',
    },
  });

  const jsonResult = await result
    .json()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

  return jsonResult;
};

router.get(
  '/check-version',
  asyncHandler(async (req, res) => {
    // --------------------------------------------------------------------------------
    const getPackageVersion = await readPackageVersion()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log(error);
        return '-';
      });
    // --------------------------------------------------------------------------------
    const getPackageVersionWithVPrefix = `v${getPackageVersion}`;
    // --------------------------------------------------------------------------------
    const githubReleasesResult = await getGitHubReleases('hlambda', 'hlambda-core');

    const latestVersion = _.maxBy(githubReleasesResult, (o) => {
      return DateTime.fromISO(o.created_at);
    }) ?? {
      name: 'v0.0.0',
    };

    const foundNewerVersionObject = _.find(githubReleasesResult, (release) => {
      // console.log(release?.name, getPackageVersionWithVPrefix, semver.gt(release?.name, getPackageVersionWithVPrefix));
      if (semver.gt(release?.name, getPackageVersionWithVPrefix)) {
        return true;
      }
      return false;
    });

    const foundNewerVersion = typeof foundNewerVersionObject !== 'undefined';
    // --------------------------------------------------------------------------------
    res.status(200).send({
      currentVersion: getPackageVersionWithVPrefix,
      latestVersion: latestVersion?.name,
      foundNewerVersionObject: foundNewerVersionObject ?? {
        name: 'v0.0.0',
      },
      foundNewerVersion,
    });
  })
);

export default router;
