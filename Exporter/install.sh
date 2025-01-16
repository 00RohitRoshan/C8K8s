#!/bin/bash

# Usage function to display help
usage() {
  echo "Usage: $0 -r <release-name> [-n <namespace>]"
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

# Ensure release name is provided
if [[ -z $RELEASE_NAME ]]; then
  echo "Error: Release name is required."
  usage
fi

# Create namespace if provided
if [[ -n $NAMESPACE ]]; then
  if ! kubectl get namespace "$NAMESPACE" &>/dev/null; then
    echo "Namespace $NAMESPACE does not exist. Creating..."
    kubectl create namespace "$NAMESPACE"
  else
    echo "Namespace $NAMESPACE already exists."
  fi
else
  echo "No namespace provided. Proceeding without specifying a namespace."
fi

# Create ConfigMap
if [[ -n $NAMESPACE ]]; then
  kubectl create configmap config --from-file=application.yaml -n "$NAMESPACE"
else
  kubectl create configmap config --from-file=application.yaml
fi

# Install/Upgrade Helm chart
if [[ -n $NAMESPACE ]]; then
  helm upgrade --install "$RELEASE_NAME" camunda/camunda-platform -f values.yaml -n "$NAMESPACE"
else
  helm upgrade --install "$RELEASE_NAME" camunda/camunda-platform -f values.yaml
fi
