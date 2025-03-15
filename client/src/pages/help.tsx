import DashboardLayout from "@/components/layout/DashboardLayout";
import AiChat from "@/components/chat/AiChat";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircle } from "lucide-react";

export default function Help() {
  const faqs = [
    {
      question: "How do I earn points?",
      answer: "You can earn points by completing various tasks such as watching ads, taking surveys, and playing mini-games. Each task has different point values clearly displayed before you start."
    },
    {
      question: "What are the withdrawal options?",
      answer: "We offer multiple withdrawal methods including UPI (₹5 fee), Bank Transfer (₹20 fee), and PayPal (₹10 + provider fee). The minimum withdrawal amount is ₹50 and maximum is ₹500."
    },
    {
      question: "When can I withdraw my earnings?",
      answer: "Withdrawals are processed from the 1st to 10th of every month. This schedule helps us manage payments efficiently as ad networks pay monthly."
    },
    {
      question: "Why was my withdrawal rejected?",
      answer: "Withdrawals may be rejected if there's suspicious activity, insufficient balance, or incorrect payment details. Make sure to verify your phone number and provide accurate withdrawal information."
    },
    {
      question: "How does the referral system work?",
      answer: "Share your unique referral code with friends. When they join and complete tasks, you'll earn bonus points for successful referrals."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started",
      content: "Complete your profile by adding your phone number and payment details. This information is required for withdrawals and is stored securely."
    },
    {
      title: "Completing Tasks",
      content: "Browse available tasks in the Tasks section. Follow the instructions carefully and ensure you complete tasks honestly to avoid any issues with rewards."
    },
    {
      title: "Withdrawing Earnings",
      content: "Once you've earned at least 50 points, you can request a withdrawal during the first 10 days of each month. Choose your preferred payment method and enter accurate details."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Help Center</h2>
          <p className="text-muted-foreground">
            Get answers to your questions and chat with our AI assistant
          </p>
        </div>

        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ & Tutorials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <AiChat />
          </TabsContent>

          <TabsContent value="faq" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {tutorials.map((tutorial, index) => (
                      <AccordionItem key={index} value={`tutorial-${index}`}>
                        <AccordionTrigger className="text-left">
                          {tutorial.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          {tutorial.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
