"use client"

import { Smartphone, Monitor, Tablet, Trash2 } from "lucide-react"

const mockDevices = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    type: "mobile",
    lastActive: "2 hours ago",
    location: "Harare, Zimbabwe",
  },
  {
    id: 2,
    name: "MacBook Air",
    type: "desktop",
    lastActive: "Just now",
    location: "Cape Town, South Africa",
  },
  {
    id: 3,
    name: "Samsung Galaxy Tab S8",
    type: "tablet",
    lastActive: "Yesterday",
    location: "Lagos, Nigeria",
  },
]

function getDeviceIcon(type: string) {
  switch (type) {
    case "mobile":
      return <Smartphone className="w-6 h-6 text-red-500" />
    case "desktop":
      return <Monitor className="w-6 h-6 text-blue-500" />
    case "tablet":
      return <Tablet className="w-6 h-6 text-green-500" />
    default:
      return <Monitor className="w-6 h-6 text-gray-400" />
  }
}

export default function DevicesList() {
  return (
    <div className="">
      <h2 className="text-xl font-bold text-white mb-4">Your Devices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockDevices.map((device) => (
          <div
            key={device.id}
            className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-xl p-5 flex flex-col gap-2 shadow-lg border border-gray-800 backdrop-blur-md"
          >
            <div className="flex items-center gap-3 mb-2">
              {getDeviceIcon(device.type)}
              <span className="text-white font-semibold text-base">{device.name}</span>
            </div>
            <div className="text-gray-400 text-sm mb-1">{device.location}</div>
            <div className="text-gray-500 text-xs mb-2">Last active: {device.lastActive}</div>
            <button
              className="absolute top-3 right-3 p-1 rounded-full bg-black/40 hover:bg-red-600 transition-colors"
              title="Remove device"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  )
} 