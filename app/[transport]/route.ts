import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import * as Nexus from "../lib/nexus";

const handler = createMcpHandler(
  (server) => {
    // Network info tool
    server.tool(
      "getNetworkInfo",
      "Get Nexus blockchain network information",
      {},
      async () => {
        const info = await Nexus.getNetworkInfo();
        return {
          content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
        };
      }
    );

    // Get balance tool
    server.tool(
      "getBalance",
      "Get the balance of an address on Nexus blockchain",
      { address: z.string().describe("The Ethereum address to query") },
      async ({ address }) => {
        const balance = await Nexus.getBalance(address);
        return {
          content: [{ type: "text", text: `Balance: ${balance}` }],
        };
      }
    );

    // Get transaction tool
    server.tool(
      "getTransaction",
      "Get transaction details by hash",
      { txHash: z.string().describe("The transaction hash") },
      async ({ txHash }) => {
        const tx = await Nexus.getTransaction(txHash);
        return {
          content: [{ type: "text", text: JSON.stringify(tx, null, 2) }],
        };
      }
    );

    // Get block tool
    server.tool(
      "getBlock",
      "Get block details by number",
      { 
        blockNumber: z.string().describe("The block number in hex format or 'latest'"),
        fullTransactions: z.boolean().optional().describe("Whether to include full transaction objects")
      },
      async ({ blockNumber, fullTransactions = false }) => {
        const block = await Nexus.getBlockByNumber(blockNumber, fullTransactions);
        return {
          content: [{ type: "text", text: JSON.stringify(block, null, 2) }],
        };
      }
    );

    // Smart contract call tool
    server.tool(
      "callContract",
      "Call a smart contract method (read-only)",
      { 
        to: z.string().describe("Contract address"),
        data: z.string().describe("ABI-encoded call data")
      },
      async ({ to, data }) => {
        const result = await Nexus.call({ to, data });
        return {
          content: [{ type: "text", text: `Call result: ${result}` }],
        };
      }
    );

    // Get logs tool
    server.tool(
      "getLogs",
      "Get event logs from the blockchain",
      { 
        filterObject: z.record(z.any()).describe("Filter criteria for logs")
      },
      async ({ filterObject }) => {
        const logs = await Nexus.getLogs(filterObject);
        return {
          content: [{ type: "text", text: JSON.stringify(logs, null, 2) }],
        };
      }
    );

    // Send raw transaction tool
    server.tool(
      "sendRawTransaction",
      "Submit a signed transaction to the network",
      { 
        signedTx: z.string().describe("Hex-encoded signed transaction")
      },
      async ({ signedTx }) => {
        const txHash = await Nexus.sendRawTransaction(signedTx);
        return {
          content: [{ type: "text", text: `Transaction submitted: ${txHash}` }],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        getNetworkInfo: {
          description: "Get Nexus blockchain network information",
        },
        getBalance: {
          description: "Get the balance of an address on Nexus blockchain",
        },
        getTransaction: {
          description: "Get transaction details by hash",
        },
        getBlock: {
          description: "Get block details by number",
        },
        callContract: {
          description: "Call a smart contract method (read-only)",
        },
        getLogs: {
          description: "Get event logs from the blockchain",
        },
        sendRawTransaction: {
          description: "Submit a signed transaction to the network",
        },
      },
    },
  },
  {
    ...(process.env.REDIS_URL ? { redisUrl: process.env.REDIS_URL } : {}),
    basePath: "",
    verboseLogs: true,
    maxDuration: 60
  }
);

export { handler as GET, handler as POST, handler as DELETE };
