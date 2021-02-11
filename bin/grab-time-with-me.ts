#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GrabTimeWithMeStack } from '../lib/grab-time-with-me-stack';

const app = new cdk.App();
new GrabTimeWithMeStack(app, 'GrabTimeWithMeStack');
