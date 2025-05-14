import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const origin = process.argv[2] || "http://localhost:3000";

async function main() {
  const transport = new SSEClientTransport(new URL(`${origin}/sse`));

  const client = new Client(
    {
      name: "nexus-blockchain-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  try {
    console.log("Connecting to Nexus MCP server at", origin);
    await client.connect(transport);

    console.log("Connected successfully");
    console.log("Server capabilities:", client.getServerCapabilities());

    // List all available tools
    const tools = await client.listTools();
    console.log("Available tools:", tools);

    // Get Nexus network information
    console.log("\nFetching Nexus network information...");
    const networkInfo = await client.callTool({
      name: "getNetworkInfo",
      arguments: {} // Empty object for no parameters
    });
    console.log("Network info:", networkInfo);

    // Example: Query latest block
    console.log("\nFetching latest block...");
    const latestBlock = await client.callTool({
      name: "getBlock", 
      arguments: {
        blockNumber: "latest",
        fullTransactions: false
      }
    });
    console.log("Latest block:", latestBlock);

    // Example: if you have a specific address to check
    // const testAddress = "0x1234567890abcdef1234567890abcdef12345678";
    // console.log(`\nChecking balance for ${testAddress}...`);
    // const balance = await client.callTool({
    //   name: "getBalance",
    //   arguments: { address: testAddress }
    // });
    // console.log("Balance:", balance);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    client.close();
    console.log("Connection closed");
  }
}

main(); 