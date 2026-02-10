'use client';

import { Check, CreditCard, PieChart, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for small side projects.',
        features: ['1,000 Submissions/mo', '1 Project', 'Basic Analytics', 'Community Support'],
        current: true,
        buttonText: 'Current Plan',
        buttonVariant: 'outline' as const,
    },
    {
        name: 'Pro',
        price: '$29',
        description: 'Best for growing startups.',
        features: ['50,000 Submissions/mo', 'Unlimited Projects', 'Advanced Insights', 'Priority Support', 'Custom Branding'],
        current: false,
        buttonText: 'Upgrade to Pro',
        buttonVariant: 'default' as const,
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For power users and teams.',
        features: ['Unlimited Submissions', 'SLA Guarantee', 'Dedicated Account Manager', 'Custom Integrations', 'White-labeling'],
        current: false,
        buttonText: 'Contact Sales',
        buttonVariant: 'outline' as const,
    },
];

export default function BillingPage() {
    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
                    <p className="text-muted-foreground mt-1">Manage your subscription and usage limits.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        Current Usage: 12% of Free Plan
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`relative h-full flex flex-col border-white/10 bg-card/30 backdrop-blur-xl ${plan.popular ? 'border-purple-500/50 shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-lg">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4 flex items-baseline text-white">
                                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="ml-1 text-sm font-semibold text-muted-foreground">/month</span>}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className="rounded-full bg-purple-500/20 p-1">
                                                <Check className="h-3 w-3 text-purple-400" />
                                            </div>
                                            <span className="text-muted-foreground/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full h-11 font-bold rounded-xl"
                                    variant={plan.buttonVariant}
                                    disabled={plan.current}
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-purple-400" /> Usage Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Submissions</span>
                                <span className="font-medium text-white">124 / 1,000</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: '12.4%' }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Projects</span>
                                <span className="font-medium text-white">1 / 1</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500" style={{ width: '100%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-400" /> Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-14 rounded-md border border-white/10 bg-white/5 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-white/50" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">No card on file</p>
                                <p className="text-xs text-muted-foreground">Free plan doesn't require a card.</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                            Add Card
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
