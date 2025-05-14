# Nexus Blockchain MCP Server

This project provides an MCP (Machine-Controlled Program) server that connects an AI with an RPC protocol for interacting with the Nexus blockchain.

## Nexus Blockchain Details

```json
{
  "chainId": "393",
  "rpcUrl": "https://rpc.nexus.xyz/http",
  "wsUrl": "wss://rpc.nexus.xyz/ws",
  "explorerUrl": "https://explorer.nexus.xyz"
}
```

## About This Project

This MCP server acts as a bridge between AI systems and the Nexus blockchain, allowing AI to:

- Query blockchain data (blocks, transactions, balances)
- Call smart contracts (read-only operations)
- Submit signed transactions to the network
- Monitor events via logs

The server is built using the [Vercel MCP Adapter](https://www.npmjs.com/package/@vercel/mcp-adapter) and implements the Model Context Protocol (MCP) specification.

## Available Tools

The following RPC tools are available to interact with the Nexus blockchain:

- `getNetworkInfo` - Get Nexus blockchain network information
- `getBalance` - Get the balance of an address
- `getTransaction` - Get transaction details by hash
- `getBlock` - Get block details by number
- `callContract` - Call a smart contract method (read-only)
- `getLogs` - Get event logs from the blockchain
- `sendRawTransaction` - Submit a signed transaction to the network

## Environment Setup

The project uses environment variables for configuration. A `.env.example` file is provided as a template.

1. Copy the example file to create your own `.env` file:

```sh
cp .env.example .env
```

2. Edit the `.env` file to configure your settings:

```
REDIS_URL=redis://localhost:6379
```

## Running Locally

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Testing with the Client

You can use the test client to try out the MCP server:

```sh
# Using SSE transport (requires Redis)
node scripts/test-nexus-client.mjs http://localhost:3000
```

### Client Usage Example

The client connects to the server using SSE transport and can call tools:

```javascript
// Example of calling the getNetworkInfo tool
const networkInfo = await client.callTool({
  name: "getNetworkInfo",
  arguments: {} // Empty object for tools without parameters
});

// Example of calling the getBlock tool with parameters
const latestBlock = await client.callTool({
  name: "getBlock", 
  arguments: {
    blockNumber: "latest",
    fullTransactions: false
  }
});

// Example of checking an address balance
const balance = await client.callTool({
  name: "getBalance",
  arguments: { address: "0x1234567890abcdef1234567890abcdef12345678" }
});
```

## Transport Options

This server supports two transport options:

1. **HTTP Transport** - Basic request/response (no Redis required)
2. **SSE Transport** - Server-Sent Events for streaming responses (requires Redis)

### Setting up Redis for SSE Transport

#### Local Development with Homebrew (macOS)

If you want to use the SSE transport in local development:

1. Install Redis using Homebrew:
   ```sh
   brew install redis
   ```

2. Start the Redis service:
   ```sh
   brew services start redis
   ```

3. Verify Redis is running:
   ```sh
   redis-cli ping
   # Should respond with "PONG"
   ```

4. Configure your `.env` file with the local Redis URL:
   ```
   REDIS_URL=redis://localhost:6379
   ```

5. To stop Redis when you're done:
   ```sh
   brew services stop redis
   ```

#### Using Docker

Alternatively, you can run Redis in a Docker container:

```sh
# Pull the Redis image
docker pull redis

# Run Redis container
docker run --name redis-mcp -p 6379:6379 -d redis

# To stop the container
docker stop redis-mcp
```

#### Production Setup with Cloud-Hosted Redis

For production environments, it's recommended to use a managed Redis service:

1. **Redis Cloud** (by Redis Labs):
   - Sign up for [Redis Cloud](https://redis.com/try-free/)
   - Create a database in your preferred region
   - Get the connection string from your dashboard
   - Update your environment variable with the secure Redis URL
   ```
   REDIS_URL=redis://username:password@your-redis-host:port
   ```

2. **Upstash** (Redis on Vercel):
   - If deploying to Vercel, you can add [Upstash Redis](https://vercel.com/integrations/upstash) from the Vercel marketplace
   - After adding, Vercel will automatically set the `REDIS_URL` environment variable

3. **AWS ElastiCache**:
   - Create an ElastiCache Redis cluster
   - Configure VPC access and security groups
   - Use the endpoint in your environment variables
   ```
   REDIS_URL=redis://your-elasticache-endpoint:6379
   ```

## Notes for Running on Vercel

- To use the SSE transport, requires a Redis attached to the project under `process.env.REDIS_URL`
- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- After enabling Fluid compute, open `app/[transport]/route.ts` and adjust `maxDuration` to 800 if you using a Vercel Pro or Enterprise account
