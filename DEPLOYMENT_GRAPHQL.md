# GraphQL Yoga Deployment Guide for Dr. Fadil's Healthcare Profile

## 🚀 Deployment Options

### Option 1: Node.js Hosting (Recommended)

#### Platforms that support this setup:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**
- **Google Cloud Run**

#### Deployment Steps:

1. **Prepare for deployment**:
   ```bash
   npm run build
   npm test
   ```

2. **Set environment variables**:
   ```bash
   PORT=4000
   NODE_ENV=production
   ```

3. **Deploy using platform CLI** (example for Heroku):
   ```bash
   # Install Heroku CLI
   heroku create dr-fadil-healthcare-api
   git push heroku main
   ```

### Option 2: Docker Deployment

#### Build and run with Docker:
```bash
# Build the image
docker build -t dr-fadil-healthcare-api .

# Run locally
docker run -p 4000:4000 dr-fadil-healthcare-api

# Run with docker-compose (includes nginx)
docker-compose up -d
```

#### Deploy to container platforms:
- **AWS ECS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean Container Registry**

### Option 3: Serverless Deployment

#### Cloudflare Workers
Create a `wrangler.toml` file:
```toml
name = "dr-fadil-healthcare-api"
main = "server/index.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { NODE_ENV = "production" }
```

Deploy:
```bash
npm install -g wrangler
wrangler deploy
```

#### Vercel
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/graphql", "dest": "/server/index.js" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

#### Netlify Functions
Move server code to `netlify/functions/graphql.js` and deploy.

## 🔧 Production Configuration

### Environment Variables
```bash
# Required
PORT=4000
NODE_ENV=production

# Optional but recommended
CORS_ORIGIN=https://thefadil.site
GRAPHQL_INTROSPECTION=false
GRAPHQL_PLAYGROUND=false
```

### Security Considerations

1. **CORS Configuration**:
   ```javascript
   cors: {
     origin: process.env.CORS_ORIGIN || ['https://thefadil.site'],
     credentials: true
   }
   ```

2. **Rate Limiting** (add to server):
   ```bash
   npm install express-rate-limit
   ```

3. **Authentication** (for sensitive queries):
   ```bash
   npm install jsonwebtoken
   ```

### Performance Optimizations

1. **Enable caching**:
   ```javascript
   import { useResponseCache } from '@graphql-yoga/plugin-response-cache'
   
   const yoga = createYoga({
     plugins: [
       useResponseCache({
         session: () => null,
         ttl: 300000 // 5 minutes
       })
     ]
   })
   ```

2. **Add query complexity analysis**:
   ```bash
   npm install @graphql-yoga/plugin-query-complexity
   ```

## 🌐 Integration with Existing Cloudflare Pages

### Option A: Separate API Domain
Deploy GraphQL API to: `api.thefadil.site`
Keep static site on: `thefadil.site`

Update frontend to use:
```javascript
const client = new HealthcareGraphQLClient('https://api.thefadil.site/graphql');
```

### Option B: Cloudflare Functions
1. Move GraphQL server to `functions/graphql.js`
2. Update `_headers` file:
   ```
   /graphql
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: GET, POST, OPTIONS
     Access-Control-Allow-Headers: Content-Type
   ```

### Option C: Edge-Side API
Use Cloudflare Workers with the GraphQL server:

1. Create `worker.js`:
   ```javascript
   import { createYoga } from 'graphql-yoga'
   // ... your schema
   
   const yoga = createYoga({ schema })
   
   export default {
     async fetch(request, env, ctx) {
       if (new URL(request.url).pathname.startsWith('/graphql')) {
         return yoga.fetch(request, env, ctx)
       }
       return new Response('Not Found', { status: 404 })
     }
   }
   ```

## 📊 Monitoring and Analytics

### Health Checks
The server includes built-in health check endpoint:
```
GET /health
```

### Logging
Add structured logging:
```bash
npm install winston
```

### Metrics
Monitor GraphQL operations:
- Query execution time
- Error rates
- Usage patterns

### Example monitoring setup:
```javascript
import { usePrometheus } from '@graphql-yoga/plugin-prometheus'

const yoga = createYoga({
  plugins: [
    usePrometheus({
      endpoint: '/metrics',
      labels: {
        service: 'dr-fadil-healthcare-api'
      }
    })
  ]
})
```

## 🔒 HIPAA Compliance Considerations

### Data Privacy
- **No PHI Storage**: Current implementation doesn't store patient data
- **Secure Transmission**: Use HTTPS in production
- **Access Logging**: Log API access for audit trails
- **Data Encryption**: Encrypt sensitive form submissions

### Compliance Features to Add:
1. **Patient consent tracking**
2. **Audit logging**
3. **Data retention policies**
4. **Access controls**

## 🧪 Testing in Production

### Health Check
```bash
curl https://your-api-domain.com/health
```

### GraphQL Endpoint
```bash
curl -X POST https://your-api-domain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ profile { name title } }"}'
```

### Frontend Integration Test
Open `graphql-demo.html` and test all functionality.

## 📈 Scaling Considerations

### Database Integration
For production, consider adding a database:
```bash
npm install prisma @prisma/client
```

### Cache Layer
Add Redis for session management:
```bash
npm install redis
```

### Load Balancing
Use multiple instances with a load balancer for high availability.

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Check origin configuration
   - Verify preflight requests

2. **Memory Issues**:
   - Implement query complexity limits
   - Add pagination to large result sets

3. **Performance**:
   - Enable response caching
   - Use DataLoader for N+1 queries

### Debug Mode:
```bash
NODE_ENV=development npm start
```

## 📞 Support

For deployment assistance:
- GraphQL Yoga Documentation: https://the-guild.dev/graphql/yoga-server
- Healthcare API Issues: GitHub Issues
- Production Support: contact@brainsait.io

---

**Dr. Mohamed El Fadil** - Physician & Healthcare Technology Innovator  
**BrainSAIT Healthcare Innovation Platform**