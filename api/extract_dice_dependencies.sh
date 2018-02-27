#!/usr/bin/env bash

DICE_DIST=./../../dice-dist/

mkdir -p $DICE_DIST
cp -r api/ $DICE_DIST
cp .babelrc $DICE_DIST