import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Book, 
  MessageCircle, 
  FileText, 
  Video, 
  Mail,
  ExternalLink,
  Users,
  Settings,
  Calendar,
  BarChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of using WHEEWLS",
      color: "bg-blue-500",
      articles: [
        "Setting up your first project",
        "Creating and managing teams",
        "Understanding the dashboard",
        "Basic navigation guide"
      ]
    },
    {
      title: "Project Management",
      icon: FileText,
      description: "Master project organization and workflows",
      color: "bg-green-500",
      articles: [
        "Creating project templates",
        "Task management best practices",
        "Using the Kanban board",
        "Project collaboration tools"
      ]
    },
    {
      title: "Team Collaboration",
      icon: Users,
      description: "Work effectively with your team",
      color: "bg-purple-500",
      articles: [
        "Inviting team members",
        "Setting user permissions",
        "Team messaging features",
        "File sharing and storage"
      ]
    },
    {
      title: "Calendar & Scheduling",
      icon: Calendar,
      description: "Manage schedules and plan shifts",
      color: "bg-orange-500",
      articles: [
        "Creating shift schedules",
        "Managing availability",
        "Meeting scheduling",
        "Calendar integrations"
      ]
    },
    {
      title: "Analytics & Reports",
      icon: BarChart,
      description: "Track progress and generate insights",
      color: "bg-red-500",
      articles: [
        "Understanding analytics dashboard",
        "Generating custom reports",
        "Performance metrics",
        "Data export options"
      ]
    },
    {
      title: "Account & Settings",
      icon: Settings,
      description: "Manage your account and preferences",
      color: "bg-gray-500",
      articles: [
        "Profile customization",
        "Notification settings",
        "Security and privacy",
        "Subscription management"
      ]
    }
  ];

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password."
    },
    {
      question: "Can I invite unlimited team members?",
      answer: "The number of team members you can invite depends on your subscription plan. Free plans allow up to 5 members, while paid plans offer unlimited team members."
    },
    {
      question: "How do I export my project data?",
      answer: "You can export your project data from the Analytics page. Click on the 'Export' button and choose your preferred format (CSV, PDF, or Excel)."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your data. All data is stored securely and backed up regularly."
    },
    {
      question: "Can I integrate with other tools?",
      answer: "WHEEWLS offers integrations with popular tools like Google Calendar, Slack, and various project management platforms. Check our integrations page for the full list."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "You can upgrade your subscription from the Subscription page in your account settings. Changes take effect immediately."
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      action: "Start Chat",
      available: "Available 24/7"
    },
    {
      title: "Email Support",
      description: "Send us your questions via email",
      icon: Mail,
      action: "Send Email",
      available: "Response within 24 hours"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: Video,
      action: "Watch Now",
      available: "50+ tutorials available"
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to your questions, learn how to use WHEEWLS effectively, and get the support you need.
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button size="lg" onClick={() => navigate('/getting-started')} aria-label="Open Getting Started guide">
              <Book className="w-4 h-4 mr-2" />
              Getting Started Guide
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 ${option.title === 'Live Chat' ? 'bg-green-100' : option.title === 'Email Support' ? 'bg-blue-100' : 'bg-purple-100'} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <option.icon className={`w-6 h-6 ${option.title === 'Live Chat' ? 'text-green-600' : option.title === 'Email Support' ? 'text-blue-600' : 'text-purple-600'}`} />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full mb-2">
                  {option.action}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-sm text-muted-foreground">{option.available}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { if (category.title === 'Getting Started') navigate('/getting-started'); }}
                role={category.title === 'Getting Started' ? 'button' : undefined}
                aria-label={category.title === 'Getting Started' ? 'Open Getting Started guide' : undefined}
              >
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.slice(0, 3).map((article, articleIndex) => (
                      <li key={articleIndex} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        • {article}
                      </li>
                    ))}
                    {category.articles.length > 3 && (
                      <li className="text-sm text-primary cursor-pointer">
                        + {category.articles.length - 3} more articles
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card id="contact" className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get the most out of WHEEWLS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg">
                <Video className="w-4 h-4 mr-2" />
                Schedule a Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HelpCenter;