import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-muted-foreground">Privacy Policy</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: March 15, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold mb-2">1. Information We Collect</h3>
              <p>We collect the following information to provide and improve our services:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Personal Information (name, email, date of birth)</li>
                <li>Phone Number (for withdrawal purposes only)</li>
                <li>Location Data (for service customization)</li>
                <li>Device Information (for security)</li>
                <li>Usage Data (for performance improvement)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain our service</li>
                <li>To process your withdrawals</li>
                <li>To prevent fraudulent activities</li>
                <li>To customize content and currency based on your location</li>
                <li>To communicate service updates</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Data Security</h3>
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Secure storage using Firebase</li>
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Multi-factor authentication options</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Third-Party Services</h3>
              <p>We use trusted third-party services for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Authentication (Google, Facebook)</li>
                <li>Analytics</li>
                <li>Payment Processing</li>
                <li>Advertisement Services</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request data deletion</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Contact Us</h3>
              <p>For any privacy-related concerns, please contact us at:</p>
              <p>Email: privacy@rewardhub.com</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
