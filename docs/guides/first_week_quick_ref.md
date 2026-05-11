# Avance IT First Week Quick Reference
## Your Pocket Guide to Monday & Wednesday

---

## BEFORE YOU ARRIVE

**Check the night before (or early morning):**
1. What's the weather? (Dubbo can be hot/cold—bring layers)
2. Do you know which clients might have issues? (Check your notes from last shift)
3. Have you looked at the pre-shift checklist? (Takes 15 mins)
4. Do you have your work access (keys, passwords, IT account)?

**What to bring:**
- Laptop/tablet (for checking Datto RMM, RustDesk)
- Notebook (or phone notes app)
- Water bottle
- Phone charger
- Confidence 💪

---

## ON ARRIVAL (8:30 AM)

**First 10 minutes:**
1. Drop your bag, settle in
2. Say good morning to whoever's there (Andrew, James, others)
3. Check Datto RMM dashboard for overnight alerts
4. Ask: "What's on the priority list today?"

**What to expect:**
- Office is at Unit 10/36 Darling Street (Riverview Business Park)
- Team might be in office or spread across client sites
- There's likely a support ticket queue waiting
- Coffee/tea probably available (ask where)

---

## TYPICAL TASK FLOW

### Ticket Comes In
```
Client emails support@avance.technology
↓
You see it in ticket system or James forwards it
↓
Read the problem carefully (ask for clarification if unclear)
↓
Do you know how to fix it?
├─ YES: Estimate time, do it, document what you did
└─ NO: Ask James, then document what you learn
↓
Test the fix with the client
↓
Mark resolved, ask for feedback
```

### Common Scenarios

