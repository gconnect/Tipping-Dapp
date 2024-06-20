import { INSPECT_BASE_URL } from "../utils/constants";
import { ethers } from "ethers";
import { Report } from "../cartesi/hooks/useReports"

export const fetchCreators = async () => {
  const result = await fetch(`${INSPECT_BASE_URL}/get_creators`);
  if (!result.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await result.json()
  const decode = data.reports.map((report: Report) => {
    return ethers.toUtf8String(report.payload);
  });
  const reportData: any = JSON.parse(decode);
  return reportData;
};