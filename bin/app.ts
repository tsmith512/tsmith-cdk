#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib';

const app = new cdk.App();

// grabtimewith.me -- React SPA on Amplify
new stacks.GrabTimeWithMeStack(app, 'GrabTimeWithMeStack');

// storypoints.info -- Static Site (HTML + Sass) on Amplify
new stacks.StoryPointsInfoStack(app, 'StoryPointsInfoStack');

// typesetwith.me -- Static Site (HTML + JS + Sass) on Amplify
new stacks.TypesetWithMeStack(app, 'TypesetWithMeStack');
