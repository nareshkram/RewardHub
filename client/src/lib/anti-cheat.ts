import { toast } from "@/hooks/use-toast";

interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
  hardware: {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
}

interface BehaviorMetrics {
  taskCompletionSpeed: number;
  mouseMovements: boolean;
  keyboardEvents: boolean;
  timeSpent: number;
}

class AntiCheatService {
  private static instance: AntiCheatService;
  private suspiciousPatterns: Set<string> = new Set();

  private constructor() {}

  static getInstance(): AntiCheatService {
    if (!AntiCheatService.instance) {
      AntiCheatService.instance = new AntiCheatService();
    }
    return AntiCheatService.instance;
  }

  getDeviceFingerprint(): DeviceInfo {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hardware: {
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
      }
    };
  }

  async detectVPN(): Promise<boolean> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      // Check for common VPN providers and data center IPs
      return data.org?.toLowerCase().includes('vpn') || 
             data.org?.toLowerCase().includes('proxy');
    } catch (error) {
      console.error('Error detecting VPN:', error);
      return false;
    }
  }

  validateTaskCompletion(metrics: BehaviorMetrics): boolean {
    const isValid = 
      metrics.taskCompletionSpeed > 2 && // Minimum 2 seconds per task
      metrics.mouseMovements && // Must have mouse movement
      metrics.keyboardEvents && // Must have keyboard interaction
      metrics.timeSpent > 5; // Minimum 5 seconds spent on task

    if (!isValid) {
      this.reportSuspiciousActivity('Automated task completion detected');
    }

    return isValid;
  }

  validateEarningPattern(userId: number, amount: number): boolean {
    const key = `${userId}-${new Date().toDateString()}`;
    const dailyEarnings = localStorage.getItem(key) || '0';
    const totalEarnings = parseFloat(dailyEarnings) + amount;

    if (totalEarnings > 500) { // Maximum ₹500 per day
      this.reportSuspiciousActivity('Daily earning limit exceeded');
      return false;
    }

    localStorage.setItem(key, totalEarnings.toString());
    return true;
  }

  private reportSuspiciousActivity(reason: string) {
    toast({
      title: "Suspicious Activity Detected",
      description: "Your account is under review for potential violation of our terms.",
      variant: "destructive",
    });

    // Log suspicious activity
    console.warn('Suspicious activity:', reason);
  }

  async validateUser(): Promise<boolean> {
    const deviceInfo = this.getDeviceFingerprint();
    const isUsingVPN = await this.detectVPN();

    if (isUsingVPN) {
      this.reportSuspiciousActivity('VPN usage detected');
      return false;
    }

    // Check for multiple accounts from same device
    const deviceKey = btoa(JSON.stringify(deviceInfo));
    const knownDevices = localStorage.getItem('known_devices') || '[]';
    const devices = JSON.parse(knownDevices);

    if (devices.includes(deviceKey)) {
      this.reportSuspiciousActivity('Multiple accounts detected');
      return false;
    }

    devices.push(deviceKey);
    localStorage.setItem('known_devices', JSON.stringify(devices));

    return true;
  }
}

export const antiCheat = AntiCheatService.getInstance();
