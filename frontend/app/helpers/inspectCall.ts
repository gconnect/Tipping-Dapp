import { ethers, toBeHex } from "ethers"
import configFile from '../cartesi/config.json'
import { Chain } from "viem"

const config: any = configFile

export const inspectCall = async (payload: string, chain: Chain) => {
  if (!chain) {
    return
  }

  let apiURL = ''

  if (config[toBeHex(chain.id)]?.inspectAPIURL) {
    apiURL = `${config[toBeHex(chain.id)].inspectAPIURL}/inspect`
  } else {
    console.error(
      `No inspect interface defined for chain ${toBeHex(chain.id)}`
    )
    return
  }

  let fetchData: Promise<Response>

  fetchData = fetch(`${apiURL}/${payload}`)

  try {
    const response = await fetchData
    const res = await response.json()
    return res.reports.map((report: any) => {
      const decodedPayload = ethers.toUtf8String(report.payload)
      const payloadJSON = JSON.parse(decodedPayload)
      return payloadJSON
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}