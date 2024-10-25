import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const NetworkDashboard = () => {
  const data = {
    "timestamp": "2024-10-25 17:00:52",
    "interfaces": {
      "lo": {
        "addresses": [
          {
            "family": "2",
            "address": "127.0.0.1",
            "netmask": "255.0.0.0",
            "broadcast": null
          },
          {
            "family": "10",
            "address": "::1",
            "netmask": "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
            "broadcast": null
          },
          {
            "family": "17",
            "address": "00:00:00:00:00:00",
            "netmask": null,
            "broadcast": null
          }
        ],
        "is_up": true,
        "speed_mbps": 0,
        "mtu": 65536,
        "packets_sent": 1544919,
        "packets_recv": 1544919,
        "bytes_sent": 1399069054,
        "bytes_recv": 1399069054,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "wlx98254a5bcbcd": {
        "addresses": [
          {
            "family": "2",
            "address": "172.168.20.107",
            "netmask": "255.255.255.0",
            "broadcast": "172.168.20.255"
          },
          {
            "family": "10",
            "address": "fe80::c633:91f2:417f:4c09%wlx98254a5bcbcd",
            "netmask": "ffff:ffff:ffff:ffff::",
            "broadcast": null
          },
          {
            "family": "17",
            "address": "98:25:4a:5b:cb:cd",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": true,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 364856,
        "packets_recv": 470530,
        "bytes_sent": 167157059,
        "bytes_recv": 318683046,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 2413,
        "drop_out": 0
      },
      "br-3f9e8ad8364a": {
        "addresses": [
          {
            "family": "2",
            "address": "172.19.0.1",
            "netmask": "255.255.0.0",
            "broadcast": "172.19.255.255"
          },
          {
            "family": "17",
            "address": "02:42:f6:b1:38:ea",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": false,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 0,
        "packets_recv": 0,
        "bytes_sent": 0,
        "bytes_recv": 0,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "docker0": {
        "addresses": [
          {
            "family": "2",
            "address": "172.17.0.1",
            "netmask": "255.255.0.0",
            "broadcast": "172.17.255.255"
          },
          {
            "family": "17",
            "address": "02:42:78:0c:aa:40",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": false,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 0,
        "packets_recv": 0,
        "bytes_sent": 0,
        "bytes_recv": 0,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "br-c99c6e947283": {
        "addresses": [
          {
            "family": "2",
            "address": "172.18.0.1",
            "netmask": "255.255.0.0",
            "broadcast": "172.18.255.255"
          },
          {
            "family": "17",
            "address": "02:42:2b:f0:a1:2d",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": false,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 0,
        "packets_recv": 0,
        "bytes_sent": 0,
        "bytes_recv": 0,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "tun0": {
        "addresses": [
          {
            "family": "2",
            "address": "10.0.0.70",
            "netmask": "255.255.128.0",
            "broadcast": null
          },
          {
            "family": "10",
            "address": "fe80::aaa5:4b5c:fa03:b978%tun0",
            "netmask": "ffff:ffff:ffff:ffff::",
            "broadcast": null
          }
        ],
        "is_up": true,
        "speed_mbps": 10000,
        "mtu": 1500,
        "packets_sent": 256890,
        "packets_recv": 301662,
        "bytes_sent": 93759921,
        "bytes_recv": 178472335,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "enp2s0": {
        "addresses": [
          {
            "family": "17",
            "address": "98:29:a6:2b:83:05",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": false,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 0,
        "packets_recv": 0,
        "bytes_sent": 0,
        "bytes_recv": 0,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      },
      "wlp3s0": {
        "addresses": [
          {
            "family": "17",
            "address": "98:22:ef:e8:84:21",
            "netmask": null,
            "broadcast": "ff:ff:ff:ff:ff:ff"
          }
        ],
        "is_up": false,
        "speed_mbps": 0,
        "mtu": 1500,
        "packets_sent": 0,
        "packets_recv": 0,
        "bytes_sent": 0,
        "bytes_recv": 0,
        "err_in": 0,
        "err_out": 0,
        "drop_in": 0,
        "drop_out": 0
      }
    }
  };

  // Transform data for traffic chart
  const trafficData = Object.entries(data.interfaces)
    .filter(([_, info]) => info.is_up)
    .map(([name, info]) => ({
      name,
      'Bytes Sent (MB)': (info.bytes_sent / 1024 / 1024).toFixed(2),
      'Bytes Received (MB)': (info.bytes_recv / 1024 / 1024).toFixed(2),
      'Packets Sent': info.packets_sent,
      'Packets Received': info.packets_recv
    }));

  // Calculate total traffic for pie chart
  const totalTraffic = Object.entries(data.interfaces)
    .filter(([_, info]) => info.is_up)
    .map(([name, info]) => ({
      name,
      value: info.bytes_sent + info.bytes_recv
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Network Interface Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="bytesSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="bytesReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="Bytes Sent (MB)" 
                  stroke="#0088FE" 
                  fillOpacity={1} 
                  fill="url(#bytesSent)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Bytes Received (MB)" 
                  stroke="#00C49F" 
                  fillOpacity={1} 
                  fill="url(#bytesReceived)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Packet Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="packetsSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="packetsReceived" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="Packets Sent" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#packetsSent)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Packets Received" 
                    stroke="#82ca9d" 
                    fillOpacity={1} 
                    fill="url(#packetsReceived)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Traffic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalTraffic}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {totalTraffic.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkDashboard;