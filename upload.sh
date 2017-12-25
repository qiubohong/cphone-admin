#!/bin/sh

npm run build
cd dist
zip -q -r dist.zip ./*
echo "input scp"

scp ./dist.zip root@139.224.232.93:/root/
# Aa12345*