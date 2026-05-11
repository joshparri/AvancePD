import { clearAllData, db } from './db';
import {
  Shift,
  WorkLog,
  Task,
  PDAchievement,
  PDGoal,
  Client,
  Project,
  AppSettings,
  KnowledgeEntry,
  Playbook,
  LearningItem,
  Invoice,
  WorkCategory,
  KnowledgeCategory,
  PlaybookCategory,
  LearningCategory,
  LearningStatus,
  LearningPriority,
  TaskStatus,
  TaskPriority,
  TaskCategory,
  PDCategory,
  PDGoalStatus,
  ProjectStatus,
  InvoiceStatus,
} from '@/types';

// Generate UUIDs
const generateId = () => crypto.randomUUID();

export const seedDatabase = async () => {
  try {
    // Clear existing data
    await clearAllData();

    // Seed clients
    const clients: Client[] = [
      {
        id: generateId(),
        name: 'Central West Accounting',
        contactInfo: 'Professional services - Microsoft 365 heavy',
        notes: 'Shared mailbox confusion comes up often. Printer/scanner to email occasionally fails. Director wants minimal disruption.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Dubbo Family Dental',
        contactInfo: 'Medical practice',
        notes: 'Reception PC must stay stable. Printer reliability matters. Backup follow-up items need documenting carefully.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Macquarie Plains Motel',
        contactInfo: 'Accommodation business',
        notes: 'Wi-Fi and phone issues are high-stress. Front desk interruptions are constant. After-hours impact can matter more than daytime impact.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Riverside Christian School',
        contactInfo: 'School administration',
        notes: 'Classroom AV, printing, staff laptops, account issues. Speed and calm communication matter.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.clients.bulkAdd(clients);

    // Seed shifts (next Monday and Wednesday)
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() + (1 - now.getDay() + 7) % 7);
    const wednesday = new Date(monday);
    wednesday.setDate(monday.getDate() + 2);

    const shifts: Shift[] = [
      {
        id: generateId(),
        date: monday,
        startTime: '08:30',
        endTime: '17:00',
        duration: 510, // 8.5 hours in minutes
        location: 'Dubbo Office',
        notes: 'Regular Monday shift',
        prepChecklist: [
          {
            id: generateId(),
            title: 'Review outstanding tasks',
            description: 'Check dashboard for high-priority tasks and blocked items',
            completed: false,
            category: 'preparation',
          },
          {
            id: generateId(),
            title: 'Check laptop battery and charger',
            description: 'Ensure laptop is charged and charger is packed',
            completed: false,
            category: 'equipment',
          },
          {
            id: generateId(),
            title: 'Review client knowledge base',
            description: 'Refresh memory on common issues for scheduled clients',
            completed: false,
            category: 'knowledge',
          },
          {
            id: generateId(),
            title: 'Check team communication',
            description: 'Review Slack/email for any urgent messages or updates',
            completed: false,
            category: 'communication',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        date: wednesday,
        startTime: '08:30',
        endTime: '17:00',
        duration: 510,
        location: 'Dubbo Office',
        notes: 'Regular Wednesday shift',
        prepChecklist: [
          {
            id: generateId(),
            title: 'Review outstanding tasks',
            description: 'Check dashboard for high-priority tasks and blocked items',
            completed: false,
            category: 'preparation',
          },
          {
            id: generateId(),
            title: 'Check laptop battery and charger',
            description: 'Ensure laptop is charged and charger is packed',
            completed: false,
            category: 'equipment',
          },
          {
            id: generateId(),
            title: 'Review client knowledge base',
            description: 'Refresh memory on common issues for scheduled clients',
            completed: false,
            category: 'knowledge',
          },
          {
            id: generateId(),
            title: 'Check team communication',
            description: 'Review Slack/email for any urgent messages or updates',
            completed: false,
            category: 'communication',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.shifts.bulkAdd(shifts);

    // Seed work logs
    const workLogs: WorkLog[] = [
      {
        id: generateId(),
        shiftId: shifts[0].id,
        date: monday,
        description: 'Outlook send/receive mismatch on reception PC',
        category: WorkCategory.SUPPORT,
        duration: 45,
        tags: ['outlook', 'email', 'reception'],
        notes: 'Fixed by recreating Outlook profile',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        shiftId: shifts[0].id,
        date: monday,
        description: 'Printer offline after Windows update',
        category: WorkCategory.MAINTENANCE,
        duration: 30,
        tags: ['printer', 'windows', 'update'],
        notes: 'Restarted print spooler service',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        shiftId: shifts[1].id,
        date: wednesday,
        description: 'RustDesk session for slow laptop triage',
        category: WorkCategory.SUPPORT,
        duration: 60,
        tags: ['rustdesk', 'laptop', 'performance'],
        notes: 'Cleaned up temp files and defragmented drive',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        shiftId: shifts[1].id,
        date: wednesday,
        description: 'Wi-Fi dropouts in front office',
        category: WorkCategory.SUPPORT,
        duration: 90,
        tags: ['wifi', 'network', 'ubiquiti'],
        notes: 'Reconfigured access point channels',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        shiftId: shifts[1].id,
        date: wednesday,
        description: 'Shared drive permissions confusion',
        category: WorkCategory.ADMIN,
        duration: 25,
        tags: ['permissions', 'shared-drive', 'access'],
        notes: 'Updated NTFS permissions and reset inheritance',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.workLogs.bulkAdd(workLogs);

    // Seed knowledge entries
    const knowledgeEntries: KnowledgeEntry[] = [
      {
        id: generateId(),
        title: 'Outlook not sending but webmail works',
        content: `**Symptoms:** Outlook shows sending errors but OWA works fine

**Troubleshooting steps:**
1. Compare Outlook vs OWA behavior
2. Check for profile corruption
3. Verify send/receive groups configuration
4. Check mailbox size limits
5. Test cached mode settings

**Common solutions:**
- Recreate Outlook profile
- Clear cached credentials
- Repair PST file
- Check antivirus interference`,
        category: KnowledgeCategory.TROUBLESHOOTING,
        tags: ['outlook', 'email', 'owa', 'sending'],
        clientId: clients[0].id, // Central West Accounting
        relatedTasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Printer appears offline but IP responds',
        content: `**Symptoms:** Printer shows as offline in Windows but responds to ping

**Troubleshooting steps:**
1. Check print spooler service status
2. Test direct IP connectivity
3. Verify port configuration (WSD vs TCP/IP)
4. Clear print queue if stuck jobs exist
5. Test printer sharing settings

**Common solutions:**
- Restart spooler service
- Delete and recreate printer
- Update printer drivers
- Check firewall settings`,
        category: KnowledgeCategory.TROUBLESHOOTING,
        tags: ['printer', 'offline', 'spooler', 'network'],
        relatedTasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'User says "internet is down"',
        content: `**Important:** Always clarify scope first!

**Questions to ask:**
- Is it affecting one site or multiple?
- One device or multiple devices?
- One application or all applications?
- One user or multiple users?
- Wired connection or Wi-Fi?

**Common scenarios:**
1. **Single device:** Check local network, DNS, proxy settings
2. **Single user:** Profile issues, cached credentials
3. **Wi-Fi only:** Access point problems, signal strength
4. **Wired only:** Cable issues, switch ports
5. **All users:** ISP outage, router/firewall problems

**Quick tests:**
- Ping gateway/router
- Ping external IP (8.8.8.8)
- DNS resolution (google.com)
- Traceroute to confirm path`,
        category: KnowledgeCategory.PROCEDURE,
        tags: ['internet', 'connectivity', 'network', 'troubleshooting'],
        relatedTasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.knowledgeEntries.bulkAdd(knowledgeEntries);

    // Seed playbooks
    const playbooks: Playbook[] = [
      {
        id: generateId(),
        title: 'No Internet Connectivity',
        description: 'Step-by-step troubleshooting for internet connectivity issues',
        category: PlaybookCategory.TROUBLESHOOTING,
        steps: [
          {
            id: generateId(),
            title: 'Clarify scope of the issue',
            description: 'Determine if it affects one device, multiple devices, wired/wireless, etc.',
            order: 1,
            estimatedTime: 5,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Check physical connections',
            description: 'Verify cables are connected, try different ports/cables',
            order: 2,
            estimatedTime: 5,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Test network connectivity',
            description: 'Ping router, ping external IPs, check DNS resolution',
            order: 3,
            estimatedTime: 10,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Restart networking equipment',
            description: 'Power cycle modem, router, switches, access points',
            order: 4,
            estimatedTime: 15,
            completed: false,
          },
        ],
        tags: ['internet', 'connectivity', 'network'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Printer Offline Troubleshooting',
        description: 'Resolve printer offline issues systematically',
        category: PlaybookCategory.MAINTENANCE,
        steps: [
          {
            id: generateId(),
            title: 'Verify printer power and connectivity',
            description: 'Check power, cables, network connection',
            order: 1,
            estimatedTime: 2,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Test direct printer access',
            description: 'Print test page from printer, access web interface',
            order: 2,
            estimatedTime: 5,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Check Windows print spooler',
            description: 'Restart print spooler service, clear stuck jobs',
            order: 3,
            estimatedTime: 5,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Reinstall printer driver',
            description: 'Remove and reinstall printer with latest drivers',
            order: 4,
            estimatedTime: 10,
            completed: false,
          },
        ],
        tags: ['printer', 'offline', 'spooler', 'drivers'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'New User Setup Checklist',
        description: 'Complete setup process for new user accounts',
        category: PlaybookCategory.SETUP,
        steps: [
          {
            id: generateId(),
            title: 'Create user account in Active Directory',
            description: 'Set up AD account with proper groups and permissions',
            order: 1,
            estimatedTime: 10,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Configure email account',
            description: 'Set up Exchange/Office 365 mailbox and Outlook profile',
            order: 2,
            estimatedTime: 15,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Set up workstation',
            description: 'Install software, configure desktop, set up printers',
            order: 3,
            estimatedTime: 30,
            completed: false,
          },
          {
            id: generateId(),
            title: 'Provide user training',
            description: 'Walk through key systems and answer questions',
            order: 4,
            estimatedTime: 20,
            completed: false,
          },
        ],
        tags: ['user', 'setup', 'onboarding', 'account'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.playbooks.bulkAdd(playbooks);

    // Seed learning items
    const learningItems: LearningItem[] = [
      {
        id: generateId(),
        title: 'Datto RMM Basics',
        description: 'Learn fundamental Datto RMM operations for remote monitoring and management',
        category: LearningCategory.TOOL,
        status: LearningStatus.TODO,
        priority: LearningPriority.HIGH,
        resources: ['https://help.aem.autotask.net/', 'Internal documentation'],
        notes: 'Focus on agent deployment, basic monitoring, and alert handling',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'RustDesk Remote Support Workflow',
        description: 'Master RustDesk for efficient remote desktop support sessions',
        category: LearningCategory.TOOL,
        status: LearningStatus.IN_PROGRESS,
        priority: LearningPriority.HIGH,
        resources: ['https://rustdesk.com/docs/', 'Practice sessions'],
        notes: 'Learn quick connection methods and screen sharing best practices',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Microsoft 365 Admin Essentials',
        description: 'Core Microsoft 365 administration skills for user and tenant management',
        category: LearningCategory.TECHNICAL,
        status: LearningStatus.TODO,
        priority: LearningPriority.MEDIUM,
        resources: ['https://learn.microsoft.com/en-us/microsoft-365/', 'Admin portal practice'],
        notes: 'User creation, license assignment, basic troubleshooting',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Printer Troubleshooting Patterns',
        description: 'Common printer issues and systematic resolution approaches',
        category: LearningCategory.TECHNICAL,
        status: LearningStatus.COMPLETED,
        priority: LearningPriority.MEDIUM,
        resources: ['Internal knowledge base', 'Manufacturer documentation'],
        notes: 'Focus on network printers, driver issues, and queue management',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.learningItems.bulkAdd(learningItems);

    // Seed tasks
    const tasks: Task[] = [
      {
        id: generateId(),
        title: 'Complete Datto RMM training',
        description: 'Finish the basic Datto RMM certification course',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        category: TaskCategory.PD,
        tags: ['training', 'datto', 'rmm'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Update client documentation',
        description: 'Review and update documentation for all active clients',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        category: TaskCategory.BUSINESS,
        tags: ['documentation', 'clients'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Set up backup monitoring alerts',
        description: 'Configure automated alerts for backup failures across all clients',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        category: TaskCategory.TECHNICAL,
        tags: ['backup', 'monitoring', 'alerts'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.tasks.bulkAdd(tasks);

    // Seed PD achievements and goals
    const pdAchievements: PDAchievement[] = [
      {
        id: generateId(),
        title: 'CompTIA A+ Certification',
        description: 'Completed CompTIA A+ hardware and software certification',
        category: PDCategory.CERTIFICATION,
        dateAchieved: new Date('2024-01-15'),
        evidence: 'certificate.pdf',
        notes: 'Passed both Core 1 and Core 2 exams',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        title: 'Microsoft 365 Fundamentals',
        description: 'Completed Microsoft 365 Fundamentals certification',
        category: PDCategory.CERTIFICATION,
        dateAchieved: new Date('2024-02-20'),
        evidence: 'ms365-fundamentals.pdf',
        notes: 'Covers cloud concepts, core Microsoft 365 services, and security',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.pdAchievements.bulkAdd(pdAchievements);

    const pdGoals: PDGoal[] = [
      {
        id: generateId(),
        title: 'Complete Network+ Certification',
        description: 'Obtain CompTIA Network+ certification for advanced networking knowledge',
        category: PDCategory.CERTIFICATION,
        targetDate: new Date('2024-12-31'),
        status: PDGoalStatus.ACTIVE,
        progress: 25,
        milestones: [
          {
            id: generateId(),
            title: 'Complete Network+ study guide',
            description: 'Finish reading and note-taking for Network+ material',
            targetDate: new Date('2024-08-31'),
            completed: false,
          },
          {
            id: generateId(),
            title: 'Pass Network+ practice exams',
            description: 'Achieve 80%+ on practice exams',
            targetDate: new Date('2024-10-31'),
            completed: false,
          },
          {
            id: generateId(),
            title: 'Schedule and pass certification exam',
            description: 'Register for and pass the Network+ exam',
            targetDate: new Date('2024-12-31'),
            completed: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.pdGoals.bulkAdd(pdGoals);

    // Seed app settings
    const appSettings: AppSettings[] = [
      {
        id: 'default',
        theme: 'system',
        notifications: true,
        autoBackup: true,
        defaultWorkCategory: WorkCategory.SUPPORT,
        workingHours: {
          start: '08:30',
          end: '17:00',
        },
        updatedAt: new Date(),
      },
    ];

    await db.appSettings.bulkAdd(appSettings);

    // Seed projects
    const projects: Project[] = [
      {
        id: generateId(),
        name: 'Central West Accounting Migration',
        description: 'Complete Microsoft 365 migration and optimization',
        clientId: clients[0].id,
        status: ProjectStatus.ACTIVE,
        startDate: new Date('2024-03-01'),
        tags: ['migration', 'microsoft-365', 'email'],
        budget: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Dubbo Family Dental Backup Setup',
        description: 'Implement comprehensive backup solution for patient records',
        clientId: clients[1].id,
        status: ProjectStatus.PLANNING,
        tags: ['backup', 'security', 'patient-data'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.projects.bulkAdd(projects);

    // Seed invoices
    const invoices: Invoice[] = [
      {
        id: generateId(),
        clientId: clients[0].id,
        period: {
          start: new Date('2024-04-01'),
          end: new Date('2024-04-30'),
        },
        hours: 68, // 8.5 hours * 8 days
        rate: 65,
        total: 4420,
        status: InvoiceStatus.PAID,
        issuedDate: new Date('2024-05-01'),
        paidDate: new Date('2024-05-15'),
        notes: 'April 2024 support hours',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.invoices.bulkAdd(invoices);

    console.log('Database seeded successfully with sample data');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};