**Scenario 1: Password Reset**
- Where? Cloud (Microsoft 365 / Google Workspace) or on-premise
- Tools: Microsoft admin portal or Google Admin
- Process: Verify identity, reset, send temp password, client changes it
- Time: 5 mins
- Escalate? No (unless it's related to a security breach)

**Scenario 2: No WiFi Connectivity**
- First: Is it WiFi or network issue? (Have them restart router)
- Check Ubiquiti UniFi dashboard for AP health
- Ask: Can they see the WiFi network? Can they ping 8.8.8.8?
- Common fixes: Restart AP, forget/rejoin network, check channel interference
- Time: 10–30 mins
- Escalate? If it's a network outage affecting multiple people

**Scenario 3: Computer Running Slow**
- Check Datto RMM: CPU, RAM, disk space
- Ask: When did it start? What were they doing?
- Run: Updates, antivirus scan, disk cleanup
- If still slow: Escalate to James (might be malware or hardware)
- Time: 20–60 mins
- Escalate? Probably, after initial triage

**Scenario 4: Email Not Sending/Receiving**
- Check: Internet connectivity first
- Check: Email client (Outlook, Gmail, etc.) settings
- Check: Cloud service status (is Microsoft/Google down?)
- Restart Outlook or check webmail directly
- If still broken: Escalate to James (could be server-side)
- Time: 10–30 mins

**Scenario 5: Access Denied to File Share**
- Question: Are they on the right network/VPN?
- Check: Do they have the right permissions?
- Common fix: Add them to the security group, restart their computer
- Escalate: If it's a permissions/Active Directory problem
- Time: 10–20 mins

---

## TOOLS YOU'LL USE EVERY SHIFT

### Datto RMM Dashboard
**What to look for:**
- Red alerts = urgent, needs immediate attention
- Yellow alerts = warning, check before end of shift
- Green = healthy
- Sort by "recently changed" to see new issues

**Quick actions:**
- Click a device → see monitoring history
- Right-click → run script, get remote access, restart
- Use search to find a specific client's devices

### RustDesk (Remote Support)
**Basic flow:**
1. Tell client: "I'm going to connect remotely—you'll see my cursor"
2. They approve the connection attempt
3. You see their screen
4. Make changes with their permission
5. Disconnect when done

**Golden rules:**
- Always ask permission first
- Explain what you're doing ("I'm about to restart your computer")
- Don't snoop around (stay focused on the problem)
- Log off when done (don't leave session open)

### Microsoft 365 / Google Workspace
**Common tasks:**
- Reset a user password
- Create a new user account
- Enable/disable multi-factor authentication (MFA)
- Add someone to a team/group
- Check mailbox size

**How to find help:**
- Microsoft 365: Search in Microsoft 365 admin center (admin.microsoft.com)
- Google Workspace: Check Google Admin training videos

### Ubiquiti UniFi
**What you'll check:**
- Are WiFi access points online?
- How strong is the signal in that area?
- Is there channel interference?
- How much bandwidth is being used?

**Common fix:** Restart the AP (power off 30 secs, back on)

---

## WHEN TO ESCALATE TO JAMES

**Definitely escalate if:**
- ❌ Client thinks they've been hacked / data breach
- ❌ Network is completely down (multiple clients affected)
- ❌ You see malware or suspicious behavior
- ❌ Client lost important data
- ❌ Problem involves security policy changes
- ❌ You've spent > 30 mins and it's not fixed
- ❌ You're not sure what to do

**Safe to handle yourself (after first week):**
- ✅ Password resets
- ✅ WiFi connectivity issues
- ✅ Software installation
- ✅ Printer not printing
- ✅ Computer running slow (basic cleanup)
- ✅ Email client configuration
- ✅ User account creation
- ✅ Simple hardware questions

**When in doubt, ask James.** It's better to ask than to break something.

---

## KEY PHONE NUMBERS & EMAILS

**Avance Main Office:**
- Phone: 1800 AVANCE or (02) 6837 1555
- Email: enquiries@avance.technology

**Support Email:**
- support@avance.technology

**Key People:**
- Andrew Johnston (Managing Director): ___ (ask for number)
- James Newby (Head Technician): ___ (ask for number)

**Emergency (after hours):**
- Ask Andrew or James how after-hours escalation works

---

## GLOSSARY: ESSENTIAL TERMS FOR DAY 1

| Term | Means | Example |
|------|-------|---------|
| **Ticket** | A support request from a client | "We have 5 tickets in the queue" |
| **RMM** | Remote Monitoring and Management—software that watches client computers | "Check the RMM dashboard for alerts" |
| **Agent** | Software installed on a computer that reports to RMM | "The Datto agent on that computer is offline" |
| **Alert** | RMM noticed something—might be a problem | "Red alert: disk space running out" |
| **Escalation** | Handing the problem to someone more senior | "This is above my pay grade—escalating to James" |
| **Malware** | Bad software (virus, ransomware, etc.) | "That computer has malware; don't touch it" |
| **Phishing** | Fake email trying to steal login info | "That email looks like phishing—don't click" |
| **MFA** | Multi-factor authentication—password + code for extra security | "Enable MFA on all admin accounts" |
| **Cloud** | Software/data stored on the internet, not on local computer | "We're migrating them to the cloud (Microsoft 365)" |
| **VPN** | Virtual Private Network—secure connection to company network | "Use VPN to access the file share from home" |
| **On-premise** | Software/servers in the actual office (not cloud) | "They have an on-premise mail server" |
| **WiFi** | Wireless internet | "The WiFi password changed; clients need to rejoin" |
| **Network** | All computers/devices connected together | "The network is down; nothing works" |
| **Firewall** | Security device that controls what gets in/out | "The firewall is blocking that app" |
| **Antivirus** | Software that detects and removes malware | "Run an antivirus scan first" |
| **Patch/Update** | Security fix or improvement from a vendor | "Windows updates are critical; deploy them" |

---

## END OF SHIFT (4:50 PM)

**Before you leave:**
1. Mark all tickets with your status (Resolved, Waiting for Client, Escalated)
2. Write brief notes on anything you learned
3. Mention any blockers to James or Andrew
4. Log off your computer
5. Pack up your stuff

**Use the app to log your shift:**
- How many tickets did you resolve?
- What was hardest?
- What did you learn?
- What will you practice next time?

---

## WEEK 1 GOALS

By the end of your first week (after 2 shifts), aim for:

✅ Understand Avance's service model  
✅ Know all 4 team members' names and roles  
✅ Resolve 5–10 tickets independently  
✅ Navigate Datto RMM with confidence  
✅ Use RustDesk to remote-in to a client computer  
✅ Reset at least 3 user passwords  
✅ Ask for help when stuck (don't spin your wheels)  
✅ Document 3–5 things you learned  

**You don't need to be an expert. You just need to be curious, ask questions, and keep trying.**

---

## QUICK TROUBLESHOOTING FLOWCHART

```
PROBLEM REPORTED
    ↓
Can I fix it in < 15 mins?
├─ YES → Try it, document what happened, tell client status
└─ NO → Is it security/data/critical?
        ├─ YES → ESCALATE IMMEDIATELY to James
        └─ NO → Ask James if you should keep trying
                ├─ YES → Keep trying, log what you learn
                └─ NO → Escalate, move to next ticket
```

---

## RANDOM HELPFUL THINGS

- **Google is your friend.** If you don't know something, search for it. "Datto RMM how to reset password" or "RustDesk connection failed"
- **Clients are nice.** Dubbo is a community. People appreciate effort and honesty over perfection.
- **Take notes.** Write down commands, error messages, solutions. You'll forget otherwise.
- **Ask for help.** James has probably seen the issue before. A 2-min question beats an hour of guessing.
- **Drink water.** You'll be staring at screens; remember to hydrate.
- **Explain in plain English.** Don't use jargon with clients. "Your computer is getting too full" not "Disk space allocation exceeded."
- **Always confirm with client.** "Did that fix it?" before marking resolved.
- **You're new; be kind to yourself.** Everyone on the team was new once.

---

## GLOSSARY ADDITIONS (YOUR LEARNING)

As you work, you'll hear new terms. Write them here:

**New term: _______________**  
What I learned: _______________

**New term: _______________**  
What I learned: _______________

(Keep adding to this list—you'll build your own reference!)

---

## NOTES FROM YOUR SHIFTS

### Monday [DATE]:
- What I did: 
- What was hard: 
- What I learned: 
- Next focus: 

### Wednesday [DATE]:
- What I did: 
- What was hard: 
- What I learned: 
- Next focus: 

---

**Remember:** You've got this. The team is small, which means you'll learn fast. Every ticket you resolve builds confidence and knowledge. Check in with James regularly, document what you learn, and celebrate small wins.

**Good luck on Monday! 🚀**
