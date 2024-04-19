#!/bin/sh

# Clean npm cache
npm cache clean --force

# Uninstall axios
npm uninstall axios

# Install axios
npm install axios

# Install '@bitnoi.se/react-scheduler'
npm install '@bitnoi.se/react-scheduler'

# Fix any audit issues
npm audit fix

# Install primereact
npm install primereact

# Run npm run dev
npm run dev
