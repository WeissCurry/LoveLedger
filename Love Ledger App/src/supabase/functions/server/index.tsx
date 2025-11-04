import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c17b8718/health", (c) => {
  return c.json({ status: "ok" });
});

// Love Ledger Routes

// Create a new love contract
app.post("/make-server-c17b8718/contracts/create", async (c) => {
  try {
    const { creatorWallet, partnerWallet, amount, duration, refundOption } = await c.req.json();
    
    if (!creatorWallet || !partnerWallet || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const contractId = `contract_${creatorWallet}_${Date.now()}`;
    const contract = {
      id: contractId,
      creatorWallet,
      partnerWallet,
      amount,
      duration: duration || null, // Optional: null means no expiry
      refundOption,
      status: "pending", // pending, active, verified, terminated
      verifiedCreator: false,
      verifiedPartner: false,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      paired: false,
    };

    await kv.set(contractId, contract);
    await kv.set(`wallet_${creatorWallet}`, contractId);

    console.log(`Contract created: ${contractId} for ${creatorWallet}`);
    return c.json({ success: true, contract });
  } catch (error) {
    console.log(`Error creating contract: ${error}`);
    return c.json({ error: "Failed to create contract", details: String(error) }, 500);
  }
});

// Pair wallet (partner accepts the contract)
app.post("/make-server-c17b8718/contracts/pair", async (c) => {
  try {
    const { contractId, partnerWallet } = await c.req.json();
    
    const contract = await kv.get(contractId);
    if (!contract) {
      return c.json({ error: "Contract not found" }, 404);
    }

    if (contract.partnerWallet !== partnerWallet) {
      return c.json({ error: "Unauthorized partner wallet" }, 403);
    }

    contract.paired = true;
    contract.status = "active";
    contract.lastActivity = new Date().toISOString();

    await kv.set(contractId, contract);
    await kv.set(`wallet_${partnerWallet}`, contractId);

    console.log(`Contract paired: ${contractId}`);
    return c.json({ success: true, contract });
  } catch (error) {
    console.log(`Error pairing contract: ${error}`);
    return c.json({ error: "Failed to pair contract", details: String(error) }, 500);
  }
});

// Verify marriage (mutual verification)
app.post("/make-server-c17b8718/contracts/verify", async (c) => {
  try {
    const { contractId, wallet } = await c.req.json();
    
    const contract = await kv.get(contractId);
    if (!contract) {
      return c.json({ error: "Contract not found" }, 404);
    }

    if (contract.status !== "active") {
      return c.json({ error: "Contract is not active" }, 400);
    }

    // Update verification status based on wallet
    if (wallet === contract.creatorWallet) {
      contract.verifiedCreator = true;
    } else if (wallet === contract.partnerWallet) {
      contract.verifiedPartner = true;
    } else {
      return c.json({ error: "Unauthorized wallet" }, 403);
    }

    contract.lastActivity = new Date().toISOString();

    // Check if both verified
    if (contract.verifiedCreator && contract.verifiedPartner) {
      contract.status = "verified";
      contract.verifiedAt = new Date().toISOString();
      console.log(`Contract fully verified: ${contractId}`);
    }

    await kv.set(contractId, contract);

    return c.json({ success: true, contract, bothVerified: contract.status === "verified" });
  } catch (error) {
    console.log(`Error verifying contract: ${error}`);
    return c.json({ error: "Failed to verify contract", details: String(error) }, 500);
  }
});

// Unpair/terminate contract
app.post("/make-server-c17b8718/contracts/unpair", async (c) => {
  try {
    const { contractId, wallet } = await c.req.json();
    
    const contract = await kv.get(contractId);
    if (!contract) {
      return c.json({ error: "Contract not found" }, 404);
    }

    if (wallet !== contract.creatorWallet && wallet !== contract.partnerWallet) {
      return c.json({ error: "Unauthorized wallet" }, 403);
    }

    contract.status = "terminated";
    contract.terminatedBy = wallet;
    contract.terminatedAt = new Date().toISOString();

    await kv.set(contractId, contract);

    console.log(`Contract terminated: ${contractId} by ${wallet}`);
    return c.json({ success: true, contract });
  } catch (error) {
    console.log(`Error terminating contract: ${error}`);
    return c.json({ error: "Failed to terminate contract", details: String(error) }, 500);
  }
});

// Get contract by ID
app.get("/make-server-c17b8718/contracts/:id", async (c) => {
  try {
    const contractId = c.req.param("id");
    const contract = await kv.get(contractId);
    
    if (!contract) {
      return c.json({ error: "Contract not found" }, 404);
    }

    return c.json({ success: true, contract });
  } catch (error) {
    console.log(`Error fetching contract: ${error}`);
    return c.json({ error: "Failed to fetch contract", details: String(error) }, 500);
  }
});

// Get contract by wallet address
app.get("/make-server-c17b8718/contracts/wallet/:wallet", async (c) => {
  try {
    const wallet = c.req.param("wallet");
    const contractId = await kv.get(`wallet_${wallet}`);
    
    if (!contractId) {
      return c.json({ success: true, contract: null });
    }

    const contract = await kv.get(contractId);
    return c.json({ success: true, contract });
  } catch (error) {
    console.log(`Error fetching contract by wallet: ${error}`);
    return c.json({ error: "Failed to fetch contract", details: String(error) }, 500);
  }
});

// Get global stats
app.get("/make-server-c17b8718/stats", async (c) => {
  try {
    // Get all contracts
    const allContracts = await kv.getByPrefix("contract_");
    
    const stats = {
      totalContracts: allContracts.length,
      activeContracts: allContracts.filter(c => c.status === "active").length,
      verifiedContracts: allContracts.filter(c => c.status === "verified").length,
      totalLocked: allContracts
        .filter(c => c.status === "active")
        .reduce((sum, c) => sum + parseFloat(c.amount), 0),
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.log(`Error fetching stats: ${error}`);
    return c.json({ error: "Failed to fetch stats", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);