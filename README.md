# Nexus MCP Server

<!-- <p align="center">
  <img src="https://via.placeholder.com/200x200.png?text=Nexus+MCP" alt="Nexus MCP Server" width="200"/>
</p> -->

<p align="center">
  <strong>Enabling AI Agents to Interact with the Nexus Blockchain</strong>
</p>

<p align="center">
  <a href="https://discord.gg/nexus-xyz"><img src="https://img.shields.io/badge/Discord-Join-7289DA?style=flat&logo=discord" alt="Join Discord"></a>
  <a href="https://nexus.xyz"><img src="https://img.shields.io/badge/Website-Visit-0088CC?style=flat&logo=googlechrome" alt="Website"></a>
  <a href="https://twitter.com/nexuslabs"><img src="https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=flat&logo=twitter" alt="Follow on Twitter"></a>
</p>

## Overview

The Nexus MCP Server is a bridge that enables AI agents to interact directly with the Nexus blockchain using the Model Context Protocol (MCP). It exposes blockchain functionality as MCP tools that can be accessed by any MCP-compatible AI system, including Claude and other leading LLMs.

👉 **[Read the full blog post](./BLOG.md)** to learn how Nexus is building the blockchain for the AI era, starting with MCP integration.

## Features

- **Query Blockchain Data**: Get blocks, transactions, account balances, and more
- **Smart Contract Interaction**: Make read-only contract calls to query on-chain data
- **Transaction Management**: Submit signed transactions to the network
- **Event Monitoring**: Track and filter blockchain events via logs
- **Easy AI Integration**: Compatible with any MCP-enabled AI system

## Available Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `getNetworkInfo` | Get Nexus blockchain network information | None |
| `getBalance` | Get the balance of an address | `address`: string |
| `getTransaction` | Get transaction details by hash | `txHash`: string |
| `getBlock` | Get block details by number | `blockNumber`: string, `fullTransactions`: boolean (optional) |
| `callContract` | Call a smart contract method (read-only) | `to`: string, `data`: string |
| `getLogs` | Get event logs from the blockchain | `filterObject`: object |
| `sendRawTransaction` | Submit a signed transaction to the network | `signedTx`: string |

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/nexus/mcp-for-nexus
cd mcp-for-nexus

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start the server
npm run dev
```

### Testing with the Client

Once your server is running, you can connect to it using the included test client:

```bash
# Using the test client (requires Redis for SSE transport)
node scripts/test-nexus-client.mjs http://localhost:3000
```

For local development, make sure Redis is installed and running:

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis

# Verify Redis is running
redis-cli ping  # Should respond with "PONG"
```

### Client Usage Example

```javascript
// Example of calling blockchain tools from your application
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const transport = new SSEClientTransport(new URL(`http://localhost:3000/sse`));

const client = new Client(
  { name: "my-app", version: "1.0.0" },
  { capabilities: { prompts: {}, resources: {}, tools: {} } }
);

await client.connect(transport);

// Get blockchain info
const networkInfo = await client.callTool({
  name: "getNetworkInfo",
  arguments: {}
});

// Query an account balance
const balance = await client.callTool({
  name: "getBalance",
  arguments: { address: "0x1234567890abcdef1234567890abcdef12345678" }
});

// Get block information
const blockData = await client.callTool({
  name: "getBlock", 
  arguments: {
    blockNumber: "latest",
    fullTransactions: true
  }
});
```

## Integrating with AI Systems

### Claude Integration Example

```javascript
// Example of integrating with Claude
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import Anthropic from "@anthropic-ai/sdk";

// Setup MCP client
const mcpClient = new Client(...);
await mcpClient.connect(transport);

// Get available tools
const tools = await mcpClient.listTools();
const toolDefinitions = tools.map(tool => ({
  name: tool.name,
  description: tool.description,
  input_schema: tool.inputSchema
}));

// Setup Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Create message with tools
const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1000,
  messages: [{ role: "user", content: "What's the latest block on Nexus?" }],
  tools: toolDefinitions
});

// Handle tool calls from Claude
for (const content of message.content) {
  if (content.type === 'tool_use') {
    const result = await mcpClient.callTool({
      name: content.name,
      arguments: content.input
    });
    
    // Send tool result back to Claude
    // ...
  }
}
```

## Deployment Options

### Local Development

The server can be run locally for development purposes, which is ideal for AI developers testing integration with the Nexus blockchain.

### Production Deployment on Vercel

For production usage, the server can be deployed on Vercel:

1. Configure Redis (required for SSE transport):
   - Add Redis integration from the Vercel dashboard, or
   - Set `REDIS_URL` environment variable to your managed Redis instance

2. Enable Fluid Compute for longer-running operations

## Contributing

We welcome contributions to improve the Nexus MCP Server! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the [MIT License](LICENSE).

## Connect with Nexus

- **Website**: [nexus.xyz](https://nexus.xyz)
- **Twitter**: [@nexus_xyz](https://twitter.com/nexus_xyz)
- **Discord**: [Join our community](https://discord.gg/nexus)
- **GitHub**: [Nexus](https://github.com/nexus) 