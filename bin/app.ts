#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib';

const app = new cdk.App();

// tsmith.com -- Static Site (Jekyll + Sass/JS/Images) on Amplify
const TSmithCom = new stacks.TSmithComStack(app, 'TSmithComStack');
cdk.Tags.of(TSmithCom).add('project', 'tsmithcreative');

// grabtimewith.me -- React SPA on Amplify
const GrabTimeWithMe = new stacks.GrabTimeWithMeStack(app, 'GrabTimeWithMeStack');
cdk.Tags.of(GrabTimeWithMe).add('project', 'experiments');

// storypoints.info -- Static Site (HTML + Sass) on Amplify
const StoryPointsInfo = new stacks.StoryPointsInfoStack(app, 'StoryPointsInfoStack');
cdk.Tags.of(StoryPointsInfo).add('project', 'experiments');

// typesetwith.me -- Static Site (HTML + JS + Sass) on Amplify
const TypestWithMe = new stacks.TypesetWithMeStack(app, 'TypesetWithMeStack');
cdk.Tags.of(TypestWithMe).add('project', 'experiments');
