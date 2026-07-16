import { AnalyticsMetrics } from '../types/vault';

export const exportProofAsJSON = (metrics: AnalyticsMetrics) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metrics, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `StellarVault_Level4_Proof_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportProofAsCSV = (metrics: AnalyticsMetrics) => {
  let csv = "Tx Hash,Timestamp,Wallet Address,Action,Amount,Status\n";
  metrics.interactionProofs.forEach(p => {
    csv += `"${p.txHash}","${p.timestamp}","${p.walletAddress}","${p.action}","${p.amount || 0}","${p.status}"\n`;
  });
  
  const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `StellarVault_Wallet_Interactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
