#!/bin/bash

kubectl create configmap config --from-file application.yaml
helm upgrade --install camunda camunda/camunda-platform -f values.yaml -n camunda