#!/bin/bash

# Usage function to display help
usage() {
  echo "Usage: $0 -n <namespace> -r <release-name>"
  exit 1
}

# Default values
NAMESPACE=""
RELEASE_NAME=""

# Parse arguments
while getopts "n:r:" opt; do
  case ${opt} in
    n) NAMESPACE=$OPTARG ;;
    r) RELEASE_NAME=$OPTARG ;;
    *) usage ;;
  esac
done

# Check if both arguments are provided
if [[ -z $NAMESPACE || -z $RELEASE_NAME ]]; then
  usage
fi

# Create ConfigMap
kubectl create configmap config --from-file=application.yaml -n "$NAMESPACE"

# Install/Upgrade Helm chart
helm upgrade --install "$RELEASE_NAME" camunda/camunda-platform -f values.yaml -n "$NAMESPACE"
