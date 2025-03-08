import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  TransactionReceipt,
  FileCreateTransaction,
  FileAppendTransaction,
} from "@hashgraph/sdk";

interface SavedData {
  topic: string;
  pairingString: string;
  accountIds: string[];
  network: "testnet" | "mainnet" | "previewnet";
}

class HederaService {
  private static instance: HederaService;
  private hashConnect: HashConnect;
  private accountId: string | null = null;
  private topic: string | null = null;
  private network: "testnet" | "mainnet" | "previewnet" = "testnet";
  private initData: HashConnectTypes.InitilizationData | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    this.hashConnect = new HashConnect(true);
  }

  public static getInstance(): HederaService {
    if (!HederaService.instance) {
      HederaService.instance = new HederaService();
    }
    return HederaService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      if (this.isInitialized && this.accountId) {
        return;
      }

      const appMetadata: HashConnectTypes.AppMetadata = {
        name: "HederaMart",
        description: "Decentralized Marketplace on Hedera",
        icon: "https://www.hedera.com/logo-capital-hbar-wordmark.png",
        url: window.location.origin,
      };

      // Initialize HashConnect
      this.initData = await this.hashConnect.init(appMetadata, this.network, false);
      this.topic = this.initData.topic;

      // Handle existing pairing
      if (this.initData.savedPairings && this.initData.savedPairings.length > 0) {
        const savedPairing = this.initData.savedPairings[0];
        this.accountId = savedPairing.accountIds[0];
        this.isInitialized = true;
        return;
      }

      // Set up pairing event listener
      this.hashConnect.pairingEvent.once((data: MessageTypes.ApprovePairing) => {
        console.log("Pairing approved:", data);
        this.accountId = data.accountIds[0];
        this.isInitialized = true;
      });

      // Connect to HashPack
      await this.hashConnect.connectToLocalWallet();

      // Wait for pairing completion with timeout
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 30000); // 30 seconds timeout

        const checkPairing = () => {
          if (this.accountId) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkPairing, 500);
          }
        };
        checkPairing();
      });

    } catch (error) {
      console.error("Failed to initialize Hedera service:", error);
      this.isInitialized = false;
      this.accountId = null;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.topic) {
        await this.hashConnect.disconnect(this.topic);
      }
      this.accountId = null;
      this.isInitialized = false;
      window.location.reload();
    } catch (error) {
      console.error("Failed to disconnect:", error);
      throw error;
    }
  }

  public getAccountId(): string | null {
    return this.accountId;
  }

  public isConnected(): boolean {
    return !!this.accountId && !!this.topic;
  }

  public async uploadFile(file: File): Promise<string> {
    if (!this.accountId) throw new Error("Wallet not connected");

    try {
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      const transaction = new FileCreateTransaction()
        .setContents(fileBytes.slice(0, 2048))
        .setMaxTransactionFee(new Hbar(2));

      const response = await this.hashConnect.sendTransaction(this.topic!, {
        topic: this.topic!,
        byteArray: transaction.toBytes(),
        metadata: { accountToSign: this.accountId, returnTransaction: false },
      });

      const receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
      const fileId = receipt.fileId;
      if (!fileId) throw new Error("Failed to create file");

      return fileId.toString();
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }
}

export default HederaService;
