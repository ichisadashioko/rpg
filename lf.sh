#!/bin/bash
find . -type f \
    -not -path "./.git/*" \
    -not -path "./*.png" \
    -print0 | xargs -0 dos2unix