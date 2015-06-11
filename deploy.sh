#!/bin/bash -e

docker build -t localhost:5000/ebsa-portal git@github.com:scbd/ebsa.cbd.int
docker push     localhost:5000/ebsa-portal
