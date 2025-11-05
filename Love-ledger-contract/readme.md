# 💞 LoveLedger Protocol

**LoveLedger** adalah rangkaian smart contract berbasis Ethereum yang mendefinisikan *digital proof of love* antara dua wallet — menggabungkan **komitmen finansial**, **NFT soulbound**, dan **mekanisme kepercayaan** melalui vault escrow otomatis.

---

## 🧩 Arsitektur Kontrak

Protokol ini terdiri dari **tiga smart contract utama**:

| Kontrak | Deskripsi Singkat |
|----------|-------------------|
| [`LoveFundVault.sol`](./LoveFundVault.sol) | Escrow vault untuk menyimpan dan mendistribusikan dana antara dua pihak (creator & partner). |
| [`LoveLedger.sol`](./LoveLedger.sol) | Kontrak utama yang mengelola lifecycle hubungan (create, pair, verify, unpair) serta interaksi dengan vault & NFT. |
| [`LoveNFT.sol`](./LoveNFT.sol) | Soulbound NFT yang menjadi simbol bukti cinta (LoveProofNFT) dan diberikan ke kedua pasangan saat verifikasi berhasil. |

---

## ⚙️ Alur Fungsional

### 1. 💍 Membuat Love Contract
Creator membuat kontrak dengan:
- Menentukan alamat partner.
- Menyetorkan sejumlah ETH sebagai *love stake*.
- Menentukan apakah dana bisa dikembalikan (*refund option*) atau dibakar jika hubungan berakhir.

```solidity
function createLoveContract(address _partner, bool _refundOption) external payable;
