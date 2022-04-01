
export interface UserAgentInfo {
  ua: string;
  browser: UserAgentBrowser;
  engine: UserAgentEngine;
  os: UserAgentOS;
  device: UserAgentDevice;
  cpu: UserAgentCPU;
}

interface UserAgentBrowser {
  name: string,
  version: string,
  major: string
}

interface UserAgentEngine {
  name: string,
  version: string,
}

interface UserAgentOS {
  name: string,
  version: string,
}

interface UserAgentDevice {
}

interface UserAgentCPU {
  architecture: string;
}