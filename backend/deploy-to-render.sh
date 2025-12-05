#!/bin/bash
# Quick script to deploy backend to Render.com
# Usage: ./deploy-to-render.sh [deploy-hook-url]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}   Render.com Deployment Script${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"

# Check if deploy hook URL is provided as argument
if [ -n "$1" ]; then
    DEPLOY_HOOK="$1"
    echo -e "${GREEN}✓${NC} Using deploy hook from argument"
# Check if deploy hook is in .env file
elif [ -f .env ] && grep -q "RENDER_DEPLOY_HOOK" .env; then
    DEPLOY_HOOK=$(grep RENDER_DEPLOY_HOOK .env | cut -d '=' -f2-)
    echo -e "${GREEN}✓${NC} Using deploy hook from .env file"
else
    echo -e "${RED}✗${NC} No deploy hook found!"
    echo ""
    echo "Please provide your Render deploy hook URL either:"
    echo "  1. As an argument: ./deploy-to-render.sh https://api.render.com/deploy/srv-xxxxx?key=yyyyy"
    echo "  2. In .env file: RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=yyyyy"
    echo ""
    echo "To get your deploy hook:"
    echo "  1. Go to https://dashboard.render.com/"
    echo "  2. Select your backend service"
    echo "  3. Go to Settings → Deploy Hook"
    echo "  4. Click 'Create Deploy Hook'"
    exit 1
fi

# Trigger deployment
echo ""
echo -e "${YELLOW}Triggering deployment...${NC}"
RESPONSE=$(curl -s -X POST "$DEPLOY_HOOK")

# Check if deployment was successful
if echo "$RESPONSE" | grep -q "success\|triggered\|deploying"; then
    echo -e "${GREEN}✓ Deployment triggered successfully!${NC}"
    echo ""
    echo "Deployment is now in progress. This usually takes 2-3 minutes."
    echo "Check status at: https://dashboard.render.com/"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  1. Wait for deployment to complete"
    echo "  2. Test at: https://sh-dott.github.io/AI-business-advisor/"
    echo "  3. Try downloading a document in different languages"
else
    echo -e "${RED}✗ Deployment might have failed${NC}"
    echo "Response: $RESPONSE"
    echo ""
    echo "Please check:"
    echo "  1. Your deploy hook URL is correct"
    echo "  2. The service exists on Render.com"
    echo "  3. Try manual deploy: https://dashboard.render.com/"
fi
