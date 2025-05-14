/**
 * Nexus blockchain utility functions for MCP server
 */

// Nexus blockchain configuration
export const NEXUS_CONFIG = {
  chainId: "393",
  rpcUrl: "https://rpc.nexus.xyz/http",
  wsUrl: "wss://rpc.nexus.xyz/ws",
  explorerUrl: "https://explorer.nexus.xyz",
};

// Basic JSON-RPC request function
export async function rpcRequest(method: string, params: any[] = []) {
  const response = await fetch(NEXUS_CONFIG.rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  return data.result;
}

// Common Nexus RPC methods
export async function getBlockNumber() {
  return rpcRequest('eth_blockNumber');
}

export async function getBalance(address: string) {
  return rpcRequest('eth_getBalance', [address, 'latest']);
}

export async function getTransaction(txHash: string) {
  return rpcRequest('eth_getTransactionByHash', [txHash]);
}

export async function getTransactionReceipt(txHash: string) {
  return rpcRequest('eth_getTransactionReceipt', [txHash]);
}

export async function getBlockByNumber(blockNumber: string, fullTransactions = false) {
  return rpcRequest('eth_getBlockByNumber', [blockNumber, fullTransactions]);
}

export async function sendRawTransaction(signedTx: string) {
  return rpcRequest('eth_sendRawTransaction', [signedTx]);
}

export async function call(callObject: any) {
  return rpcRequest('eth_call', [callObject, 'latest']);
}

export async function estimateGas(callObject: any) {
  return rpcRequest('eth_estimateGas', [callObject]);
}

export async function getCode(address: string) {
  return rpcRequest('eth_getCode', [address, 'latest']);
}

export async function getLogs(filterObject: any) {
  return rpcRequest('eth_getLogs', [filterObject]);
}

export async function getNetworkInfo() {
  const [chainId, blockNumber] = await Promise.all([
    rpcRequest('eth_chainId'),
    getBlockNumber()
  ]);
  
  return {
    chainId,
    blockNumber,
    networkConfig: NEXUS_CONFIG
  };
} 