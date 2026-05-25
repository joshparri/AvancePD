# Optional Sync Plan

The app remains local-first. Sync is optional future work and should only be added if local backup/export is not enough.

## Preferred Order

1. Manual JSON backup and restore.
2. Private Vercel deployment with browser localStorage.
3. Optional Supabase sync after explicit opt-in.

## Requirements For Any Sync

- Keep client data, credentials, screenshots, IPs, hostnames, and copied tickets out of sync.
- Use server-side secrets only.
- Add export/delete controls before enabling sync.
- Make sync opt-in per browser profile.
- Keep Health & Outdoors data simple and non-medical.

## Candidate Data To Sync

- tasks
- work logs
- learning items
- knowledge entries
- playbooks
- progress state
- health action counts and reminder settings

## Data Not To Sync

- API keys
- passwords
- client-identifying details
- screenshots
- ticket exports
- private health or medical notes
