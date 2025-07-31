#!/bin/bash

# Cloudflare Audit Log Fetcher
# Usage: ./cloudflare-audit.sh YOUR_API_TOKEN

if [ -z "$1" ]; then
    echo "Usage: $0 <CLOUDFLARE_API_TOKEN>"
    echo "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
    exit 1
fi

API_TOKEN=$1
ACCOUNT_ID="519d80ce438f427d096a3e3bdd98a7e0"

# Calculate date 3 months ago
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    THREE_MONTHS_AGO=$(date -v-3m -u +"%Y-%m-%dT%H:%M:%SZ")
else
    # Linux
    THREE_MONTHS_AGO=$(date -u -d "3 months ago" +"%Y-%m-%dT%H:%M:%SZ")
fi

echo "Fetching Cloudflare audit logs from $THREE_MONTHS_AGO to now..."
echo "Looking for issues related to thefadil.site..."
echo "================================================"

# Fetch audit logs
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/audit_logs?since=$THREE_MONTHS_AGO&per_page=100" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq '.result[] | select(.action.type | contains("worker") or contains("dns") or contains("page") or contains("route") or contains("domain")) | {
    when: .when,
    action: .action.type,
    actor: .actor.email,
    resource: .resource,
    metadata: .metadata
  }' 2>/dev/null

echo "================================================"
echo "Specific checks for thefadil.site issues:"
echo "================================================"

# Check for worker routes
echo -e "\n1. Worker Routes that might interfere:"
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[] | select(.name | contains("thefadil.site")) | .id' | while read zone_id; do
    if [ ! -z "$zone_id" ]; then
        echo "   Checking zone: $zone_id"
        curl -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/workers/routes" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" | jq '.result[] | {pattern: .pattern, script: .script}'
    fi
done

# Check DNS records
echo -e "\n2. DNS Records for thefadil.site:"
curl -X GET "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[] | select(.name | contains("thefadil.site")) | .id' | while read zone_id; do
    if [ ! -z "$zone_id" ]; then
        curl -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" | jq '.result[] | {name: .name, type: .type, content: .content, proxied: .proxied}'
    fi
done

# Check Pages projects
echo -e "\n3. Pages Projects:"
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" | jq '.result[] | {name: .name, domains: .domains, production_branch: .production_branch}'

echo -e "\n================================================"
echo "Recommendations based on common issues:"
echo "1. Check if any Worker has routes matching thefadil.site/*"
echo "2. Verify DNS records point to Pages project"
echo "3. Ensure no conflicting Page Rules exist"
echo "4. Check if custom domains are properly configured in Pages"