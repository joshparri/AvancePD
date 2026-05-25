export type ToolPrimerPriority = 'high' | 'medium' | 'low';

export interface ToolPrimerSection {
  title: string;
  body?: string;
  steps?: string[];
  keyOutputs?: string[];
  screenshots?: string[];
  warning?: string;
}

export interface ToolPrimer {
  id: string;
  title: string;
  description: string;
  priority: ToolPrimerPriority;
  tags: string[];
  toolUsed?: string;
  createdBy?: string;
  sections: ToolPrimerSection[];
}

export const toolPrimers: ToolPrimer[] = [
  {
    id: 'windows-rdp-remoteapps',
    title: 'Windows Remote Desktop & RemoteApps',
    description:
      'The primary method for clients to securely connect to on-premise servers or virtual desktop infrastructure, often managed through Remote Desktop Gateway, RemoteApp feeds, or access tools such as Pritunl and Work Resources.',
    priority: 'high',
    tags: ['rdp', 'remoteapps', 'certificates', 'tls', 'rdg', 'pritunl'],
    sections: [
      {
        title: 'What it is',
        body:
          'Remote Desktop and RemoteApps let users run applications or full desktops hosted on client infrastructure. In MSP support, failures often sit at the boundary between local client setup, VPN/RDG access, certificate trust, and server-side RDS configuration.',
      },
      {
        title: '"An internal error has occurred" - certificate or TLS issue',
        body:
          'This generic RDP error can occur when the Remote Desktop Services certificate has expired, the client does not trust the certificate chain, or the server cannot access the private key for its TLS credential. A useful server-side clue is event log error 0x8009030D, which indicates a TLS server credential private key problem.',
        steps: [
          'Ask what changed and capture the exact error text before attempting fixes.',
          'Try to reproduce the failure from an internal VM or known-good internal workstation. If the same error appears internally, treat it as likely server-side.',
          'For a safe client-side check, ask the user to refresh the RemoteApp feed through Control Panel > RemoteApp and Desktop Connections.',
          'If directed, install the approved latest .cer file, such as hinesrdpnew.cer when that is the current file, into both Current User and Local Machine certificate stores.',
          'If certificate trust is correct but the error persists, escalate for server-side RDP certificate binding, private key permission, and RDS security permission checks.',
        ],
        screenshots: [
          'Screenshot placeholder: Control Panel > RemoteApp and Desktop Connections showing the subscribed workplace feed and update action.',
        ],
        warning:
          'Do not attempt server-side changes, including altering RDP encryption or security layer settings, unless a senior technician directs you to do so.',
      },
      {
        title: 'General connectivity troubleshooting tree',
        steps: [
          'Confirm the user is connected to the expected access path: VPN, Pritunl, Remote Desktop Gateway, or the approved Work Resources feed.',
          'Check that the user is launching the correct RDP icon, RemoteApp icon, or .rdp file, especially if multiple old shortcuts exist.',
          'If the user is remote, check the server or endpoint status in Datto RMM before assuming the local machine is at fault.',
          'Compare one-user versus many-user impact. One user points toward shortcut, profile, VPN, local certificate, or permissions issues; many users points toward service, certificate, gateway, or server health.',
          'Document the exact path tested, error text, device name, access method, and whether the issue reproduced internally.',
        ],
      },
      {
        title: 'Ticket note checklist',
        steps: [
          'Record the exact RDP or RemoteApp error text and when it started.',
          'Record whether VPN/RDG/Work Resources was connected and refreshed.',
          'Record whether an internal VM reproduced the issue.',
          'Record any certificate file installed and which stores were used.',
          'Record escalation details if server-side certificate, private key, or RDS permission work is required.',
        ],
      },
    ],
  },
  {
    id: 'llm-creative-research-castle-crydee',
    title: 'LLM Creative Research: Castle Crydee (Fictional Architecture)',
    description:
      'An example of using generative AI for highly specific world-building and descriptive content, showing how LLMs can produce detailed architectural analysis of fictional structures.',
    priority: 'low',
    tags: ['llm', 'creative-research', 'world-building', 'low-priority'],
    toolUsed: 'Gemini/LLM',
    createdBy: 'Josh Parris',
    sections: [
      {
        title: 'What it is',
        body:
          'This note captures an informal creative research use case. It is useful as an example of structured prompt output, but it is intentionally low priority beside operational primers such as RDP troubleshooting.',
      },
      {
        title: 'Key outputs',
        keyOutputs: [
          'Structure Description: The castle is described as having a late Norman or early medieval northern European structure, with a central keep fortified by high walls and outbuildings built directly into the curtain walls.',
          'Layout Details: The castle sits on a large hill, separated from the town to the west by meadows and woodlands.',
          'Internal Features: Notable interior spaces include garrison quarters, a courtyard, and a large dining hall where Pug is mentored.',
        ],
      },
    ],
  },
];
